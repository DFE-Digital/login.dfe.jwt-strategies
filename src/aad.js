'use strict';

const adal = require('adal-node');

const AuthenticationContext = adal.AuthenticationContext;

const aadStrategy = (config, cache) => {
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
  const tokenCacheKey = `${authorityUrl}|${resource}|${clientId}`;

  return {
    async getBearerToken() {
      try {
        const cachedToken = cache ? await cache.get(tokenCacheKey) : null;
        if (cachedToken) {
          return cachedToken;
        }
        return new Promise((resolve, reject) => {
          context.acquireTokenWithClientCredentials(resource, clientId, clientSecret, (err, data) => {
            if (err) reject(err);
            if (cache && data.expiresIn > 1) {
              cache.set(tokenCacheKey, data.accessToken, (data.expiresIn - 1) * 1000);
            }
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

