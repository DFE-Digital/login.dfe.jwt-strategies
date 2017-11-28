'use strict';

const adal = require('adal-node');

const AuthenticationContext = adal.AuthenticationContext;

const aadStrategy = (config) => {
  const loggingOptions = adal.Logging.getLoggingOptions();
  if (config.auth.logLevel) {
    loggingOptions.level = config.auth.logLevel;
  } else {
    loggingOptions.level = adal.Logging.LOGGING_LEVEL.INFO;
  }
  adal.Logging.setLoggingOptions(loggingOptions);

  const {
    tenant,
    authorityHostUrl,
    clientId,
    clientSecret,
    resource,
  } = config.auth;

  const authorityUrl = `${authorityHostUrl}/${tenant}`;
  const context = new AuthenticationContext(authorityUrl);

  return {
    async getBearerToken() {
      try {
        return new Promise((resolve, reject) => {
          context.acquireTokenWithClientCredentials(resource, clientId, clientSecret, (err, data) => {
            if (err) reject(err);
            resolve(data.accessToken);
          });
        });
      } catch (e) {
        return '';
      }
    },
  };
};

module.exports = aadStrategy;

