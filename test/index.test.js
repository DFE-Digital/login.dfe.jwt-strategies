jest.mock('../src/secret', () => jest.fn());
jest.mock('../src/aad', () => jest.fn());

const { AssertionError } = require('assert');
const msal = require('@azure/msal-node');
const getJwtStrategy = require('../src');
const secretStrategy = require('../src/secret');
const aadStrategy = require('../src/aad');

describe('getJwtStrategy(config', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns `null` when does not use a jwt strategy', () => {
    const config = {
      url: undefined,
    };

    const strategy = getJwtStrategy(config);
  
    expect(strategy).toBe(null);
  });

  it('throws assertion error if required an unsupported auth type is specified', () => {
    const config = {
      url: 'https://loclal.clients',
      auth: {
        type: 'non-existent-type',
      },
    };

    const act = () => {
      getJwtStrategy(config);
    };

    expect(act).toThrow(AssertionError);
  });

  it('resolves `secret` strategy when auth type is "secret"', () => {
    const config = {
      url: 'https://loclal.clients',
      auth: {
        type: 'secret',
        jwt: 'secret-token',
      },
    };

    secretStrategy.mockReturnValue("secretStrategyResult");

    const strategy = getJwtStrategy(config);

    expect(secretStrategy).toHaveBeenCalledWith(config);
    expect(strategy).toBe("secretStrategyResult");
  });

  it('resolves `aad` strategy when auth type is "aad"', () => {
    const config = {
      url: 'https://loclal.clients',
      auth: {
        type: 'aad',
        tenant: 'some_tenant',
        authorityHostUrl: 'https://auth.host',
        clientId: 'some_client_id',
        clientSecret: 'client_secret',
        resource: 'some_resource',
        logLevel: msal.LogLevel.Info,
      },
    };

    aadStrategy.mockReturnValue("aadStrategyResult");

    const strategy = getJwtStrategy(config);

    expect(aadStrategy).toHaveBeenCalledWith(config);
    expect(strategy).toBe("aadStrategyResult");
  });

  it.each([
    [ 'tenant' ],
    [ 'authorityHostUrl' ],
    [ 'clientId' ],
    [ 'clientSecret' ],
    [ 'resource' ],
  ])('throws assertion error if required `aad` configuration `%s` is not present', (missingConfigKey) => {
    const config = {
      url: 'https://loclal.clients',
      auth: {
        type: 'aad',
        tenant: 'some_tenant',
        authorityHostUrl: 'https://auth.host',
        clientId: 'some_client_id',
        clientSecret: 'client_secret',
        resource: 'some_resource',
        logLevel: msal.LogLevel.Info,
      },
    };
    delete config.auth[missingConfigKey];

    const act = () => {
      getJwtStrategy(config);
    };

    expect(act).toThrow(AssertionError);
  });
});
