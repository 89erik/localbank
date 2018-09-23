#! venv/bin/python
## -*- coding: utf-8 -*-
##

raise Exception("Migrering er allerede kjørt")

from pymongo import MongoClient
from bson import json_util

from datetime import datetime, date, time
db = MongoClient("localhost", 27017).localbank

import re

import sys
sys.path.insert(0, "/media/nettverksdisk/fellesøkonomi")
from regnskap_for_migrering import overforinger


maneder=["januar","februar","mars","april","mai", "juni","juli","august","september","oktober","november","desember"]
maneder3 = map(lambda m: m[:3], maneder)


previous = datetime(2017, 07, 18)
def to_date(dag, mnd):
    global previous
    d = date(previous.year, mnd, dag)
    if d < previous.date() and (previous.month - d.month) > 1:
        d = d.replace(year=previous.year+1)
    return d

simple_date = re.compile("(\d\d)\.(\d\d)")
verbose_date = re.compile("(\d\d?)\.? +(%s)" % "|".join(maneder + maneder3))
def extract_date(kommentar):
    global previous
    m = re.search(simple_date, kommentar)
    if m:
        return to_date(int(m.group(1)), int(m.group(2)))
    m = re.search(verbose_date, kommentar)
    if m:
        mnd_str = m.group(2)
        i = maneder.index(mnd_str) if mnd_str in maneder else maneder3.index(mnd_str)
        return to_date(int(m.group(1)), i+1)

def extract_timestamp(kommentar):
    global previous
    extracted = extract_date(kommentar)
    if extracted:
        previous = datetime.combine(extracted, time.min)
    else:
        previous = previous.replace(second = previous.second+1)
    return previous


if __name__ == '__main__':
    print "Migrerer %d overføringer" % len(overforinger)

    konvertert = map(lambda o: {
        "migrert": True,
        "fra": o.fra, 
        "til": o.til, 
        "belop": o.belop, 
        "kommentar": o.kommentar,
        "timestamp": extract_timestamp(o.kommentar)
        }, reversed(overforinger))
    db.transfers.drop()
    db.transfers.insert_many(konvertert)

