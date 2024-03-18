jest.mock('@azure/msal-node', () => {
  return {
    ...jest.requireActual('@azure/msal-node'),
    ConfidentialClientApplication: jest.fn(),
  };
});

const msal = require('@azure/msal-node');
const createConfidentialClientApplication = require('../../src/aad/createConfidentialClientApplication');

const fakeAuth = {
  clientId: 'client-id-1',
  authority: 'http://ms.test/tenant-uuid-1',
  clientSecret: 'some-secret-key',
};

describe('createConfidentialClientApplication(auth)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('provides expected authentication parameters to the confidential client application', () => {
    createConfidentialClientApplication(fakeAuth);

    const actualConstructorParams = msal.ConfidentialClientApplication.mock.calls[0];
    const [ actualMsalConfig ] = actualConstructorParams;

    expect(actualMsalConfig.auth).toMatchObject({
      clientId: 'client-id-1',
      authority: 'http://ms.test/tenant-uuid-1',
      clientSecret: 'some-secret-key',
    });
  });

  it('disables the logging of personally identifiable information', () => {
    createConfidentialClientApplication(fakeAuth);

    const actualConstructorParams = msal.ConfidentialClientApplication.mock.calls[0];
    const [ actualMsalConfig ] = actualConstructorParams;

    expect(actualMsalConfig.system.loggerOptions.piiLoggingEnabled).toBe(false);
  });

  it('logs level is set to information', () => {
    createConfidentialClientApplication(fakeAuth);

    const actualConstructorParams = msal.ConfidentialClientApplication.mock.calls[0];
    const [ actualMsalConfig ] = actualConstructorParams;

    expect(actualMsalConfig.system.loggerOptions.logLevel).toBe(msal.LogLevel.Info);
  });

  it('logs messages to the console', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

    createConfidentialClientApplication(fakeAuth);

    const actualConstructorParams = msal.ConfidentialClientApplication.mock.calls[0];
    const [ actualMsalConfig ] = actualConstructorParams;
    actualMsalConfig.system.loggerOptions.loggerCallback(msal.LogLevel.Info, "Test123", false);

    const actualConsoleLogParams = spy.mock.calls[0];
    const [ actualConsoleLogMessage ] = actualConsoleLogParams;

    expect(actualConsoleLogMessage).toContain("Test123");
  });
});
