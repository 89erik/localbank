#! venv/bin/python
## -*- coding: utf-8 -*-
##

from flask import Flask, request, json
from pymongo import MongoClient
from bson import json_util
from datetime import datetime

app = Flask(__name__)
db = MongoClient("localhost", 27017).localbank

@app.route('/transfer', methods=['POST'])
def post_transfer():
    dto = request.json;
    transfer = {
            "fra": dto["fra"],
            "til": dto["til"],
            "belop": float(dto["belop"]),
            "timestamp": datetime.now(),
            "kommentar": dto["kommentar"] if "kommentar" in dto else ""
    }

    db.transfers.insert_one(transfer)
    return no_content()

@app.route('/transfers', methods=['GET'])
def get_transfers():
    transfers = db.transfers.find({})
    dto = map(lambda transfer: {
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

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=5001)

