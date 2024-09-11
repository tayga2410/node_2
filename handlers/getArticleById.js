const logRequest = require("./logRequest");

function readArticleById(req, res, payload, articles, cb) {
  logRequest(req, payload);
  console.log("Payload:", payload);

  const articleId = payload?.id;
  if (!articleId) {
    return cb({ code: 400, message: "нужен ID брат" });
  }

  const article = articles.find((a) => a.id === String(articleId));  

  if (!article) {
    return cb({ code: 404, message: "Статья не найдена" });
  }

  cb(null, article);
}

module.exports = readArticleById;