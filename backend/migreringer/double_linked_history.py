#! ../venv/bin/python

import json
from pymongo import MongoClient

dry_run = True

db = MongoClient("localhost", 27017).localbank

alle_transaksjoner = list(db.transaksjoner.find())
alle_nye_felt = {}

for transaksjon in alle_transaksjoner:
    nye_felt = {}
    if "replacedBy" in transaksjon:
        nye_felt["etterkommer"] = transaksjon["replacedBy"]

    forgjenger = list(filter(lambda t: t.get("replacedBy", None) == transaksjon["_id"], alle_transaksjoner))
    assert len(forgjenger) <= 1
    if forgjenger:
        nye_felt["forgjenger"] = forgjenger[0]["_id"]

    if nye_felt:
        alle_nye_felt[transaksjon["_id"]] = nye_felt

def printable(d):
    return dict(map(lambda (key, value): (str(key), printable(value) if type(value) is dict else str(value)), d.iteritems()))

print "nye felt"
print json.dumps(printable(alle_nye_felt), indent=2)
assertions = 0
for transaksjon, mine in alle_nye_felt.iteritems():
    if "forgjenger" in mine:
        assertions += 1
        assert alle_nye_felt[mine["forgjenger"]]["etterkommer"] == transaksjon
    if "etterkommer" in mine:
        assertions += 1
        assert alle_nye_felt[mine["etterkommer"]]["forgjenger"] == transaksjon

print "%d assertions ok" % assertions

if dry_run:
    print("Dry run")
else:
    print("starter migrering")

for transaksjon, oppdatering in alle_nye_felt.iteritems():
    print transaksjon, oppdatering
    if not dry_run:
        db.transaksjoner.update({"_id": transaksjon}, {"$set": oppdatering, "$unset": {"replacedBy": ""}})
