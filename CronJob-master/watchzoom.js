//var chokidar = require('chokidar');

// var watcher = chokidar.watch(zoom, {
//   ignored: /(^|[\/\\])\../,
//   persistent: true
// });
// var log = console.log.bind(console);
//-------------------------------------------------------------//

// the above is another library that looked like it would be easier
// to work with, but I can't seem to get it to work.

// Also, this keeps saying that my file doesn't exist

var fs = require('fs');
const filePath = `/Users/%{process.env.USER}/Documents/Zoom`;
const file = fs.readFileSync(filePath);
console.log('Initial File content: ' + file);


var CronJob = require('cron').CronJob;
new CronJob('* * * * * *', function() {
  fs.watch(filePath, function(event, fileName) {
    if(fileName) {
      console.log('Event: ' + event);
      console.log(filename + ' File Change ...');
      file = fs.readFileSync(filePath);
      console.log("File content at: " + new Date() + ' is \n' + file);
    }
    else{
      console.log('filename not provided')
    }
  });
}, null, true, 'America/Los_Angeles');
