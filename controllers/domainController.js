const oracledb = require('oracledb');
const axios = require('axios');

const API_KEY = 'c06e7c44f16cc2dcd59f33ee4709ac78';
const BASE_URL = 'https://domainscope.com/api/v2/domains/nxd?keyword=';


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

//handle db connection operation
function handleDBOperation(request, response, cb) {
  const connectionProperties = {
    user: "system",//process.env.DBAAS_USER_NAME || "oracle",
    password: "#Fairfax2018",//process.env.DBAAS_USER_PASSWORD || "oracle",
    connectString: "129.157.178.222/PDB1.595583445.oraclecloud.internal"//process.env.DBAAS_DEFAULT_CONNECT_DESCRIPTOR || "localhost/xe"
  };
  oracledb.getConnection(connectionProperties, function(err, connection) {
    if(err) {
      console.log(err.message);
      response.writeHead(500, {'Content-Type': 'application/json'});
      response.end(JSON.stringify({
        status: 500,
        message: "Error connecting to DB",
        detailed_message: err.message
        }
      ));
      return;
    }
    cb(request, response, connection);
  })
}

// release DB connection
function doRelease(connection) {
  connection.release(function(err) {
    if (err) {
      console.log('oooops');
      console.error(err.message);
    }
  });
}

exports.getSavedDomains = function (request, response) {
  handleDBOperation(request, response, function(request, response, connection) {
    connection.execute("SELECT * FROM domainlist",{},
      { outFormat: oracledb.OBJECT },
      function (err, result) {
        if (err) {
          console.error(err.message);
          response.status(500).send("Error getting data from DB");
          doRelease(connection);
          return;
        }
        console.log("RESULTSET:" + JSON.stringify(result));
        var domains = [];
        result.rows.forEach(function (element) {
          domains.push({ id: element.ID, name: element.DOMAIN, rating: element.RATING });
        }, this);
        response.render('cart', {title:'Cart', domains: domains});
        doRelease(connection);
      });
  });
}

exports.addDomain = (req, res) => {
  res.json(req.body)
}
