# rest-api

An API to communicate with the MongoDB.

## Endpoints

### Auth

#### `GET /api/auth`

Try to authenticate if the secret passed is the same. This endpoint is meant to be used internally and should not be used by users.

##### Parameters

- `secret`: the JWT secret should be the same as the rest-api server.

##### Response

```json
{
  auth: true,
  token: "...",
}
```

### Prefixes

#### `GET /api/prefixes`

Get all prefixes stored of all guilds.

##### Response

```json
[
  {
    "_id": "0123456789",
    "guildID": "0192837465",
    "prefix": "%"
  },
  {
    "_id": "0987654321",
    "guildID": "0174839076",
    "prefix": "!"
  }
]
```

#### `GET /api/prefixes/:guildID`

Get the prefix stored for a specific guild.

##### Response

```json
{
  "_id": "0123456789",
  "guildID": "0192837465",
  "prefix": "%"
}
```

#### `PUT /api/prefixes/:guildID`

Update the prefix of a specific guild, return the updated prefix object.

##### Parameters

- `prefix`: string

##### Response

```json
{
  "_id": "0123456789",
  "guildID": "0192837465",
  "prefix": "%"
}
```

#### `DELETE /api/prefixes/:guildID`

Delete the prefix stored for a specific guild.
