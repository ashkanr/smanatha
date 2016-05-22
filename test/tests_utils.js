var chai = require('chai');
var sinon = require('sinon');
var utils = require('../utils');
var chalk = require('chalk');
var request = require('request');
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

    describe('getToken requests', function(){
      beforeEach(function(){
        sinon.spy(request, 'post');
      });

      afterEach(function(){
        request.post.restore();
      });

      it('should create a post request to Slack api', function(){
        utils.getToken().then();
        request.post.called.should.be.true;

        var spy = request.post.getCall(0);
        expect(spy.args[0].url).to.be.equal('https://slack.com/api/oauth.access');
      });

      it('should provide client_id, client_secret, code in request', function(){
        var data = {
          'client_id': 'fakeid',
          'client_secret': 'fakesecret',
          'code': 'fakecode'
        };

        utils.getToken(data.client_id, data.client_secret, data.code).then();

        var spy = request.post.getCall(0);
        var form = spy.args[0].form;

        expect(form.client_id).to.be.equal(data.client_id);
        expect(form.client_secret).to.be.equal(data.client_secret);
        expect(form.code).to.be.equal(data.code);
      });

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
