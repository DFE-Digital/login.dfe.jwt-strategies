jest.mock('adal-node', () => {
  return {
    AuthenticationContext: jest.fn(),
    Logging: {
      getLoggingOptions: jest.fn().mockReturnValue({
        level: '',
      }),
      setLoggingOptions: jest.fn(),
      LOGGING_LEVEL: {
        INFO: 'INFO',
      },
    },
  };
});

const adal = require('adal-node');

const acquireTokenWithClientCredentials = jest.fn();
const config = {
  auth: {
    tenant: 'tenant-uuid',
    authorityHostUrl: 'http://ms.test',
    clientId: 'client-uuid',
    clientSecret: 'some-secret-key',
    resource: 'resource-uuid',
  },
};
const cache = {
  get: jest.fn(),
  set: jest.fn(),
};

describe('When getting a token from AAD', () => {
  let aadStrategy;

  beforeEach(() => {
    acquireTokenWithClientCredentials.mockReset();
    acquireTokenWithClientCredentials.mockImplementation((resource, clientId, clientSecret, callback) => {
      callback(null, {
        accessToken: 'access-token',
        expiresIn: 60,
      });
    });

    adal.AuthenticationContext.mockReset();
    adal.AuthenticationContext.mockImplementation(() => {
      return {
        acquireTokenWithClientCredentials,
      };
    });

    cache.get.mockReset();
    cache.set.mockReset();

    aadStrategy = require('./../src/aad');
  });

  it('then it should return token from AAD', async () => {
    const actual = await aadStrategy(config, cache).getBearerToken();

    expect(actual).toBe('access-token');
  });

  it('then it should call aad with config values', async () => {
    await aadStrategy(config, cache).getBearerToken();

    expect(adal.AuthenticationContext.mock.calls).toHaveLength(1);
    expect(adal.AuthenticationContext.mock.calls[0][0]).toBe('http://ms.test/tenant-uuid');

    expect(acquireTokenWithClientCredentials.mock.calls).toHaveLength(1);
    expect(acquireTokenWithClientCredentials.mock.calls[0][0]).toBe('resource-uuid');
    expect(acquireTokenWithClientCredentials.mock.calls[0][1]).toBe('client-uuid');
    expect(acquireTokenWithClientCredentials.mock.calls[0][2]).toBe('some-secret-key');
  });

  it('then it should add to cache if cache specified and expiry longer than a second', async () => {
    await aadStrategy(config, cache).getBearerToken();

    expect(cache.set.mock.calls).toHaveLength(1);
    expect(cache.set.mock.calls[0][0]).toBe('http://ms.test/tenant-uuid|resource-uuid|client-uuid');
    expect(cache.set.mock.calls[0][1]).toBe('access-token');
    expect(cache.set.mock.calls[0][2]).toBe(59000);
  });

  it('then it should not add to cache if cache specified but expiry less than a second', async () => {
    acquireTokenWithClientCredentials.mockImplementation((resource, clientId, clientSecret, callback) => {
      callback(null, {
        accessToken: 'access-token',
        expiresIn: 0,
      });
    });

    await aadStrategy(config, cache).getBearerToken();

    expect(cache.set.mock.calls).toHaveLength(0);
  });

  it('then it should not add to cache if cache not specified', async () => {
    await aadStrategy(config, null).getBearerToken();

    expect(cache.set.mock.calls).toHaveLength(0);
  });

  it('then it should return token from cache if available', async () => {
    cache.get.mockReturnValue('cached-token');

    const actual = await aadStrategy(config, cache).getBearerToken();

    expect(actual).toBe('cached-token');
  });
});
