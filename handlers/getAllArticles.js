const logRequest = require("./logRequest");

function getAllArticles(req, res, payload, articles) {
  logRequest(req, payload);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(articles)); 
}

module.exports = getAllArticles;