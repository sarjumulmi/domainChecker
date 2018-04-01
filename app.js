const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const oracledb = require('oracledb');
const routes = require('./routes');


const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);

app.set('port', process.env.PORT || 8000);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`)
})
