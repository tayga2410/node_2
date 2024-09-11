const http = require('http');
const fs = require("fs");
const path = require("path");

const hostname = '127.0.0.1';
const port = 3000;

const getAllArticles = require('./handlers/getAllArticles');
const getArticleById = require("./handlers/getArticleById");
const createArticle = require("./handlers/createArticle");

let articles = [];

const handlers = {
  '/api/articles/readall': (req, res) => getAllArticles(req, res, articles),
  '/api/articles/read': (req, res, payload, cb) => getArticleById(req, res, payload, articles, cb),
  '/api/articles/create': (req, res, payload, cb) => createArticle(req, res, payload, articles, cb)
};

const server = http.createServer((req, res) => {
  parseBodyJson(req, (err, payload) => {
    const handler = getHandler(req.url);

    handler(req, res, payload, (err, result) => {
      if (err) {
        res.statusCode = err.code;
        res.setHeader('Content-Type', 'application/json');
        res.end( JSON.stringify(err) );

        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end( JSON.stringify(result) );
    });
  });
});


function getHandler(url) {
  return handlers[url] || notFound;
}

loadArticles()
  .then(() => {
    server.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  })
  .catch((err) => {
    console.error("Ошибка при загрузке статей:", err);
  });

function loadArticles() {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, "articles.json"), "utf-8", (err, data) => {
      if (err) reject(err);
      else {
        articles = JSON.parse(data);
        resolve();
      }
    });
  });
}

function notFound(req, res, payload, cb) {
  cb({ code: 404, message: 'Not found'});
}

function parseBodyJson(req, cb) {
  let body = [];

  req
    .on("data", (chunk) => {
      body.push(chunk);
    })
    .on("end", () => {
      body = Buffer.concat(body).toString();

      try {
        let params = JSON.parse(body);
        cb(null, params);
      } catch (e) {
        cb({ code: 400, message: "неверный JSON" });
      }
    });
}