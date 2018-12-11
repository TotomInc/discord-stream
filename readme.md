# note

[![Greenkeeper badge](https://badges.greenkeeper.io/TotomInc/discord-stream.svg)](https://greenkeeper.io/)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

> A music bot for Discord with high-performance, easily scalable.

## Structure

The project is split into smaller packages which can be found into the `/packages` folder:

- `discord-bot`: source for the Discord bot.

Each package contains a `readme`.

## Quick-setup

```bash
# install dependencies across the multiple packages
yarn

# run build script on all packages
yarn build
```

Don't forget to edit the `.env` file, it contains tokens and options which are empty by default (so the bot won't start if you don't fill them). Those variables will be included in the app as environment variables.

## License

This project is under [MIT license](https://github.com/TotomInc/discord-streamer/blob/master/LICENSE).
