const boom = require('@hapi/boom');

// does not receive next callback, since it's the last middleware 
// to be executed, meaning that the app already passed by all the other routes
function notFoundHandler (req, res) {
  const {
    output: { statusCode, payload }
  } = boom.notFound();

  res.status(statusCode).json(payload);
}

module.exports = notFoundHandler;