const fs = require("fs");
const path = require("path");

const logRequest = require("./logRequest");

function deleteComment(req, res, payload, articles, cb) {
  logRequest(req, payload);

  if (!payload || !payload.id) {
    return cb({ code: 400, message: "Необходим ID комментария" });
  }

  const { id } = payload;

  let commentFound = false;
  articles.forEach((article) => {
    const initialLength = article.comments.length;
    article.comments = article.comments.filter((comment) => {
      if (comment.id === id) {
        commentFound = true;
        return false;
      }
      return true;
    });

    if (initialLength !== article.comments.length) {
      saveArticles(articles)
        .then(() => cb(null, { message: "Комментарий удалён" }))
        .catch((err) =>
          cb({ code: 500, message: "Ошибка сохранения изменений" })
        );
    }
  });

  if (!commentFound) {
    cb({ code: 404, message: "Комментарий не найден" });
  }
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

module.exports = deleteComment;
