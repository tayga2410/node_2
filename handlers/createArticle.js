const fs = require("fs");
const path = require("path");

const logRequest = require("./logRequest");

function generateId(articles) {
  const ids = articles.map((article) => article.id);
  let newId = 1;
  while (ids.includes(newId)) {
    newId++;
  }
  return newId;
}

function createArticle(req, res, payload, articles, cb) {
  logRequest(req, payload);

  const { title, text, date, author, comments } = payload;

  if (!title || !text || !author || !Array.isArray(comments)) {
    return cb({
      code: 400,
      message: "Недостаточно данных для создания статьи",
    });
  }

  const newArticle = {
    id: generateId(articles),
    title,
    text,
    date,
    author,
    comments,
  };

  articles.push(newArticle);
  saveArticles(articles)
    .then(() => cb(null, newArticle))
    .catch((err) => cb({ code: 500, message: "Ошибка сохранения статьи" }));
}

function saveArticles(articles) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      path.join(__dirname, "..", "articles.json"),
      JSON.stringify(articles, null, 2),
      "utf-8",
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

module.exports = createArticle;
