const cache = require('memory-cache');

const get = async (key) => {
  return cache.get(key);
};

const set = async (key, value, timeout = 0) => {
  if (timeout > 0) {
    cache.put(key, JSON.stringify(value), timeout);
  } else {
    cache.put(key, JSON.stringify(value));
  }
};

module.exports = {
  get,
  set,
};
