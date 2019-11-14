# note

[![Greenkeeper badge](https://badges.greenkeeper.io/TotomInc/discord-stream.svg)](https://greenkeeper.io/)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

> A music bot for Discord with high-performance.

## Structure

This project a mono-repo, which means it is split into smaller packages:

- `discord-bot`: source for the Discord bot.
- `rest-api`: an API to communicate with MongoDB and third-party tools.
- `models`: contains models that are used across the multiple packages.

## Quick-setup

1. Make sure you have the following dependencies installed on your system:

   - [FFMPEG](https://www.ffmpeg.org/) (used by discord-bot package)
   - [MongoDB](https://www.mongodb.com) (used by rest-api package)

2. Bootstrap all packages and build them:

    ```bash
    # link local-dependencies and install other dependencies on all packages
    yarn bootstrap

    # run build script on all packages
    yarn build
    ```

3. Create a copy of the `.env.example` as a `.env` file and make sure to fill all the requested fields.

4. You will need to run all packages as separate background processes, I recommend using [PM2](https://pm2.io/doc/en/runtime/overview/) for this task.

    ```bash
    ## start the rest-api server as a background process
    pm2 start packages/rest-api/dist --name rest-api

    ## start the discord-bot as a background process
    pm2 start packages/discord-bot/dist --name discord-bot
    ```

## License

This project is under [MIT license](https://github.com/TotomInc/discord-streamer/blob/master/LICENSE).
