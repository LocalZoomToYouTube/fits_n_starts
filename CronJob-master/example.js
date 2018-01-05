const fs = require('fs-extra');

const zoom = `/Users/${process.env.USER}/Documents/Zoom/2017-12-05 13.52.54 Emma Drueke's Zoom Meeting 889634849`

 console.log(zoom.slice(zoom.length - 10));

try {
  fs.copySync(zoom, `/Users/${process.env.USER}/Documents/Zoom/${zoom.slice(zoom.length - 10)}`)
  // fs.copySync("/Users/mixelpix/Documents/Zoom/2017-12-12 11.23.03 Patrick Kennedy's Zoom Meeting 901264977/zoom_0.mp4", "/Users/mixelpix/Documents/Zoom/copy.mp4");
  console.log('success!');
} catch (err) {
  console.log(err);
}