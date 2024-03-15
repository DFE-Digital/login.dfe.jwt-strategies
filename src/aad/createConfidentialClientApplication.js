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
        loggerCallback(loglevel, message, containsPii) {
          console.log(message);
        },
        piiLoggingEnabled: false,
        logLevel: msal.LogLevel.Info,
      }
    },
  };

  return new msal.ConfidentialClientApplication(msalConfig);
}

module.exports = createConfidentialClientApplication;
