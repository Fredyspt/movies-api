const express = require('express');
const supertest = require('supertest');

function testServer(route) {
  const app = express();
  app.use(express.json())
  route(app);
  
  // creates test server
  return supertest(app);
}

module.exports = testServer;