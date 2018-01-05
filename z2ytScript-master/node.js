const fs = require('fs');
const notifier = require('node-notifier');
const { spawnSync } = require('child_process');
const readline = require('readline');
const util = require('util');
const google = require('googleapis');
const googleAuth = require('google-auth-library');


const SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'google-apis-nodejs-quickstart.json';


fs.chmodSync('z2yt.sh', '755');

notifier.notify({
  title: 'Zoom To Youtube',
  message: 'We noticed you recently recorded a zoom video.  Would you like to upload it to youtube?',
  actions: "Yes",
  closeLabel: 'Not This Time',
  reply: true,
  sound: true
});

notifier.on('click', (object, options) => {
  const child = spawnSync('sh', ['z2yt.sh'], { stdio: 'inherit' });
  fs.readFile('client_secret.json', processClientSecrets = (err, content) => {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  let title, description, listing = '';
  fs.readFile('./vids/upload.txt', (err, data) => {
    if (err) console.log(err);
    const fields = data.toString().split('\n');
    title = fields[0].slice(7);
    description = fields[1].slice(13);
    listing = fields[2].slice(9);
  });
  authorize(JSON.parse(content), {'params': {'part': 'snippet,status'}, 'properties': {
                 'snippet.description': description,
                 'snippet.title': title,
                 'status.privacyStatus': listing,
      }, 'mediaFilename': './vids/zoom.mp4'}, videosInsert);
  });
});



const authorize = (credentials, requestData, callback) => {
  const clientSecret = credentials.installed.client_secret;
  const clientId = credentials.installed.client_id;
  const redirectUrl = credentials.installed.redirect_uris[0];
  const auth = new googleAuth();
  const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      getNewToken(oauth2Client, requestData, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client, requestData);
    }
  });
}


const getNewToken = (oauth2Client, requestData, callback) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oauth2Client.getToken(code, (err, token) => {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client, requestData);
    });
  });
}


const storeToken = (token) => {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}


const createResource = (properties) => {
  const resource = {};
  const normalizedProps = properties;
  for (let p in properties) {
    const value = properties[p];
    if (p && p.substr(-2, 2) == '[]') {
      const adjustedName = p.replace('[]', '');
      if (value) {
        normalizedProps[adjustedName] = value.split(',');
      }
      delete normalizedProps[p];
    }
  }
  for (let p in normalizedProps) {
    if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
      const propArray = p.split('.');
      let ref = resource;
      for (var pa = 0; pa < propArray.length; pa++) {
        const key = propArray[pa];
        if (pa == propArray.length - 1) {
          ref[key] = normalizedProps[p];
        } else {
          ref = ref[key] = ref[key] || {};
        }
      }
    };
  }
  return resource;
}

const videosInsert = (auth, requestData) => {
  const service = google.youtube('v3');
  const parameters = requestData['params'];
  parameters['auth'] = auth;
  parameters['media'] = { body: fs.createReadStream(requestData['mediaFilename']) };
  parameters['notifySubscribers'] = false;
  parameters['resource'] = createResource(requestData['properties']);
  let req = service.videos.insert(parameters, (err, data) => {
    if (err) {
      console.log('The API returned an error: ' + err);
    }
    if (data) {
      console.log(`\nYour video is live at https://www.youtube.com/watch?v=${data.id}`);
      notifier.notify({
        title: 'Zoom To Youtube',
        message: 'Your video has finished uploading',
        timeout: 5,
        sound: true
      });
    }
    process.exit();
  });
  const fileSize = fs.statSync(requestData['mediaFilename']).size;
  const id = setInterval(() => {
    const uploadedBytes = req.req.connection._bytesDispatched;
    const uploadedMBytes = uploadedBytes / 1000000;
    const progress = uploadedBytes > fileSize
        ? 100 : (uploadedBytes / fileSize) * 100;
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(uploadedMBytes.toFixed(2) + ' MBs uploaded. ' +
       progress.toFixed(2) + '% completed.');
    if (progress === 100) {
      process.stdout.write('Done uploading, waiting for response...');
      clearInterval(id);
    }
  }, 250);
}
