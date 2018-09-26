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
from errors import ApiException, Forbidden, NotFound, BadRequest

app = Flask(__name__)
db = MongoClient("localhost", 27017).localbank

valuttaer = valutta.alle_valuttaer()

@app.route('/<bank>/transaksjon', methods=["POST", "PUT"])
def post_transaksjon(bank):
    dto = request.json
    krev_tilgang_til_bank(bank)
    
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
        raise NotFound("Transaksjon med id %s finnes ikke" % transaksjonId)

    historikk = forgjengere(transaksjon) + [transaksjon] + etterkommere(transaksjon)
    antall_slettet = len(filter(lambda t: not t.get("deleted", False), historikk))
    if antall_slettet != 1:
        raise Exception("I historikken til transaksjon %s er %d aktive" % (transaksjonId, antall_slettet))
    return json.dumps(map(transaksjon_dto, historikk))

@app.route('/transaksjon/<transaksjonId>', methods=['DELETE'])
def delete_transaksjon(transaksjonId):
    bank = db.transaksjoner.find_one({"_id": ObjectId(transaksjonId)})["bank"]
    krev_tilgang_til_bank(bank)
        
    db.transaksjoner.find_one_and_update({"_id": ObjectId(transaksjonId)}, {"$set": {"deleted": True}})
    return no_content()

@app.route('/<bank>/transaksjoner', methods=['GET'])
def get_transaksjoner(bank):
    krev_tilgang_til_bank(bank)

    transaksjoner = db.transaksjoner.find({"deleted": {"$ne": True}, "bank": bank})
    return json.dumps(map(transaksjon_dto, transaksjoner))

def transaksjon_dto(transaksjon):
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


@app.route("/kontekst")
@app.route("/<bank>/kontekst")
def get_kontekst(bank = None):
    bruker = hent_bruker_fra_db()
    bank = bank or bruker["defaultBank"]
    if bank not in bruker["banker"]:
        raise Forbidden("Du har ikke tilgang til bank '%s'" % bank)
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
    
@app.route("/brukere")
def get_brukere():
    krev_admin()

    return json.dumps(map(lambda bruker: {
        "brukernavn": bruker["brukernavn"],
        "banker": bruker["banker"],
        "defaultBank": bruker["defaultBank"]
    }, db.brukere.find()))

@app.route("/banker")
def get_banker():
    krev_admin()

    alle_kontoer = list(db.kontoer.find())
    def kontoer(bank): return filter(lambda konto: bank == konto["bank"], alle_kontoer)

    return json.dumps(map(lambda bank: {
        "navn": bank,
        "kontoer": map(lambda konto: {
            "navn": konto["navn"],
            "felles": konto["felles"],
        }, kontoer(bank))
    }, set(map(lambda konto: konto["bank"], alle_kontoer))))

def flatten(lists):
    return [y for x in lists for y in x]

@app.route("/banker", methods = ["POST"])
def post_bank():
    krev_admin()
    
    bankId = request.json["navn"]

    kontoer = map(lambda konto: {
        "bank": bankId,
        "navn": konto["navn"],
        "felles": konto["felles"]
    }, request.json["kontoer"])

    bank_finnes = bankId in db.kontoer.distinct("bank")

    antall_felleskontoer = len(filter(lambda konto: konto["felles"], kontoer))
    if antall_felleskontoer != 1:
        raise BadRequest("Prøvde å %s bank med %d felleskontoer" % ("PUT-e" if bankId else "POST-e", antall_felleskontoer))
    
    if bank_finnes: 
        eksisterende_kontoer = frozenset(map(lambda konto: konto["navn"], db.kontoer.find({"bank": bankId})))
        nye_kontoer = frozenset(map(lambda konto: konto["navn"], kontoer))
        fjernede_kontoer = eksisterende_kontoer.difference(nye_kontoer)

        if fjernede_kontoer:
            har_transaksjon = flatten(map(lambda konto: [{"fra": konto}, {"til": konto}], fjernede_kontoer))
            transaksjoner = list(db.transaksjoner.find({"bank": bankId, "$or": har_transaksjon}))
            if transaksjoner:
                kontoer_i_transaksjoner = flatten(map(lambda t: [t["fra"], t["til"]], transaksjoner))
                fjernede_kontoer_med_transaksjoner = filter(lambda k: k in kontoer_i_transaksjoner,fjernede_kontoer)
                raise BadRequest("Kan ikke fjerne kontoer som har transaksjoner: %s" % json.dumps(fjernede_kontoer_med_transaksjoner))
        db.kontoer.delete_many({"bank": bankId})
    
    db.kontoer.insert_many(kontoer)
    return no_content()


def krev_tilgang_til_bank(bank):
    if not bank in hent_bruker_fra_db()["banker"]:
        raise Forbidden("Du har ikke tilgang til bank '%s'" % bank)

def krev_admin():
    if not hent_bruker_fra_db().get("admin", False):
        raise Forbidden("Krever admintilgang")

def no_content():
    return ("", 204)

@app.errorhandler(Exception)
def handle_error(error):
    is_known_error = isinstance(error, ApiException)
    app.log_exception(error)
    status_code = error.status_code if is_known_error else 500
    message = error.message if is_known_error else "%s: %s" % (type(error).__name__, error)
    return (message, status_code)


if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=5000)

