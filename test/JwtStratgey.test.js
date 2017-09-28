'use strict';

const { expect } = require('chai');
const {AssertionError} = require('assert');
const sinon = require('sinon');
const adal = require('adal-node');

const expectedClientsToken = 'super-secret-super-token';
const jwtStrategy = require('../src/');

describe('When using the HotConfigApiAdapter with JWT config', () => {
  let sandbox;

  const noJwtConfig = {
    hotConfig: {
      url: undefined,
    },
  };

  const secretConfig = {
    hotConfig: {
      url: 'https://loclal.clients',
      auth: {
        type: 'secret',
        jwt: expectedClientsToken,
      },
    },
  };

  const jwtConfig = {
    hotConfig: {
      url: 'https://loclal.clients',
      auth: {
        type: 'aad',
        tenant: 'some_tenant',
        authorityHostUrl: 'https://auth.host',
        clientId: 'some_client_id',
        clientSecret: 'client_secret',
        resource: 'some_resource',
      },
    },
  };

  const brokenAadConfig = {
    hotConfig: {
      url: 'https://loclal.clients',
      auth: {
        type: 'aad',
        authorityHostUrl: 'https://auth.host',
        clientId: 'some_client_id',
        clientSecret: 'client_secret',
        resource: 'some_resource',
      },
    },
  };

  const brokenAuthTypeConfig = {
    hotConfig: {
      url: 'https://loclal.clients',
      auth: {
        type: 'aad',
        authorityHostUrl: 'https://auth.host',
        clientId: 'some_client_id',
        clientSecret: 'client_secret',
        resource: 'some_resource',
      },
    },
  };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('does not use a jwt strategy', () => {
    const strategy = jwtStrategy(noJwtConfig.hotConfig);
    expect(strategy).to.equal(null);
  });

  it('use the secret jwt strategy', async () => {
    const strategy = jwtStrategy(secretConfig.hotConfig);
    const actual = await strategy.getBearerToken();
    expect(actual).to.equal(expectedClientsToken);
  });

  it('use the Active Directory jwt strategy', async () => {
    const strategy = jwtStrategy(jwtConfig.hotConfig);
    sandbox.stub(adal.AuthenticationContext.prototype, 'acquireTokenWithClientCredentials').yields(null, { accessToken: 'foo' });
    const response = await strategy.getBearerToken();
    expect(response).to.equal('foo');
  });

  it('no aad strategy if the required config is not present', () => {
    try{
      jwtStrategy(brokenAadConfig.hotConfig)
    } catch(e) {
      expect(e).to.be.an.instanceof(AssertionError);
    }
  });

  it('incompatible auth.type specified', () => {
    try{
      jwtStrategy(brokenAuthTypeConfig.hotConfig)
    } catch(e) {
      expect(e).to.be.an.instanceof(AssertionError);
    }
  })
});
