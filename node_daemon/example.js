// this code is run twice
// see implementation notes below
console.log(process.pid);

// after this point, we are a daemon
console.log('hello from line 6');
require('daemon')();
console.log('hello from line 8');
// different pid because we are now forked
// original parent has exited
console.log(process.pid);
console.log('hello from the end of the script');
