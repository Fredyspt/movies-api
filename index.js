const express = require('express');

const { config } = require('./config/index');
const moviesApi = require('./routes/movies');
const { logErrors, errorHandler } = require('./utils/middleware/errorHandlers')

const app = express();
// body parser
app.use(express.json());

moviesApi(app);

// Error middlewares must go after the routes.
app.use(logErrors);
app.use(errorHandler);


app.listen(config.port, () => {
  console.log(`Listening http://localhost:${config.port}`);
});
