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

An exception of AssertionError is thrown if the required config options are not present for the defined strategy

### Active Directory Strategy

```
{
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
    auth: {
        type: 'secret',
        jwt: 'string',
    }
}
```