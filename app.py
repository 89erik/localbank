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
            "timestamp": datetime.now(),
            "kommentar": dto["kommentar"] if "kommentar" in dto else ""
    }

    if request.method == "POST":
        db.transfers.insert_one(transfer)
    elif request.method == "PUT":
        res = db.transfers.replace_one({"_id": ObjectId(dto["id"])}, transfer)
        if not (res.acknowledged and res.matched_count == 1): 
            return not_found(dto["id"])
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
    return to_json(dto)
    

def to_json(page):
    return json.dumps(json.loads(json_util.dumps(page)))

def no_content():
    return ("", 204)

def not_found(msg):
    return (msg, 404)

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=5001)

