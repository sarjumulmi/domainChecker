const express = require('express');
const app = require('./app');
const domainController = require('./controllers/domainController');

const router = express.Router();
router.use(function (request, response, next) {
  console.log("REQUEST:" + request.method + "   " + request.url);
  console.log("BODY:" + JSON.stringify(request.body));
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  response.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
router.get('/', domainController.index);
router.get('/getDomains*', domainController.getDomains);
router.get('/getSavedDomains', domainController.getSavedDomains)
router.post('/addDomain', domainController.addDomain);

module.exports = router;
