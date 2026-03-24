require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routes
const authRoutes = require('./routes/auth');
const predictRoutes = require('./routes/predict');
const recordRoutes = require('./routes/records');

const path = require('path');
const fs = require('fs');

const app = express();

const corsOptions = {
  origin: ['http://localhost:5174', 'http://localhost:5173'], // frontend origin (don't use '*' if credentials are used)
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204
};
// ---------- CORS Setup ----------
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // enable preflight for all routes

// Serve stored images
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

app.use(express.json());

// ---------- Routes ----------
app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/records', recordRoutes);

// ---------- MongoDB Connection ----------
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('DB connection error', err));
