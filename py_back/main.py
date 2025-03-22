from fastapi import FastAPI, UploadFile, File
import cv2
import numpy as np
import pytesseract
import os
import time 

# Placeholder classes (to be replaced with actual implementations)
class LicensePlateDetector:
    def detect(self, frame):
        # Replace with actual detection logic (e.g., YOLO)
        # Should return list of bounding boxes: [{'bbox': [x, y, w, h]}, ...]
        pass

class Tracker:
    def update(self, detections):
        # Replace with actual tracking logic (e.g., SORT)
        # Should return list of tracks: [{'id': track_id, 'bbox': [x, y, w, h]}, ...]
        pass

app = FastAPI()

# Initialize detector and tracker
detector = LicensePlateDetector()
tracker = Tracker()

@app.post("/detect_plates")
async def detect_plates(file: UploadFile = File(...)):
    """
    API endpoint to detect license plates from a video file.
    Returns the number of unique cars and their plate numbers.
    """
    # Save the uploaded video temporarily
    temp_video_path = "temp_video.mp4"
    with open(temp_video_path, "wb") as f:
        f.write(await file.read())
    
    # Open the video file
    cap = cv2.VideoCapture(temp_video_path)
    plates_data = []  # Store track ID and plate text pairs
    
    # Process video frame by frame
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        # Detect license plates in the current frame
        detections = detector.detect(frame)
        
        # Update tracker with detections
        tracks = tracker.update(detections)
        
        # Process each tracked license plate
        for track in tracks:
            bbox = track['bbox']  # Bounding box coordinates
            track_id = track['id']  # Unique ID for the car
            
            # Crop the license plate region from the frame
            x, y, w, h = map(int, bbox)
            roi = frame[y:y+h, x:x+w]
            
            # Preprocess the image for OCR
            gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
            blur = cv2.GaussianBlur(gray, (5, 5), 0)
            _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            
            # Extract text from the license plate using OCR
            plate_text = pytesseract.image_to_string(thresh, config='--psm 8')
            
            # Store the plate text with its track ID
            plates_data.append({'track_id': track_id, 'plate_text': plate_text.strip(), 'time': time.time()})
    
    # Release the video capture object
    cap.release()
    
    # Aggregate results to identify unique cars and their plate numbers
    unique_cars = {}
    for data in plates_data:
        track_id = data['track_id']
        plate_text = data['plate_text']
        if track_id not in unique_cars:
            unique_cars[track_id] = []
        if plate_text:  # Only add non-empty plate readings
            unique_cars[track_id].append(plate_text)
    
    # Determine the final plate number for each unique car
    # # final_plates = []
    # for track_id, plates in unique_cars.items():
    #     if plates:
    #         # Use the most frequent plate reading as the final plate number
    #         final_plate = max(set(plates), key=plates.count)
    #         final_plates.append(final_plate)
    
    # # Calculate the number of unique cars
    # num_cars = len(final_plates)
    
    # Clean up the temporary video file
    os.remove(temp_video_path)
    
    # Return the results as a JSON response
    return {"plates": plates_data}

