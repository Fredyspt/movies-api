const assert = require('assert');
const proxyquire = require('proxyquire');

const { getAllStub, createStub, MongoLibMock } = require('../utils/mocks/mongoLib')
const { moviesMock } = require('../utils/mocks/movies')

describe('Services - movies', function() {
  const MoviesService = proxyquire('../services/movies.js', {
    '../lib/mongo.js': MongoLibMock
  })

  const moviesService = new MoviesService();

  describe('When getMovies method is called', async function() {
    it('should call the getAll MongoLib method', async function() {
      await moviesService.getMovies({});
      assert.strictEqual(getAllStub.called, true);
    })

    it('should return movie collection array', async function() {
      const result = await moviesService.getMovies({});
      const expected = moviesMock;

      assert.deepStrictEqual(result, expected)
    })
  })

  describe('When create method is called', async function() {
    it('should call the create MongoLib method', async function() {
      await moviesService.createMovie({});
      assert.strictEqual(createStub.called, true);
    })
  })
})