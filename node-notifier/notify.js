// https://www.npmjs.com/package/node-notifier

const notifier = require('node-notifier');

notifier.notify(`What the hay, ${process.env.USER}?`);
