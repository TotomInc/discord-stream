# note

[![Greenkeeper badge](https://badges.greenkeeper.io/TotomInc/discord-stream.svg)](https://greenkeeper.io/)

> A music bot for Discord with high-performance, easily scalable.

## Installation

```bash
# install dependencies
yarn

# compile source & start app
yarn start
```

Don't forget to edit the `.env` file, this file contains tokens and options. Those variables will be included in the app as environment variables.

If you plan to run the bot on a VM, I recommend you to setup [`pm2`](http://pm2.keymetrics.io/) as the app will automatically restart when it crashes, when the VM restart, ...

I highly recommend the use of [`ndb`](https://github.com/GoogleChromeLabs/ndb) to debug the app properly.

```bash
# install ndb globally
yarn global add ndb

# inside the cloned repo, run
ndb .

# once ndb opened, run the `yarn dev` script on the bottom left of the ndb window
```

## License

This project is under [MIT license](https://github.com/TotomInc/discord-streamer/blob/master/LICENSE).
