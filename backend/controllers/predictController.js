// controllers/predictionController.js
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const Record = require("../models/Record");
const FormData = require("form-data");

// HANDLE IMAGE PREDICTION
exports.predictImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded"
      });
    }

    if (!req.body.ageMonths) {
      return res.status(400).json({
        success: false,
        message: "Age in months is required"
      });
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save the uploaded file location (already saved by multer to disk)
    const filePath = req.file.path;
    const fileName = req.file.filename;

    // Local URL to serve the image from backend
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${fileName}`;

    // Create form data for FastAPI
    const formData = new FormData();
    formData.append('image', fs.createReadStream(filePath), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    formData.append('ageMonths', req.body.ageMonths);
    formData.append('childName', req.body.childName || '');

    // Call FastAPI ML service
    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

    const response = await axios.post(
      `${mlServiceUrl}/predict`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 30000, // 30 seconds timeout for prediction
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Prediction failed');
    }

    // Save to database
    const record = new Record({
      user: req.userId,
      childName: req.body.childName || '',
      ageMonths: req.body.ageMonths,
      imageUrl: imageUrl,
      prediction: response.data.prediction,
      rawResponse: response.data, // Optional: store full response
    });

    await record.save();

    res.json({
      success: true,
      prediction: response.data.prediction,
      record: record,
      message: "Prediction completed successfully"
    });

  } catch (err) {
    console.error("Prediction error:", err);

    // Handle specific error types
    if (err.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: "ML service is unavailable. Please start the Python ML server.",
        error: err.message,
      });
    }

    if (err.response?.data) {
      return res.status(400).json({
        success: false,
        message: "ML service error",
        error: err.response.data,
      });
    }

    res.status(500).json({
      success: false,
      message: "Prediction error",
      error: err.message,
    });
  }
};