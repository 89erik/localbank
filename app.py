#! venv/bin/python
## -*- coding: utf-8 -*-
##

from flask import Flask, request, json
from pymongo import MongoClient
from bson import json_util
from bson.objectid import ObjectId
from datetime import datetime
import dateutil.parser

import valutta

app = Flask(__name__)
db = MongoClient("localhost", 27017).localbank

valuttaer = valutta.alle_valuttaer()

@app.route('/<bank>/transaksjon', methods=["POST", "PUT"])
def post_transaksjon(bank):
    dto = request.json
    if not har_tilgang_til_bank(bank):
        return forbidden("Du har ikke tilgang til bank '%s'" % bank)
    prev = db.transaksjoner.find_one({"_id": ObjectId(dto["id"])}) if request.method == "PUT" else None
    if prev and prev["bank"] != bank:
        raise Exception("Klienten gjorde PUT transaksjon/%s på id=%s, men denne IDen har bank=%s" % (bank, dto["id"], prev["bank"]))

    transaksjon = {
            "bank": bank,
            "fra": dto["fra"],
            "til": dto["til"],
            "belop": float(dto["belop"]),
            "kommentar": dto["kommentar"] if "kommentar" in dto else "",
            "timestamp": dateutil.parser.parse(dto["timestamp"])
    }

    if dto["valutta"] != "NOK":
        belop_NOK, kurs, kursTimestamp = valutta.konverter_til_NOK(transaksjon["belop"], dto["valutta"], transaksjon["timestamp"])
        opprinnligBelop = transaksjon["belop"]
        transaksjon["belop"] = belop_NOK
        transaksjon["valutta"] = {
            "belop": opprinnligBelop,
            "id": dto["valutta"],
            "kurs": kurs,
            "timestamp": kursTimestamp
        }

    insertion = db.transaksjoner.insert_one(transaksjon)
    if prev:
        db.transaksjoner.find_one_and_update({"_id": prev["_id"]}, {"$set": {"replacedBy": insertion.inserted_id, "deleted": True}})
    
    return no_content()


def etterkommere(transaksjon):
    if "replacedBy" in transaksjon:
        etterkommer = db.transaksjoner.find_one({"_id": ObjectId(transaksjon["replacedBy"])})
        return [etterkommer] + etterkommere(etterkommer)
    else:
        return []

def forgjengere(transaksjon):
    forgjenger = db.transaksjoner.find_one({"replacedBy": transaksjon["_id"]})
    if forgjenger:
        return forgjengere(forgjenger) + [forgjenger]
    else:
        return []

@app.route('/transaksjon/<transaksjonId>/historikk', methods=['GET'])
def get_transaksjon_historikk(transaksjonId):
    transaksjon = db.transaksjoner.find_one({"_id": ObjectId(transaksjonId)})
    if not transaksjon:
        return not_found("Transaksjon med id %s finnes ikke" % transaksjonId)

    historikk = forgjengere(transaksjon) + [transaksjon] + etterkommere(transaksjon)
    antall_slettet = len(filter(lambda t: not t.get("deleted", False), historikk))
    if antall_slettet != 1:
        raise Exception("I historikken til transaksjon %s er %d aktive" % (transaksjonId, antall_slettet))
    return json.dumps(map(transaksjon_dto, historikk))

@app.route('/transaksjon/<transaksjonId>', methods=['DELETE'])
def delete_transaksjon(transaksjonId):
    bank = db.transaksjoner.find_one({"_id": ObjectId(transaksjonId)})["bank"]
    if not har_tilgang_til_bank(bank):
        return forbidden("Du har ikke tilgang til bank '%s'" % bank)
        
    db.transaksjoner.find_one_and_update({"_id": ObjectId(transaksjonId)}, {"$set": {"deleted": True}})
    return no_content()

@app.route('/<bank>/transaksjoner', methods=['GET'])
def get_transaksjoner(bank):
    if not har_tilgang_til_bank(bank):
        return forbidden("Du har ikke tilgang til bank '%s'" % bank)

    transaksjoner = db.transaksjoner.find({"deleted": {"$ne": True}, "bank": bank})
    return json.dumps(map(transaksjon_dto, transaksjoner))

def transaksjon_dto(transaksjon, extended = False):
    return {
        "id": str(transaksjon["_id"]),
        "fra": transaksjon["fra"],
        "til": transaksjon["til"],
        "belop": transaksjon["belop"],
        "timestamp": transaksjon["timestamp"].isoformat(),
        "kommentar": transaksjon["kommentar"],
        "deleted": transaksjon.get("deleted", False),
        "replacedBy": str(transaksjon["replacedBy"]) if "replacedBy" in transaksjon else None,
        "valutta": {
            "id": transaksjon["valutta"]["id"],
            "belop": transaksjon["valutta"]["belop"],
            "kurs": transaksjon["valutta"]["kurs"],
            "timestamp": transaksjon["valutta"]["timestamp"]
        } if "valutta" in transaksjon else {
            "id": "NOK"
        }
    }

def hent_bruker_fra_db():
    brukernavn = request.environ.get('REMOTE_USER') or "LAN"
    return db.brukere.find_one({"brukernavn": brukernavn})


@app.route("/bank")
@app.route("/<bank>/bank")
def get_bank(bank = None):
    bruker = hent_bruker_fra_db()
    bank = bank or bruker["defaultBank"]
    if bank not in bruker["banker"]:
        return forbidden("Du har ikke tilgang til bank '%s'" % bank)
    kontoer = db.kontoer.find({"bank": bank})
    
    return json.dumps({
        "valgtBank": bank,
        "bruker": {
            "brukernavn": bruker["brukernavn"],
            "banker": bruker["banker"]
        },
        "kontoer": map(lambda konto: {
            "navn": konto["navn"],
            "felles": konto["felles"]
        }, kontoer),
        "valuttaer": valuttaer
    })
    
def har_tilgang_til_bank(bank):
    return bank in hent_bruker_fra_db()["banker"]

def no_content():
    return ("", 204)

def not_found(msg):
    return (msg, 404)

def forbidden(msg):
    return (msg, 403)

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=5000)

