// fs.existSync searches sub-directories!

const fs = require('fs');

const path = `/Users/${process.env.USER}/Documents/Zoom/2017-12-08 17.58.32 Patrick Kennedy's Zoom Meeting 670795319/`

// const filename = 'zoom_0.mp4'
// fs.watch(`/Users/${process.env.USER}/Documents/Zoom/`, (eventType, filename) => {
//   console.log(`event type is: ${eventType}`);
//   if (filename) {
//     console.log(`filename provided: ${filename}`);
//   } else {
//     console.log('filename not provided');
//   }
// });

// // BASIC SUCCESS
if (fs.existsSync(path + 'zoom_0.mp4')) {
  console.log('wOOt!')
} else {
  console.log('waaaaah :(')
}

// possible way to avoid Zoom directory naming?
var kidProcess = require('child_process');
kidProcess.exec('find ~/Documents/Zoom -name "*.mp4"',function (err,stdout,stderr) {
    if (err) {
        console.log("\n"+stderr);
    } else {
        console.log(typeof(stdout));
        console.log(stdout);
        console.log(stdout.split('\n'))
    }
});

// kidProcess.exec('say yo, this is a REALLY important notification',function (err,stdout,stderr) {
//     if (err) {
//         console.log("\n"+stderr);
//     }
// });


// fs.open(path+'zoom_0.mp4', 'r', (err, fd) => {
//   if (err) {
//     if (err.code === 'ENOENT') {
//       console.error('myfile does not exist');
//       return;
//     }
//
//     throw err;
//   }
//   console.log('success')
// });
