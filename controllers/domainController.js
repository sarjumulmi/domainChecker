const oracledb = require('oracledb');
const axios = require('axios');

const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://domainscope.com/api/v2/domains/nxd?keyword=';
const connectionProperties = {
  user: process.env.DBAAS_USER_NAME,//process.env.DBAAS_USER_NAME,
  password: process.env.DBAAS_USER_PASSWORD,//process.env.DBAAS_USER_PASSWORD,
  connectString: process.env.DBAAS_DEFAULT_CONNECT_DESCRIPTOR //process.env.DBAAS_DEFAULT_CONNECT_DESCRIPTOR
};
oracledb.autoCommit = true;

exports.index = (req, res) => {
  res.render('home', {title: 'Domain Checker'});
}

exports.getDomains =  (req, res) => {
  const query = req.query.domain;
  const url = `${BASE_URL}${query}&page_size=10`;
  axios.get(url,
    {headers: {'X-DOMAINSCOPE-APIKEY': `${API_KEY}`}}
  ).then(response => {
    res.render('home', {title: 'Domain Checker', domains: response.data.domains});
  }).catch(error => {
    console.log('oooops!!')
    console.error(error)
    res.render('home', {title: 'Domain Checker', error: error.response.data});
  });
}

exports.getSavedDomains = function (request, response) {
  let conn; //for scoping
  oracledb.getConnection(connectionProperties)
    .then(c => {
      console.log('Connected to db.')
      conn = c;
      return conn.execute(
        "SELECT * FROM domainlist",{},
        { outFormat: oracledb.OBJECT }
      )
      .then(result => {
        const domains = [];
        result.rows.forEach(function (element) {
          domains.push({ id: element.ID, name: element.DOMAIN, rating: element.RATING });
        }, this);
        response.render('cart', {title:'Cart', domains: domains});
        return conn.close();
      })
      .catch(err => {
        console.error(err.message);
        response.status(500).send("Error getting data from DB");
        return conn.close();
      })
    })
    .catch(err => {
      console.error(err.message);
      response.status(500).send("Error closing connection");
    })
}

exports.addDomain = function(request, response) {
  let conn; //for scoping
  oracledb.getConnection(connectionProperties)
    .then(c => {
      console.log('Connected to db.')
      conn = c;
      return conn.execute(
        "INSERT INTO DOMAINLIST (ID, DOMAIN, RATING) VALUES (DOMAIN_SEQ.nextVal, :domain, :rating)",
        [request.body.name, request.body.rating]
      )
      .then(result => {
        console.log(result);
        response.redirect('/');
        return conn.close();
      })
      .catch(err => {
        console.error(err.message);
        response.status(500).send("Error saving domain to DB");
        return conn.close();
      })
    })
    .catch(err => {
      console.error(err.message);
      response.status(500).send("Error closing connection");
    });
}
