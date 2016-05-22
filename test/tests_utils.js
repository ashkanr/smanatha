var chai = require('chai');
var sinon = require('sinon');
var utils = require('../utils');
var chalk = require('chalk');
var expect = chai.expect;

chai.should();

describe('utils', function(){
  describe('req', function(){
    it('should be a function', function(){
      utils.req.should.be.a('function');
    });

    it('should return required package if exists in the path', function(){
      utils.req('hermes').should.be.a('function');
    });

    it("should return fatal error if required package isn't in the path", function(){
      var fn = function(){
        return utils.req('notexist');
      };

      expect(fn).to.throw(Error, /Cannot find module 'notexist'/);
    });
  });

  describe('log', function(){
    it('should be a function', function(){
      utils.log.should.be.a('function');
    });

    it('should log the message', function(){
      sinon.spy(console, 'log');
      utils.log('some message');

      console.log.calledOnce.should.be.true;
    });

  });

  describe('fatal', function(){
    it('should be a function', function(){
      utils.fatal.should.be.a('function');
    });

    it('should throw an error with given message', function(){
      var fn = function(){
        return utils.fatal('Given Message');
      };

      expect(fn).to.throw(Error, /Given Message/);
    });
  });

  describe('getToken', function(){
    it('should be a function', function(){
      utils.getToken.should.be.a('function');
    });

    it('should return a promise', function(){
      var fn = function(){
        var Promise = require('promise');
        return utils.getToken() instanceof Promise;
      };

      fn().should.be.true;
    });

    it('should create a post request to Slack api', function(){
      sinon.spy(request, 'post');

    });
  });

  describe('getTeams', function(){
    it('should be a function', function(){
      utils.getTeams.should.be.a('function');
    });
  });

  describe('setTeam', function(){
    it('should be a function', function(){
      utils.setTeam.should.be.a('function');
    });
  });

  describe('dbset', function(){
    it('should be a function', function(){
      utils.dbset.should.be.a('function');
    });
  });

  describe('dbget', function(){
    it('should be a function', function(){
      utils.dbget.should.be.a('function');
    });
  });

});
