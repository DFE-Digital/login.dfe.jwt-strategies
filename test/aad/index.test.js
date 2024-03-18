jest.mock('../../src/aad/getConfidentialClientApplication');

const getConfidentialClientApplication = require('../../src/aad/getConfidentialClientApplication');
const aadStrategy = require('../../src/aad');

const config = {
  auth: {
    tenant: 'tenant-uuid',
    authorityHostUrl: 'http://ms.test',
    clientId: 'client-uuid',
    clientSecret: 'some-secret-key',
    resource: 'resource-uuid',
  },
};

describe('When getting a token from AAD', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('then it should acquire a token with the expected scope', async () => {
    const fakeCca = {
      acquireTokenByClientCredential: jest.fn(),
    };
    getConfidentialClientApplication.mockReturnValue(fakeCca);

    const strategy = aadStrategy(config);
    await strategy.getBearerToken();

    expect(fakeCca.acquireTokenByClientCredential).toHaveBeenCalledWith({
      scopes: [ 'resource-uuid/.default' ],
    });
  });

  it('then it should return token from AAD', async () => {
    const fakeCca = {
      acquireTokenByClientCredential: async () => ({
        accessToken: 'test-token-from-aad',
      }),
    };
    getConfidentialClientApplication.mockReturnValue(fakeCca);

    const strategy = aadStrategy(config);
    const result = await strategy.getBearerToken();

    expect(result).toBe('test-token-from-aad');
  });
});
