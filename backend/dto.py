from datetime import datetime

def transaksjon(transaksjon):
    return {
        "id": str(transaksjon["_id"]),
        "fra": transaksjon["fra"],
        "til": transaksjon["til"],
        "belop": transaksjon["belop"],
        "timestamp": transaksjon["timestamp"].isoformat(),
        "kommentar": transaksjon["kommentar"],
        "deleted": transaksjon.get("deleted", False),
        "forgjenger": str(transaksjon["forgjenger"]) if "forgjenger" in transaksjon else None,
        "etterkommer": str(transaksjon["etterkommer"]) if "etterkommer" in transaksjon else None,
        "valutta": {
            "id": transaksjon["valutta"]["id"],
            "belop": transaksjon["valutta"]["belop"],
            "kurs": transaksjon["valutta"]["kurs"],
            "timestamp": transaksjon["valutta"]["timestamp"]
        } if "valutta" in transaksjon else {
            "id": "NOK"
        }
    }

def konto(konto):
    return {
        "id": str(konto["_id"]),
        "navn": konto["navn"],
        "felles": konto["felles"],
        "fra": konto["fra"].isoformat() if "fra" in konto else None,
        "til": konto["til"].isoformat() if "til" in konto else None
    }
