const secretStrategy = require('../../src/secret');

describe('Strategy: Secret', () => {
  it.each([
    [
      {
        auth: {
          jwt: 'the-jwt-1',
        },
      },
      'the-jwt-1',
    ],
    [
      {
        auth: {
          jwt: 'the-jwt-2',
        },
      },
      'the-jwt-2',
    ],
  ])('returns the provided jwt secret', async (config, expectedToken) => {
    const strategy = secretStrategy(config);

    const token = await strategy.getBearerToken();

    expect(token).toBe(expectedToken);
  });
});
