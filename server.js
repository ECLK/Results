const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const events = require('events');
const eventsEmitter = new events.EventEmitter();
let eventName = 'greeting';

const url = require('url');
const child_process = require('child_process');
const path = require('path')

class Publisher {
  publishMessage(){
    let message = "Yo";
    eventsEmitter.emit(eventName, message);
  }
}

class Subscriber {
  constructor(){
    eventsEmitter.on(eventName, (greeting) => {
      console.log('Someone sent me a greeting: ' + greeting)
    });
  }
}

// Lets create our publisher and subscriber
const publisher = new Publisher();
const subscriber = new Subscriber();


 
 
function download_file_with_wget(file_url, DOWNLOAD_DIR, DOWNLOADABLE_EXTENTIONS) {
    return new Promise((resolve, reject) => {
 
        DOWNLOAD_DIR = DOWNLOAD_DIR || 'src/elections/data/';
 
        DOWNLOADABLE_EXTENTIONS = DOWNLOADABLE_EXTENTIONS || ['.json'];
 
        // extract the file name
        const file_name = url.parse(file_url).pathname.split('/').pop()
 
        // compose the wget command
        const wget = 'wget -O ' + DOWNLOAD_DIR + '/elections.lk.presidential.2019.json ' + file_url

        // excute wget using child_process' exec function
        child_process.exec(wget, function (err, stdout, stderr) {
            return err ? reject(err) : resolve(file_name)
        });
    })
};
download_file_with_wget('https://resultstest.ecdev.opensource.lk/allresults').then(file=> console.log(file)).catch(e => console.log(e));

setInterval(function () {
    publisher.publishMessage();
    download_file_with_wget('https://resultstest.ecdev.opensource.lk/allresults').then(file=> console.log(file)).catch(e => console.log(e));
  }, 300000)


// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});