'use strict';

const secretStrategy = config => ({
  async getBearerToken() {
    return config.auth.jwt;
  },
});

module.exports = secretStrategy;
