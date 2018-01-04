// https://www.npmjs.com/package/node-notifier

const notifier = require('node-notifier');

if (process.platform === 'win32') {
    notifier.notify(`What the hay, ${process.env.USERNAME}?`);
    console.log(`You're using: ${process.platform}`)
  } else {
    notifier.notify(`What the hay, ${process.env.USER}?`);
    console.log(`You're using: ${process.platform}`)
  }
