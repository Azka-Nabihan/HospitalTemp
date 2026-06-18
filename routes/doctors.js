const express = require('express');
const router = express.Router();
const doctors = require('../data/doctors.json');
const schedules = require('../data/schedules.json');

// GET /api/v1/doctors
// GET /api/v1/doctors?poly_id=1
router.get('/', (req, res) => {
    const { poly_id } = req.query;
    let filtered = doctors;
    if (poly_id) {
        filtered = filtered.filter(d => d.poly_id == poly_id);
    }
    res.json({ success: true, data: filtered });
});

// GET /api/v1/doctors/availability
router.get('/availability', (req, res) => {
    const { doctor_id, date } = req.query;
    
    if (!doctor_id || !date) {
        return res.status(400).json({ success: false, message: "doctor_id and date are required" });
    }

    const doctor = doctors.find(d => d.id == doctor_id);
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    const schedule = schedules.find(s => s.doctor_id == doctor_id && s.date === date);
    
    if (schedule) {
        res.json({
            doctor_id: parseInt(doctor_id),
            name: doctor.name,
            specialist: doctor.specialist,
            date: date,
            is_available: schedule.is_available,
            is_leave: schedule.is_leave,
            is_full: schedule.is_full,
            quota_total: schedule.quota_total,
            quota_remaining: schedule.quota_remaining,
            schedule: schedule.schedule,
            practice_days: schedule.practice_days || []
        });
    } else {
        // Default not available if no schedule
        // Look up practice_days from any existing schedule for this doctor
        var doctorSchedule = schedules.find(s => s.doctor_id == doctor_id);
        res.json({
            doctor_id: parseInt(doctor_id),
            name: doctor.name,
            specialist: doctor.specialist,
            date: date,
            is_available: false,
            is_leave: false,
            is_full: false,
            quota_total: 0,
            quota_remaining: 0,
            schedule: "Tidak ada jadwal",
            practice_days: doctorSchedule ? doctorSchedule.practice_days || [] : []
        });
    }
});

module.exports = router;
