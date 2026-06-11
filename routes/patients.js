const express = require('express');
const router = express.Router();
const patients = require('../data/patients.json');

// POST /api/v1/patients/register
router.post('/register', (req, res) => {
    const { full_name, nik, dob, insurance_type } = req.body;
    
    // Simple validation
    if (!full_name || !nik || !dob) {
        return res.status(400).json({ success: false, message: "Lengkapi data full_name, nik, dan dob" });
    }

    // Check if NIK already exists
    const existing = patients.find(p => p.nik === nik);
    if (existing) {
        return res.status(400).json({ 
            success: false, 
            message: `NIK sudah terdaftar dengan Nomor RM: ${existing.rm_id}` 
        });
    }

    // Create mock RM ID
    const newRmId = "24" + Math.floor(1000 + Math.random() * 9000).toString();
    res.json({
        success: true,
        rm_id: newRmId,
        message: "Pasien baru berhasil didaftarkan"
    });
});

// GET /api/v1/patients/check-nik
router.get('/check-nik', (req, res) => {
    const { nik } = req.query;
    const existing = patients.find(p => p.nik === nik);
    if (existing) {
        return res.json({ exists: true, rm_id: existing.rm_id });
    }
    res.json({ exists: false });
});

// POST /api/v1/patients/validate
router.post('/validate', (req, res) => {
    const { rm_id, dob } = req.body;
    const existing = patients.find(p => p.rm_id === rm_id && p.dob === dob);
    
    if (existing) {
        return res.json({
            valid: true,
            patient: {
                name: existing.full_name,
                rm_id: existing.rm_id,
                insurance_type: existing.insurance_type
            }
        });
    }
    
    res.status(404).json({ valid: false, message: "Data pasien tidak ditemukan" });
});

module.exports = router;
