import tensorflow as tf
from tensorflow.keras.models import load_model
import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from PIL import Image
import io

app = FastAPI()

# Enable CORS for your Node.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once at startup
model = None

@app.on_event("startup")
async def load_model_once():
    global model
    model_path = "/Users/pereraw.b.n/Automated-Child-Growth-and-Malnutrition-Classification-app/train model/child_growth_model.keras"
    model = load_model(model_path)
    print("✅ Model loaded successfully!")

def preprocess_image(image_bytes):
    # Convert bytes to OpenCV image
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Resize and normalize
    IMG_SIZE = 224
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    
    return img

@app.post("/predict")
async def predict(
    image: UploadFile = File(...),
    ageMonths: int = Form(...),
    childName: str = Form(None)
):
    try:
        # Read image file
        image_bytes = await image.read()
        
        # Preprocess image
        img_array = preprocess_image(image_bytes)
        
        # Prepare age input
        age_array = np.array([[ageMonths]])
        
        # Make prediction
        preds = model.predict([img_array, age_array])
        
        # Extract predictions
        pred_height = float(preds[0][0][0])
        pred_weight = float(preds[1][0][0])
        pred_head   = float(preds[2][0][0])
        pred_waist  = float(preds[3][0][0])
        pred_gender = int(preds[4][0][0] > 0.5)
        pred_health = int(preds[5][0][0] > 0.5)
        
        # Clip negative values
        pred_height = max(0, pred_height)
        pred_weight = max(0, pred_weight)
        pred_head   = max(0, pred_head)
        pred_waist  = max(0, pred_waist)
        
        prediction = {
            "height_cm": pred_height,
            "weight_kg": pred_weight / 1000,  # Convert g to kg
            "head_circumference_cm": pred_head,
            "waist_circumference_cm": pred_waist,
            "gender": "male" if pred_gender == 1 else "female",
            "health_status": "healthy" if pred_health == 1 else "unhealthy",
            "age_months": ageMonths,
            "childName": childName
        }
        
        return {
            "success": True,
            "prediction": prediction,
            "message": "Prediction completed successfully"
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": "Prediction failed"
        }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)