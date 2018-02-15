const assert = require('assert');
const secretStrategy = require('./secret');
const aadStrategy = require('./aad');
const cacheAdapter = require('./memoryCacheAdapter');

const getJwtStrategy = (config) => {
  const requiresJwt = config.url !== undefined;
  if (!requiresJwt) {
    return null;
  }

  assert(config.auth.type, 'auth.type configuration attribute required');
  assert(['aad', 'secret'].includes(config.auth.type), 'auth.type must be a know type (secret or aad)');

  if (config.auth.type === 'secret') {
    assert(config.auth.jwt, 'auth.jwt configuration attribute required');
    return secretStrategy(config);
  }

  if (config.auth.type === 'aad') {
    assert(config.auth.tenant, 'auth.tenant configuration attribute required');
    assert(config.auth.authorityHostUrl, 'auth.authorityHostUrl configuration attribute required');
    assert(config.auth.clientId, 'auth.clientId configuration attribute required');
    assert(config.auth.clientSecret, 'auth.clientSecret configuration attribute required');
    assert(config.auth.resource, 'auth.resource configuration attribute required');

    return aadStrategy(config, getJwtStrategy.cache);
  }
  return null;
};

getJwtStrategy.cache = cacheAdapter;

module.exports = getJwtStrategy;
