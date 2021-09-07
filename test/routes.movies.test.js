const assert = require('assert');
const proxyquire = require('proxyquire');

const { moviesMock, MoviesServiceMock } = require('../utils/mocks/movies')
const testServer = require('../utils/testServer')

describe('routes - movies', function() {
  // Requires our routes and replaces the real services with
  // mock services
  const route = proxyquire('../routes/movies.js', {
    '../services/movies.js': MoviesServiceMock
  })

  // Test is specific to this route
  const request = testServer(route);
  
  describe('GET /movies', function() {
    it('should respond with status 200', function(done) {
      request.get('/api/movies').expect(200, done);
    })

    it('should respond with the list of movies', function(done) {
      // After ending the request, assert makes sure that we receive the 
      // data we expected, by comparing res.body with another object
      // that contains our movies mock response and the message expected for
      // that route. deepEqual compares objects
      request.get('/api/movies').end((err, res) => {
        const result = res.body;
        const expected = {
          data: moviesMock, 
          message: 'movies listed'
        }

        assert.deepStrictEqual(result, expected)
        done()
      })
    })
  })

})