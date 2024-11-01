const express = require('express');
const router = express.Router();
const controller = require('../controllers/datahandlerController');

router.get('/data', controller.getData);
router.post('/data', controller.addData);
router.delete('/data', controller.deleteData);

module.exports = router;