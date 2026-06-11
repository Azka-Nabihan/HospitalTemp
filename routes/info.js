const express = require('express');
const router = express.Router();

const polyclinics = require('../data/polyclinics.json');
const visitingHours = require('../data/visiting-hours.json');
const roomTariffs = require('../data/room-tariffs.json');
const promos = require('../data/promos.json');
const vaccines = require('../data/vaccines.json');
const mcuPackages = require('../data/mcu-packages.json');

router.get('/polyclinics', (req, res) => res.json({ success: true, data: polyclinics }));
router.get('/visiting-hours', (req, res) => res.json({ success: true, data: visitingHours }));
router.get('/room-tariffs', (req, res) => res.json({ success: true, data: roomTariffs }));
router.get('/promos', (req, res) => res.json({ success: true, data: promos }));
router.get('/vaccines', (req, res) => res.json({ success: true, data: vaccines }));
router.get('/mcu-packages', (req, res) => res.json({ success: true, data: mcuPackages }));

module.exports = router;
