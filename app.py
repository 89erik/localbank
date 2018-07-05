#! venv/bin/python
## -*- coding: utf-8 -*-
##

from flask import Flask, request, json
from pymongo import MongoClient
from bson import json_util
from bson.objectid import ObjectId
from datetime import datetime

app = Flask(__name__)
db = MongoClient("localhost", 27017).localbank

@app.route('/transfer', methods=["POST", "PUT"])
def post_transfer():
    dto = request.json
    transfer = {
            "fra": dto["fra"],
            "til": dto["til"],
            "belop": float(dto["belop"]),
            "kommentar": dto["kommentar"] if "kommentar" in dto else ""
    }

    if request.method == "POST":
        transfer["timestamp"] = datetime.now()
        db.transfers.insert_one(transfer)
    elif request.method == "PUT":
        prevId = ObjectId(dto["id"])
        prev = db.transfers.find_one({"_id": prevId})
        transfer["timestamp"] = prev["timestamp"]
        if any(prev[k] != transfer[k] for k in ["fra", "til", "belop", "kommentar"]):
            insertion = db.transfers.insert_one(transfer)
            db.transfers.find_one_and_update({"_id": prevId}, {"$set": {"replacedBy": insertion.inserted_id, "deleted": True}})

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
        "kommentar": transfer["kommentar"]
        }, transfers)
    return json.dumps(dto)
    
def no_content():
    return ("", 204)

def not_found(msg):
    return (msg, 404)

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=5001)

