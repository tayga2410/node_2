const fs = require('fs');
const path = require('path');

const logRequest = require("./logRequest");

function deleteArticle(req, res, payload, articles, cb) {
  const { id } = payload;

  logRequest(req, payload);


  if (!id) {
    return cb({ code: 400, message: "Необходим ID статьи для удаления" });
  }

  const initialLength = articles.length;
  articles = articles.filter(article => article.id !== id);

  if (articles.length === initialLength) {
    return cb({ code: 404, message: "Статья не найдена" });
  }

  saveArticles(articles)
    .then(() => cb(null, { message: "Статья удалена успешно" }))
    .catch(err => cb({ code: 500, message: "Ошибка сохранения изменений" }));
}

function saveArticles(articles) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(__dirname, "..", "articles.json"), JSON.stringify(articles, null, 2), "utf-8", (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

module.exports = deleteArticle;
