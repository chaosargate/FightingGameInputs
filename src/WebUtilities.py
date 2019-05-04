import json


def make_response(status, data=None):
    response = {
        "status": status
    }

    if data:
        response["data"] = data

    return json.dumps(response)
