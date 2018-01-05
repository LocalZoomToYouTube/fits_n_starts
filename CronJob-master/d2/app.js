const fs = require('fs');

// const x = () => {
//   // fs.writeFile("test.txt", "Hey there!\n", function(err) {
//   fs.appendFile("test.txt", `Hey there! ${Date.now()}\n`, function(err) {
//   // fs.appendFileSync("test.txt", `Hey there! ${Date.now()}\n`, function(err) {
//     if(err) {
//         // return console.log(err);
//         return err;
//         // throw err;
//     }
//     console.log("The file was saved!");
// })};
//
// setInterval(x, 1000);

var kidProcess = require('child_process');
kidProcess.exec('say yo, this is a REALLY important notification which you should do something about RIGHT NOW, man',function (err,stdout,stderr) {
    if (err) {
        throw stderr;
    }
});
