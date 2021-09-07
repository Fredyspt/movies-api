const express = require('express');
const MoviesService = require('../services/movies');

const {
  movieIdSchema,
  createMovieSchema,
  updateMovieSchema,
} = require('../utils/schemas/movies');

const validationHandler = require('../utils/middleware/validationHandler');

function moviesApi(app) {
  const router = express.Router();
  // in this route, the app will use our express router
  app.use('/api/movies', router);

  const moviesService = new MoviesService();

  // home ('/') is now ('/api/movies')
  router.get('/', async (req, res, next) => {
    const { tags } = req.query;
    try {
      const movies = await moviesService.getMovies({ tags });
      res.status(200).json({
        data: movies,
        message: 'movies listed',
      });
    } catch (error) {
      next(error);
    }
  });

  router.get(
    '/:movieId',
    validationHandler({ movieId: movieIdSchema }, 'params'),
    async (req, res, next) => {
      const { movieId } = req.params;
      try {
        const movie = await moviesService.getMovie({ movieId });
        res.status(200).json({
          data: movie,
          message: 'movie retrieved',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    '/',
    validationHandler(createMovieSchema),
    async (req, res, next) => {
      const { body: movie } = req;
      try {
        const createdMovieId = await moviesService.createMovie({ movie });
        res.status(201).json({
          data: createdMovieId,
          message: 'movie created',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.put(
    '/:movieId',
    validationHandler({ movieId: movieIdSchema }, 'params'),
    validationHandler(updateMovieSchema),
    async (req, res, next) => {
      const { movieId } = req.params;
      const { body: movie } = req;

      try {
        const updatedMovieId = await moviesService.updateMovie({
          movieId,
          movie,
        });
        res.status(200).json({
          data: updatedMovieId,
          message: 'movie updated',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.patch('/:movieId', async (req, res, next) => {
    const { body: movie } = req;
    const { movieId } = req.params;

    try {
      const patchedMovieId = await moviesService.patchMovieData({
        movieId,
        movie,
      });
      res.status(200).json({
        data: patchedMovieId,
        message: 'movie data updated',
      });
    } catch (error) {
      next(error);
    }
  });

  router.delete(
    '/:movieId',
    validationHandler({ movieId: movieIdSchema }, 'params'),
    async (req, res, next) => {
      const { movieId } = req.params;

      try {
        const deletedMovieId = await moviesService.deleteMovie({ movieId });
        res.status(200).json({
          data: deletedMovieId,
          message: 'movie deleted',
        });
      } catch (error) {
        next(error);
      }
    }
  );
}

module.exports = moviesApi;
