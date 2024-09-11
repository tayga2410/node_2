const fs = require('fs');
const path = require('path');

const logRequest = require("./logRequest");

function generateUniqueCommentId(articles) {
  let newId;
  do {
    newId = (Math.random() * 1000000).toFixed(0);
  } while (articles.flatMap(article => article.comments).some(comment => comment.id === newId));
  return newId;
}

function createComment(req, res, payload, articles, cb) {
  logRequest(req, payload);

  const { articleId, text, date, author } = payload;

  if (!articleId || !text || !date || !author) {
    return cb({ code: 400, message: "Необходимы articleId, text, date и author для создания комментария" });
  }

  const articleIdNumber = Number(articleId);

  const article = articles.find(a => a.id === articleIdNumber);
  if (!article) {
    return cb({ code: 404, message: "Статья не найдена" });
  }

  const newComment = {
    id: generateUniqueCommentId(articles),
    articleId: articleIdNumber,
    text,
    date,
    author
  };

  article.comments.push(newComment);

  saveArticles(articles)
    .then(() => cb(null, newComment))
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

module.exports = createComment;
