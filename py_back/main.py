import requests
import base64
import os
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
import uvicorn
import time
import tempfile
import cv2
from typing import List, Dict
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
load_dotenv()
API_KEY = os.getenv('API_KEY_PLATE')

def extract_frames(video_path: str) -> List[bytes]:
    frames = []
    video = cv2.VideoCapture(video_path)
    
    fps = video.get(cv2.CAP_PROP_FPS)
    frame_interval = int(fps)
    
    frame_count = 0
    success, frame = video.read()
    
    while success:
        if frame_count % frame_interval == 0:
            _, buffer = cv2.imencode('.jpg', frame)
            frames.append(buffer.tobytes())
        
        success, frame = video.read()
        frame_count += 1
    
    video.release()
    return frames

@app.post("/plate")
async def plate(file: UploadFile = File(...)) -> Dict:
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        frames = extract_frames(tmp_path)
        
        results = {}
        for idx, frame_data in enumerate(frames):
            frame_key = f"{idx:03d}"
            
            timestamp = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
            
            response = requests.post(
                'https://api.platerecognizer.com/v1/plate-reader/',
                files={'upload': ('frame.jpg', frame_data)},
                headers={'Authorization': 'Token ' + API_KEY}
            )
            
            results[frame_key] = {
                'timestamp': timestamp,
                'plate_data': response.json()
            }
            
            time.sleep(1)

        return {
            'status': 'success',
            'frame_count': len(frames),
            'results': results
        }

    finally:
        os.unlink(tmp_path)

@app.get("/")
def root():
    return {"status": "online"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)