const API_KEY = 'c06e7c44f16cc2dcd59f33ee4709ac78';

exports.index = (req, res) => {
  res.render('home', {title: 'Domain Checker'});
}
