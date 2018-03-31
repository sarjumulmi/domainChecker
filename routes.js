const express = require('express');
const app = require('./app');
const domainController = require('./controllers/domainController');

const router = express.Router();
router.get('/', domainController.index);
router.get('/getDomains*', domainController.getDomains)

module.exports = router;
