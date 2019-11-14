const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const url = require('url');
const child_process = require('child_process');
const path = require('path');
const rp = require('request-promise');
const fs = require('fs');
const moment = require('moment')

function download_file_with_wget(file_url, DOWNLOAD_DIR, DOWNLOADABLE_EXTENTIONS) {
  return new Promise((resolve, reject) => {

    DOWNLOAD_DIR = DOWNLOAD_DIR || 'elections/data/';

    DOWNLOADABLE_EXTENTIONS = DOWNLOADABLE_EXTENTIONS || ['.json'];

    FILE_URL = DOWNLOAD_DIR + '/elections.lk.presidential.2019.json';

    const file_name = url.parse(file_url).pathname.split('/').pop()

    var options = {
      uri: file_url,
      json: true
    };

    rp(options)
      .then((res) => {
        console.log("Result recieved")
        res = res.map((o) => {
          return {
            ...o,
            timestamp: (moment(o.timestamp).toDate().getTime()) / 1000
            // TODO: [BUG] Requires date in format of 757399980.0 but actual format recieved by url is 2019-11-13T13:00:53.566+0000
            // FIXED: by adding the above moment script. Remove if the date format is fixed from the original url
          }

        })
        fs.writeFile(FILE_URL, JSON.stringify(res, null, 2), (err) => {
          if (err) {
            console.log("File save failed")
            console.error(err);
            reject(err)
          }
          console.log("File was saved!");
          resolve(file_name);
        });
      })
      .catch(function (err) {
        console.log("Result recieve failed")
        console.error(err);
        reject(err);
      });
  })
};

if (process.env.RESULT_URL) {
  download_file_with_wget(process.env.RESULT_URL).then(file => console.log(file)).catch(e => console.log(e));

  setInterval(() => {
    download_file_with_wget(process.env.RESULT_URL).then(file => console.log(file)).catch(e => console.log(e));
  }, process.env.REFRESH_INTERVAL || 300000)

} else {
  const file = 'elections/data/elections.lk.presidential.2019.json';
  fs.writeFile(file, JSON.stringify([], null, 2), (err) => {
    if (err) {
      console.log("Empty File save failed")
      console.error(err);

    }
    console.log("Empty File was saved!");

  });
}

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

app.use(express.static(path.join(__dirname, './build')));
app.use(express.static(path.join(__dirname, './elections')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './build', 'index.html'));
});

app.get('/healthz', function (req, res) {
  res.status(200).send('healthy');
});


// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));