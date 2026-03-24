# convert_model.py
import tensorflow as tf
import tensorflowjs as tfjs

model = tf.keras.models.load_model("/Users/pereraw.b.n/Automated-Child-Growth-and-Malnutrition-Classification-app/train model/child_growth_model.keras")
tfjs.converters.save_keras_model(model, "./tfjs_model")