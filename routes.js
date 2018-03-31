const express = require('express');
const app = require('./app');
const domainController = require('./controllers/domainController');

const router = express.Router();
router.get('/', domainController.index);
router.get('/getDomains*', domainController.getDomains)
router.post('/addDomain', domainController.addDomain)

module.exports = router;
