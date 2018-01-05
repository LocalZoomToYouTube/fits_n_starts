var CronJob = require('cron').CronJob;
new CronJob('* * * * * *', function() {
  console.log(`You will see this message every second; ${process.pid}`);
}, null, true, 'America/Los_Angeles');
