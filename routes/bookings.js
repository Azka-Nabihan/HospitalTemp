const express = require('express');
const router = express.Router();

// POST /api/v1/bookings
router.post('/', (req, res) => {
    const { patient_type, insurance_type, rm_id, nik, full_name, dob, poly_id, doctor_id } = req.body;

    // Simulate validation
    if (!patient_type || !insurance_type || !poly_id || !doctor_id) {
        return res.status(400).json({ success: false, message: "Incomplete booking data" });
    }

    // Generate random booking code
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSeq = Math.floor(100 + Math.random() * 900).toString();
    const bookingCode = `BK-${dateStr}-${randomSeq}`;

    res.json({
        success: true,
        booking_code: bookingCode,
        message: "Pendaftaran berhasil",
        details: {
            patient_name: full_name || "Pasien Lama",
            insurance: insurance_type,
            poly_id,
            doctor_id
        }
    });
});

module.exports = router;
