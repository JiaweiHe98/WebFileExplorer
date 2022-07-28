const express = require('express');
const { landing, fileExplorer } = require('../controller/viewController');

/**
 * This router handles all of the view rendering end points
 * The uri starts with /view
 */
const router = express.Router();

router.get('/', landing);
router.get('/drive', fileExplorer);

module.exports = router;
