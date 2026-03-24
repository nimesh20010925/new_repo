const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    childName: String,
    ageMonths: Number,
    imageUrl: String, // if using cloud storage or local path
    prediction: {
        predicted_gender_cnn: Number, // 0 for female, 1 for male
        predicted_height_cnn: Number, // in cm
        predicted_weight_cnn: Number, // in kg
        manual_age_input: Number, // in months
        predicted_stunting_category: String, // e.g., "Tall", "Normal", "Stunted"
        predicted_wasting_category: String // e.g., "Risk of Overweight", "Normal", "Wasted"
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Record', recordSchema);
