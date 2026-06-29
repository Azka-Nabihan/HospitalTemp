const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const bookingsFilePath = path.join(__dirname, '../data/bookings.json');

// Helper: Read bookings from JSON file
function readBookings() {
    const raw = fs.readFileSync(bookingsFilePath, 'utf-8');
    return JSON.parse(raw);
}

// Helper: Write bookings to JSON file
function writeBookings(bookings) {
    fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2), 'utf-8');
}

// GET /api/v1/bookings
// List all bookings (Admin)
router.get('/', (req, res) => {
    const bookings = readBookings();
    res.json({
        success: true,
        count: bookings.length,
        data: bookings
    });
});

// GET /api/v1/bookings/verify
// Verify a booking by booking_code
router.get('/verify', (req, res) => {
    const { booking_code } = req.query;

    if (!booking_code) {
        return res.status(400).json({ success: false, message: "booking_code is required" });
    }

    const bookings = readBookings();
    const booking = bookings.find(b => b.booking_code === booking_code);

    if (booking) {
        return res.json({
            found: true,
            booking: booking
        });
    }

    res.status(404).json({ found: false, message: "Kode booking tidak ditemukan" });
});

// POST /api/v1/bookings
router.post('/', (req, res) => {
    const { patient_type, insurance_type, rm_id, nik, full_name, dob, poly_id, doctor_id, date, time } = req.body;

    // Simulate validation
    if (!patient_type || !insurance_type || !poly_id || !doctor_id) {
        return res.status(400).json({ success: false, message: "Incomplete booking data" });
    }

    // Generate random booking code
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSeq = Math.floor(100 + Math.random() * 900).toString();
    const bookingCode = `BK-${dateStr}-${randomSeq}`;

    // Build booking record
    const bookingRecord = {
        booking_code: bookingCode,
        patient_name: full_name || "Pasien Lama",
        insurance: insurance_type,
        poly_id,
        doctor_id,
        date: date || null,
        time: time || null,
        created_at: new Date().toISOString()
    };

    // Persist to bookings.json
    const bookings = readBookings();
    bookings.push(bookingRecord);
    writeBookings(bookings);

    res.json({
        success: true,
        booking_code: bookingCode,
        message: "Pendaftaran berhasil",
        details: {
            patient_name: full_name || "Pasien Lama",
            insurance: insurance_type,
            poly_id,
            doctor_id,
            date: date || null,
            time: time || null
        }
    });
});

// POST /api/v1/bookings/reschedule
router.post('/reschedule', (req, res) => {
    const { booking_code, new_date, new_time } = req.body;

    if (!booking_code || !new_date || !new_time) {
        return res.status(400).json({ success: false, message: "booking_code, new_date, and new_time are required" });
    }

    const bookings = readBookings();
    const booking = bookings.find(b => b.booking_code === booking_code);

    if (!booking) {
        return res.status(404).json({ success: false, message: "Kode booking tidak ditemukan" });
    }

    booking.date = new_date;
    booking.time = new_time;

    writeBookings(bookings);

    res.status(200).json({
        success: true,
        message: "Jadwal berhasil diubah",
        booking: booking
    });
});

// POST /api/v1/bookings/cancel
router.post('/cancel', (req, res) => {
    const { booking_code } = req.body;

    if (!booking_code) {
        return res.status(400).json({ success: false, message: "booking_code is required" });
    }

    const bookings = readBookings();
    const booking = bookings.find(b => b.booking_code === booking_code);

    if (!booking) {
        return res.status(404).json({ success: false, message: "Kode booking tidak ditemukan" });
    }

    const updatedBookings = bookings.filter(b => b.booking_code !== booking_code);
    writeBookings(updatedBookings);

    res.status(200).json({
        success: true,
        message: "Pendaftaran berhasil dibatalkan"
    });
});

module.exports = router;
