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

    prev = db.transfers.find_one({"_id": ObjectId(dto["id"])}) if request.method == "PUT" else None

    transfer = {
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
    db.transfers.find_one_and_update({"_id": ObjectId(transferId)}, {"$set": {"deleted": True}})
    return no_content()

@app.route('/transfers', methods=['GET'])
def get_transfers():
    not_deleted = {"deleted": {"$ne": True}}
    transfers = db.transfers.find(not_deleted)
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
    
@app.route('/kontoer', methods=['GET'])
def get_kontoer():
    dto = map(lambda konto: {
        "navn": konto["navn"],
        "felles": konto["felles"]
    }, db.kontoer.find())
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

def no_content():
    return ("", 204)

def not_found(msg):
    return (msg, 404)

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=5001)

