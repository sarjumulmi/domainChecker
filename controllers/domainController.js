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
    console.log(response.data);
    res.json({url:url});
  })


}
