const fs = require("fs");
const path = require("path");

function logRequest(req, payload) {
  const logFilePath = path.join(__dirname, "..", "logs", "server.log");
  const now = new Date();

  const logEntry = `
  [${now.toISOString()}]
  URL: ${req.url}
  Method: ${req.method}
  Headers: ${JSON.stringify(req.headers, null, 2)}
  -----------------------------------
  `;

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('Ошибка записи в лог-файл:', err);
    } else {
      console.log('Запись добавлена в лог.');
    }
  });
}

module.exports = logRequest;