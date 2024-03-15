const createConfidentialClientApplication = require('./createConfidentialClientApplication');

const ccaCache = new Map();

function getConfidentialClientApplication(auth) {
  const cacheKey = `${auth.authority}|${auth.resource}|${auth.clientId}`;
  const cachedCca = ccaCache.get(cacheKey);
  if (!!cachedCca) {
    return cachedCca;
  }

  const cca = createConfidentialClientApplication(auth);
  ccaCache.set(cacheKey, cca);

  return cca;
}

module.exports = getConfidentialClientApplication;
