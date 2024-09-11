const fs = require('fs');
const path = require('path');

function updateArticle(req, res, payload, articles, cb) {
  const { id, title, text, date, author, comments } = payload;

  if (!id) {
    return cb({ code: 400, message: "Необходим ID статьи для обновления" });
  }

  let articleFound = false;
  articles = articles.map(article => {
    if (article.id === id) {
      articleFound = true;
      return {
        ...article,
        title: title !== undefined ? title : article.title,
        text: text !== undefined ? text : article.text,
        date: date !== undefined ? date : article.date,
        author: author !== undefined ? author : article.author,
        comments: comments !== undefined ? comments : article.comments
      };
    }
    return article;
  });

  if (!articleFound) {
    return cb({ code: 404, message: "Статья не найдена" });
  }

  saveArticles(articles)
    .then(() => cb(null, { message: "Статья обновлена успешно" }))
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

module.exports = updateArticle;
