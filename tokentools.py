import requests
import json
import os
from dotenv import load_dotenv
from pathlib import Path
from web3.auto import w3

load_dotenv('JL.env')

headers = {
    "Content-Type": "application/json",
    "pinata_api_key": os.getenv("PINATA_API_KEY"),
    "pinata_secret_api_key": os.getenv("PINATA_SECRET_KEY"),
}

def initContract():
    with open(Path("Tokenize.json")) as json_file:
        abi = json.load(json_file)

    return w3.eth.contract(address=os.getenv("ARTREGISTRY_ADDRESS"), abi=abi)

def convertDataToJSON(title, artist_name):
    data = {
        "pinataOptions": {"cidVersion": 1},
        "pinataContent": {
            "title": title,
            "artist_name": artist_name
        },
    }
    return json.dumps(data)

def pinJSONtoIPFS(json):
    r = requests.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS", data=json, headers=headers
    )
    ipfs_hash = r.json()["IpfsHash"]
    return f"ipfs://{ipfs_hash}"