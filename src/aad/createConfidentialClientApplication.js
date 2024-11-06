const msal = require('@azure/msal-node');

function createConfidentialClientApplication({ clientId, authority, clientSecret }) {
  const msalConfig = {
    auth: {
      clientId,
      authority,
      clientSecret,
    },
    system: {
      loggerOptions: {
        loggerCallback(loglevel, message) {
          console.log(message);
        },
        piiLoggingEnabled: false,
        logLevel: msal.LogLevel.Error,
      },
    },
  };

  return new msal.ConfidentialClientApplication(msalConfig);
}

module.exports = createConfidentialClientApplication;
