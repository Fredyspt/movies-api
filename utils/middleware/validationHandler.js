const boom = require('@hapi/boom');
const joi = require('joi')

function validate(data, schema) {
  // If input is valid, then error will be undefined
  // If invalid, error is assigned a ValidationError
  const { error } = joi.object(schema).validate(data);

  return error;
}

function validationHandler(schema, check = 'body') {
  return function (req, res, next) {
    const error = validate(req[check], schema)

    error ? next(boom.badRequest(error)) : next();
  }
}

module.exports = validationHandler;