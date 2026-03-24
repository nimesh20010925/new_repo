import tensorflow as tf
from tensorflow.keras.models import load_model
import cv2
import numpy as np

# Load the trained model
model = load_model("/Users/pereraw.b.n/Automated-Child-Growth-and-Malnutrition-Classification-app/train model/child_growth_model.keras")  # replace with actual path
print("✅ Model loaded successfully!")

# Example: preprocess an image
IMG_SIZE = 224
img_path = "/Users/pereraw.b.n/Automated-Child-Growth-and-Malnutrition-Classification-app/train model/child0118_01.jpg"  # replace with your image path
age_in_months = 42  # example age

img = cv2.imread(img_path)
img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
img = img / 255.0
img = np.expand_dims(img, axis=0)

age_array = np.array([[age_in_months]])

# Predict
preds = model.predict([img, age_array])

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

print("✅ Prediction:")
print("Height (cm):", pred_height)
print("Weight (g):", pred_weight)
print("Head circ. (cm):", pred_head)
print("Waist (cm):", pred_waist)
print("Gender (0=f,1=m):", pred_gender)
print("Health (0=unhealthy,1=healthy):", pred_health)
