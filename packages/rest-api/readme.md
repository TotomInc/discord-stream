# rest-api

Source for the rest-api.

## Endpoints

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
