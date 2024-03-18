jest.mock('../../src/aad/createConfidentialClientApplication', () => {
  return () => new Object();
});

const getConfidentialClientApplication = require('../../src/aad/getConfidentialClientApplication');

describe('getConfidentialClientApplication(auth)', () => {
  it.each([
    [
      {
        authority: 'http://ms.test/tenant-uuid-1',
        clientId: 'client-uuid',
        clientSecret: 'some-secret-key',
        resource: 'resource-uuid',
      },
      {
        authority: 'http://ms.test/tenant-uuid-2',
        clientId: 'client-uuid',
        clientSecret: 'some-secret-key',
        resource: 'resource-uuid',
      },
    ],
    [
      {
        authority: 'http://ms.test/tenant-uuid',
        clientId: 'client-uuid-1',
        clientSecret: 'some-secret-key',
        resource: 'resource-uuid',
      },
      {
        authority: 'http://ms.test/tenant-uuid',
        clientId: 'client-uuid-2',
        clientSecret: 'some-secret-key',
        resource: 'resource-uuid',
      },
    ],
    [
      {
        authority: 'http://ms.test/tenant-uuid',
        clientId: 'client-uuid',
        clientSecret: 'some-secret-key',
        resource: 'resource-uuid-1',
      },
      {
        authority: 'http://ms.test/tenant-uuid',
        clientId: 'client-uuid',
        clientSecret: 'some-secret-key',
        resource: 'resource-uuid-2',
      },
    ],
  ])('returns a unique instance for unique resource requests', (authForApp1, authForApp2) => {
    const app1 = getConfidentialClientApplication(authForApp1);
    const app2 = getConfidentialClientApplication(authForApp2);

    expect(Object.is(app1, app2)).toBe(false)
  });

  it('returns the same instance each time the same resource is requested', () => {
    const auth = {
      authority: 'http://ms.test/tenant-uuid',
      clientId: 'client-uuid',
      clientSecret: 'some-secret-key',
      resource: 'resource-uuid',
    };

    const result1 = getConfidentialClientApplication(auth);
    const result2 = getConfidentialClientApplication(auth);

    expect(Object.is(result1, result2)).toBe(true)
  });
});
