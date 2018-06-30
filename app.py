#! venv/bin/python
## -*- coding: utf-8 -*-
##

from flask import Flask, request, json
from pymongo import MongoClient
from bson import json_util

app = Flask(__name__)
db = MongoClient("localhost", 27017).localbank

@app.route('/transfer', methods=['POST'])
def post_transfer():
    dto = request.json;
    transfer = {
            "from": dto["from"],
            "to": dto["to"],
            "amount": float(dto["amount"])
    }

    db.transfers.insert_one(transfer)
    return no_content()

@app.route('/transfers', methods=['GET'])
def get_transfers():
    transfers = db.transfers.find({})
    return to_json(transfers)
    

def to_json(page):
    return json.dumps(json.loads(json_util.dumps(page)))

def no_content():
    return ("", 204)

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=5001)

