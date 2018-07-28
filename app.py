#! venv/bin/python
## -*- coding: utf-8 -*-
##

from flask import Flask, request, json
from pymongo import MongoClient
from bson import json_util
from bson.objectid import ObjectId
from datetime import datetime

import valutta

app = Flask(__name__)
db = MongoClient("localhost", 27017).localbank

@app.route('/transfer', methods=["POST", "PUT"])
def post_transfer():
    dto = request.json
    if not har_tilgang_til_bank(dto["bank"]):
        return forbidden("Du har ikke tilgang til bank '%s'" % dto["bank"])
    prev = db.transfers.find_one({"_id": ObjectId(dto["id"])}) if request.method == "PUT" else None
    if prev and prev["bank"] != dto["bank"]:
        raise Exception("Klienten gjorde PUT transfer/%s på id=%s, men denne IDen har bank=%s" % (dto["bank"], dto["id"], prev["bank"]))

    transfer = {
            "bank": dto["bank"],
            "fra": dto["fra"],
            "til": dto["til"],
            "belop": float(dto["belop"]),
            "kommentar": dto["kommentar"] if "kommentar" in dto else "",
            "timestamp": prev["timestamp"] if prev else datetime.now()
    }

    if "valutta" in dto and dto["valutta"]:
        belop_NOK, kurs, kursTimestamp = valutta.konverter_til_NOK(transfer["belop"], dto["valutta"], transfer["timestamp"])
        opprinnligBelop = transfer["belop"]
        transfer["belop"] = belop_NOK
        transfer["valutta"] = {
            "belop": opprinnligBelop,
            "navn": dto["valutta"],
            "kurs": kurs,
            "timestamp": kursTimestamp
        }

    insertion = db.transfers.insert_one(transfer)
    if prev:
        db.transfers.find_one_and_update({"_id": prev["_id"]}, {"$set": {"replacedBy": insertion.inserted_id, "deleted": True}})
    
    return no_content()

@app.route('/transfer/<transferId>', methods=['DELETE'])
def delete_transfer(transferId):
    bank = db.transfers.find_one({"_id": ObjectId(transferId)})["bank"]
    if not har_tilgang_til_bank(bank):
        return forbidden("Du har ikke tilgang til bank '%s'" % bank)
        
    db.transfers.find_one_and_update({"_id": ObjectId(transferId)}, {"$set": {"deleted": True}})
    return no_content()

@app.route('/transfers/<bank>', methods=['GET'])
def get_transfers(bank):
    if not har_tilgang_til_bank(bank):
        return forbidden("Du har ikke tilgang til bank '%s'" % bank)

    transfers = db.transfers.find({"deleted": {"$ne": True}, "bank": bank})
    dto = map(lambda transfer: {
        "id": str(transfer["_id"]),
        "fra": transfer["fra"],
        "til": transfer["til"],
        "belop": transfer["belop"],
        "timestamp": transfer["timestamp"].isoformat(),
        "kommentar": transfer["kommentar"],
        "valutta": {
            "timestamp": transfer["valutta"]["timestamp"],
            "belop": transfer["valutta"]["belop"],
            "navn": transfer["valutta"]["navn"],
            "kurs": transfer["valutta"]["kurs"]
        } if "valutta" in transfer else None
        }, transfers)
    return json.dumps(dto)
    
@app.route('/kontoer/<bank>', methods=['GET'])
def get_kontoer(bank):
    if not har_tilgang_til_bank(bank):
        return forbidden("Du har ikke tilgang til bank '%s'" % bank)
    dto = map(lambda konto: {
        "navn": konto["navn"],
        "felles": konto["felles"]
    }, db.kontoer.find({"bank": bank}))
    n_felleskontoer = len(filter(lambda konto: konto["felles"], dto))
    if n_felleskontoer != 1:
        raise Exception("%d felles-kontoer" % n_felleskontoer)
    
    return json.dumps(dto)

valuttaer = None
@app.route('/valuttaer', methods=['GET'])
@app.route('/valuttaer/<force>', methods=['GET'])
def get_valuttaer(force = False):
    global valuttaer
    if not valuttaer or force:
        valuttaer = valutta.alle_valuttaer()
    return json.dumps(valuttaer)

def hent_bruker_fra_db():
    brukernavn = request.environ.get('REMOTE_USER') or "LAN"
    return db.brukere.find_one({"brukernavn": brukernavn})
    

@app.route('/bruker')
def get_bruker():
    bruker = hent_bruker_fra_db()
    if bruker:
        return json.dumps({
            "brukernavn": bruker["brukernavn"],
            "defaultBank": bruker["defaultBank"],
            "banker": bruker["banker"]
        })
    else:
        return not_found

def har_tilgang_til_bank(bank):
    return bank in hent_bruker_fra_db()["banker"]

def no_content():
    return ("", 204)

def not_found(msg):
    return (msg, 404)

def forbidden(msg):
    return (msg, 403)

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=5001)

