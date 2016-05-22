var request = require('supertest');

describe('loading express', function(){
  var server;

  beforeEach(function(){
    server = require('../index');
  });

  afterEach(function(){
    server.close();
  });

  it('should response to /', function(){
    request(server)
      .get('/')
      .expect(200);
  });

  it('should response to /auth/', function(){
    request(server)
      .get('/auth/')
      .expect(200);
  });
});
