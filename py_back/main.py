import requests
import base64
import os
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
import uvicorn

app = FastAPI()
load_dotenv()
API_KEY = os.getenv('API_KEY_PLATE')

@app.post("/plate")
def plate(file: UploadFile = File(...)):
    response = requests.post(
        'https://api.platerecognizer.com/v1/plate-reader/',
        files=dict(upload=file.file.read()),
        headers={'Authorization': 'Token ' + API_KEY})
    return response.json()

@app.get("/")
def root():
    return {"status": "online"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)