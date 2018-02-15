# login.dfe.jwt-strategies

This package provides various jwt strategies to login.dfe components.

## Usage  

```
let jwtStrategy = require('login.dfe.jwt-strategies');
```

```
let token = await jwtStrategy(options).getBearerToken;
```

## Options

```
{
    url: 'string',
    auth: {...} // See below
}
```
The presence of a url indicated that a strategy is required, without a url defined null is returned. 

An exception of AssertionError is thrown if the required config options are not present for the defined strategy.

### Active Directory Strategy

```
{
    url: 'https://some.url',
    auth: {
        type: 'aad',
        tenant: 'string',
        authorityHostUrl: 'string',
        clientId: 'string',
        clientSecret: 'string',
        resource: 'string',
    }
}
```

### Simple Jwt Strategy 

```
{
    url: 'https://some.url',
    auth: {
        type: 'secret',
        jwt: 'string',
    }
}
```

## Caching

Caching is enabled by default and will be used with the AAD strategy. By default, tokens are cached in memory.

to disable caching, set cache to null:
```
jwtStrategy.cache = null;
```

to use a custom cache, provide an implementation as per below:
```
jwtStrategy.cache = {
    get: async (key) => { /*Get value for key from cache*/ },
    set: async (key, value, timeout = 0) => { /*Add value to cache with key and optionally timeout*/ },
}
```