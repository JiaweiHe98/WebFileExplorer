const express = require('express');
const {
  queryDirectory,
  addANewFolder,
  rename,
  deleteFileOrDir,
  uploadAFile,
} = require('../controller/apiController');

/**
 * This router handels all the api calls
 * The uir starts with /api
 */
const router = express.Router();

/**
 * Get information from a directory
 */
router.get('/content', queryDirectory);

/**
 * Add a new folder in the specified directory
 */
router.get('/newfolder', addANewFolder);

/**
 * Rename a file or a folder
 */
router.get('/rename', rename);

/**
 * Delete a file or a folder
 */
router.get('/delete', deleteFileOrDir);

/**
 * Upload a file
 */
router.post('/upload', uploadAFile);

module.exports = router;
