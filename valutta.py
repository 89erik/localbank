import urllib2
import json

def konverter_til_NOK(verdi, valutta, timestamp): 
    raw = urllib2.urlopen("https://data.norges-bank.no/api/data/EXR/B.%s.NOK.SP?lastNObservations=1&EndPeriod=%s&format=sdmx-json" % (valutta, timestamp.strftime("%Y-%m-%d"))).read()
    parsed = json.loads(raw)
    eksponent = int(filter(lambda s: s["id"] == "UNIT_MULT", parsed["structure"]["attributes"]["series"])[0]["values"][0]["id"])
    kurs = float(parsed["dataSets"][0]["series"]["0:0:0:0"]["observations"]["0"][0])
    timestamp = filter(lambda o: o["id"] == "TIME_PERIOD", parsed["structure"]["dimensions"]["observation"])[0]["values"][0]["name"]

    return (verdi * ((kurs / pow(10, eksponent)) + 0.02), kurs, timestamp)

def alle_valuttaer():
    raw = urllib2.urlopen("https://data.norges-bank.no/api/data/EXR/B..NOK.SP?lastNObservations=1&EndPeriod=2018-07-23&format=sdmx-json").read()
    parsed = json.loads(raw)
    valuttaer = map(lambda valutta: {
        "id": valutta["id"],
        "navn": valutta["name"]
    }, parsed["structure"]["dimensions"]["series"][1]["values"])

    valuttaerMap = dict(map(lambda v: (v["id"], v), valuttaer))

    priorities = ["SEK", "DKK", "EUR", "GBP", "USD"]
    return map(valuttaerMap.get, priorities) + filter(lambda v: v["id"] not in priorities, valuttaer)
