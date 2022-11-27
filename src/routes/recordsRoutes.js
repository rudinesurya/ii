const express = require('express');
const recordsController = require('../controllers/recordsController');
const router = express.Router();

router
    .route('/aggr')
    .post(
        recordsController.aggr
    );

module.exports = router;