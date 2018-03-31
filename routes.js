const express = require('express');
const app = require('./app');
const homeController = require('./controllers/homeController');

const router = express.Router();
router.get('/', homeController.index);

module.exports = router;
