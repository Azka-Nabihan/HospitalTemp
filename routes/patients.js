const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const patientsFilePath = path.join(__dirname, '../data/patients.json');

// Helper: Read patients from JSON file
function readPatients() {
    const raw = fs.readFileSync(patientsFilePath, 'utf-8');
    return JSON.parse(raw);
}

// Helper: Write patients to JSON file
function writePatients(patients) {
    fs.writeFileSync(patientsFilePath, JSON.stringify(patients, null, 2), 'utf-8');
}

// Helper: Normalize date to YYYY-MM-DD
function normalizeDate(dateStr) {
    if (!dateStr) return '';
    // If it's DD-MM-YYYY
    const ddmmyyyyPattern = /^(\d{2})[-/](\d{2})[-/](\d{4})$/;
    const match = dateStr.match(ddmmyyyyPattern);
    if (match) {
        return `${match[3]}-${match[2]}-${match[1]}`;
    }
    // If it's YYYY-MM-DD
    const yyyymmddPattern = /^(\d{4})[-/](\d{2})[-/](\d{2})$/;
    const match2 = dateStr.match(yyyymmddPattern);
    if (match2) {
        return `${match2[1]}-${match2[2]}-${match2[3]}`;
    }
    return dateStr;
}

// POST /api/v1/patients/register
router.post('/register', (req, res) => {
    const { full_name, nik, dob, insurance_type } = req.body;
    
    // Simple validation
    if (!full_name || !nik || !dob) {
        return res.status(400).json({ success: false, message: "Lengkapi data full_name, nik, dan dob" });
    }

    const patients = readPatients();

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
    
    // Push new patient to database
    const newPatient = {
        rm_id: newRmId,
        nik: nik,
        dob: normalizeDate(dob),
        full_name: full_name,
        insurance_type: (insurance_type || "UMUM").toUpperCase()
    };
    patients.push(newPatient);
    writePatients(patients);

    res.json({
        success: true,
        rm_id: newRmId,
        message: "Pasien baru berhasil didaftarkan"
    });
});

// GET /api/v1/patients/check-nik
router.get('/check-nik', (req, res) => {
    const { nik } = req.query;
    const patients = readPatients();
    const existing = patients.find(p => p.nik === nik);
    if (existing) {
        return res.json({ exists: true, rm_id: existing.rm_id });
    }
    res.json({ exists: false });
});

// POST /api/v1/patients/validate
router.post('/validate', (req, res) => {
    const { rm_id, dob } = req.body;
    const patients = readPatients();
    const existing = patients.find(p => p.rm_id === rm_id && normalizeDate(p.dob) === normalizeDate(dob));
    
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
