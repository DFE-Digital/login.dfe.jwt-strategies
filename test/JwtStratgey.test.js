'use strict';

jest.mock('adal-node', () => {
  const AuthenticationContext = jest.fn().mockImplementation(() =>  {
    return {
      acquireTokenWithClientCredentials: () => new Promise((resolveNew) => resolveNew(
        {accessToken: 'foo'})),
    }});
  return {
    AuthenticationContext: jest.fn().mockImplementation(AuthenticationContext),
    Logging: {
      getLoggingOptions: jest.fn().mockImplementation(() => ({ level: '' })),
      setLoggingOptions: jest.fn(),
    },
  };
});
const { AssertionError } = require('assert');
const adal = require('adal-node');

const expectedClientsToken = 'super-secret-super-token';
const jwtStrategy = require('../src/');

describe('When using the HotConfigApiAdapter with JWT config', () => {
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
        logLevel: 'info',
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

  it('does not use a jwt strategy', () => {
    const strategy = jwtStrategy(noJwtConfig.hotConfig);
    expect(strategy).toBe(null);
  });

  it('use the secret jwt strategy', async () => {
    const strategy = jwtStrategy(secretConfig.hotConfig);
    const actual = await strategy.getBearerToken();
    expect(actual).toBe(expectedClientsToken);
  });

  it('use the Active Directory jwt strategy', async () => {
    const strategy = jwtStrategy(jwtConfig.hotConfig);
    adal.AuthenticationContext.mockReset();
    adal.AuthenticationContext.mockImplementation(() => ({
      acquireTokenWithClientCredentials: () => ({ accessToken: 'foo' }),
    }));

    const response = await strategy.getBearerToken();

    expect(response).toBe('foo');
  });

  it('no aad strategy if the required config is not present', () => {
    try {
      jwtStrategy(brokenAadConfig.hotConfig);
    } catch (e) {
      expect(e).toBeInstanceOf(AssertionError);
    }
  });

  it('incompatible auth.type specified', () => {
    try {
      jwtStrategy(brokenAuthTypeConfig.hotConfig);
    } catch (e) {
      expect(e).toBeInstanceOf(AssertionError);
    }
  });
});
