const boom = require('@hapi/boom');
const { config } = require('../../config')

function withErrorStack(error, stack) {
  if(config.dev) {
    // must use spread operator since boom errors contain
    // more attributes in the body
    return { ...error, stack };
  };

  return error;
}

function logErrors(err, req, res, next) {
  console.log(err);
  next(err);
}

function wrapError(err, req, res, next) {
  // if an error is not of type = boom
  if(!err.isBoom) {
    // make the error type boom
    next(boom.badImplementation(err))
  }

  next(err)
}

function errorHandler(err, req, res, next) {  // eslint-disable-line
  // retrieve statusCode and payload from err.output
  const { output: { statusCode, payload }} = err;
  res.status(statusCode);
  res.json(withErrorStack(payload, err.stack));
}

module.exports = {
  logErrors, 
  wrapError,
  errorHandler
}