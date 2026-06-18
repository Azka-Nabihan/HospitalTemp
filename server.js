const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { checkApiStatus, setApiStatus } = require('./middleware/apiStatus');
const { checkApiKey } = require('./middleware/auth');

const patientRoutes = require('./routes/patients');
const bookingRoutes = require('./routes/bookings');
const doctorRoutes = require('./routes/doctors');
const infoRoutes = require('./routes/info');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Toggle API Status Endpoint (for testing)
// This is not protected by checkApiStatus so we can turn it back on!
app.post('/api/v1/admin/toggle-api', (req, res) => {
    const { isAvailable } = req.body;
    if (typeof isAvailable !== 'boolean') {
        return res.status(400).json({ error: "isAvailable must be a boolean" });
    }
    setApiStatus(isAvailable);
    res.json({ success: true, message: `API status set to ${isAvailable ? 'ONLINE' : 'OFFLINE'}` });
});

// Health check
app.get('/api/v1/health', (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Apply global middleware for SIMRS API offline simulation
app.use('/api/v1', checkApiStatus);

// Apply API Key Authentication middleware
app.use('/api/v1', checkApiKey);

// Register routes
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/doctors', doctorRoutes);
// Info routes will cover polyclinics, visiting hours, tariffs, promos, vaccines, mcu
app.use('/api/v1', infoRoutes); 

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
