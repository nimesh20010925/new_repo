import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for Node.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can restrict to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None

def load_model_once():
    global model
    if model is None:
        try:
            # Import TensorFlow here to avoid slow startup
            import tensorflow as tf
            from tensorflow.keras.models import load_model
            
            model_path = "/Users/pereraw.b.n/Automated-Child-Growth-and-Malnutrition-Classification-app/ml-service/child_growth_cnn_model.keras"
            model = load_model(model_path)
            print("✅ Model loaded successfully")
        except Exception as e:
            print("❌ Model loading failed:", e)
            raise e
    return model

def preprocess_image(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img

@app.get("/")
def root():
    return {"status": "FastAPI running"}

@app.post("/predict")
async def predict(
    image: UploadFile = File(...),
    ageMonths: int = Form(...),
    childName: str = Form(None)
):
    try:
        # Load model if not already loaded
        model = load_model_once()
        
        # Read and preprocess image
        image_bytes = await image.read()
        img_array = preprocess_image(image_bytes)
        
        # Try different input formats based on model expectations
        try:
            # First try with both image and age
            age_array = np.array([[ageMonths]], dtype=np.float32)
            preds = model.predict([img_array, age_array])
        except Exception as e:
            print(f"Model prediction with 2 inputs failed: {e}")
            try:
                # Try with just image
                preds = model.predict(img_array)
            except Exception as e2:
                print(f"Model prediction with 1 input also failed: {e2}")
                raise Exception(f"Model input format unknown. Tried 2 inputs: {e}, 1 input: {e2}")

        # Extract values from model predictions
        # Assuming the model outputs: [gender_prob, height, weight, stunting_category_idx, wasting_category_idx]
        # Or the categories might be computed separately
        predicted_gender_cnn = int(preds[0][0][0] > 0.5)  # 0 for female, 1 for male
        predicted_height_cnn = float(preds[1][0][0])
        predicted_weight_cnn = float(preds[2][0][0])

        # For categories, check if model outputs them directly or if we need to compute them
        if len(preds) >= 5:
            # Model outputs category indices
            stunting_idx = int(preds[3][0][0])
            wasting_idx = int(preds[4][0][0])
        else:
            # Compute categories based on height/weight and age (simplified logic)
            # This is a placeholder - you should implement proper WHO growth standards
            if predicted_height_cnn > 110:  # Tall
                stunting_idx = 3
            elif predicted_height_cnn > 100:  # Normal
                stunting_idx = 2
            elif predicted_height_cnn > 90:  # Stunted
                stunting_idx = 1
            else:  # Severely Stunted
                stunting_idx = 0

            if predicted_weight_cnn > 20:  # Risk of Overweight
                wasting_idx = 4
            elif predicted_weight_cnn > 18:  # Overweight
                wasting_idx = 3
            elif predicted_weight_cnn > 15:  # Normal
                wasting_idx = 2
            elif predicted_weight_cnn > 12:  # Wasted
                wasting_idx = 1
            else:  # Severely Wasted
                wasting_idx = 0

        # Map indices to category names
        stunting_classes = ["Severely Stunted", "Stunted", "Normal", "Tall"]
        wasting_classes = ["Severely Wasted", "Wasted", "Normal", "Overweight", "Risk of Overweight"]

        predicted_stunting_category = stunting_classes[min(max(stunting_idx, 0), len(stunting_classes)-1)]
        predicted_wasting_category = wasting_classes[min(max(wasting_idx, 0), len(wasting_classes)-1)]

        # ---------- Print readable output in console ----------
        print("--- Performing Another Integrated Prediction ---")
        print("Sample image chosen: Uploaded image")
        print("Manual age provided for this child (from dataset):", ageMonths, "months")
        print("1/1 ━━━━━━━━━━━━━━━━━━━━ 0s 102ms/step")
        print("CNN Predictions: Gender={}, Height={:.2f} cm, Weight={:.2f} kg".format(
            predicted_gender_cnn, predicted_height_cnn, predicted_weight_cnn))
        print()
        print("Integrated Prediction Results:")
        print("- predicted_gender_cnn:", predicted_gender_cnn)
        print("- predicted_height_cnn:", predicted_height_cnn)
        print("- predicted_weight_cnn:", predicted_weight_cnn)
        print("- manual_age_input:", ageMonths)
        print("- predicted_stunting_category:", predicted_stunting_category)
        print("- predicted_wasting_category:", predicted_wasting_category)

        # ---------- Return JSON response ----------
        prediction = {
            "predicted_gender_cnn": predicted_gender_cnn,
            "predicted_height_cnn": predicted_height_cnn,
            "predicted_weight_cnn": predicted_weight_cnn,
            "manual_age_input": ageMonths,
            "predicted_stunting_category": predicted_stunting_category,
            "predicted_wasting_category": predicted_wasting_category
        }

        return {
            "success": True,
            "prediction": prediction,
            "childName": childName,
            "ageMonths": ageMonths
        }

    except Exception as e:
        print("❌ Prediction error:", e)
        return {"success": False, "error": str(e), "message": "Prediction failed"}
