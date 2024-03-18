const getConfidentialClientApplication = require('./getConfidentialClientApplication');

const aadStrategy = (config) => {
  const cca = getConfidentialClientApplication({
    ...config.auth,
    authority: `${config.auth.authorityHostUrl}/${config.auth.tenant}`,
  });

  return {
    async getBearerToken() {
      try {
        const response = await cca.acquireTokenByClientCredential({
          scopes: [ `${config.auth.resource}/.default` ],
        });
        return response.accessToken;
      }
      catch (e) {
        return '';
      }
    },
  };
};

module.exports = aadStrategy;
