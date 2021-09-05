const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

const { config } = require('./config/index');
const moviesApi = require('./routes/movies');
const { logErrors, errorHandler, wrapError } = require('./utils/middleware/errorHandlers')
const notFoundHandler = require('./utils/middleware/notFoundHandler')

const app = express();
// body parser
app.use(express.json());
// logger
app.use(morgan('dev'));
app.use(helmet());
// Routes
moviesApi(app);

// Catch 404
app.use(notFoundHandler);

// Error middlewares must go after the routes.
app.use(logErrors);
app.use(wrapError);
app.use(errorHandler);


app.listen(config.port, () => {
  console.log(`Listening http://localhost:${config.port}`);
});
