'use strict';

const adal = require('adal-node');

const AuthenticationContext = adal.AuthenticationContext;

const aadStrategy = (config) => {
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

