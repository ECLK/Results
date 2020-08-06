const axios = require('axios');
const moment = require('moment')

const fs = require("fs")

const username = process.env.username
const pass = process.env.password
const targetURL = process.env.targetURL
const filename = process.env.filename
const interval = process.env.interval || 20000


function requestData() {
    axios.get(targetURL, {
        // Axios looks for the `auth` option, and, if it is set, formats a
        // basic auth header for you automatically.
        auth: {
            username: username,
            password: pass
        }
    }).then((data) => {
        console.log("data recieved..")
        data.data = data.data.map((o) => {
            return {
                ...o,
                timestamp: (moment(o.timestamp).toDate().getTime()) / 1000
            }
        });
        writeFile(data.data)
    }).catch((err) => {
        console.error("error fetchhing data", err)
    });
}



function writeFile(data) {
    fs.writeFileSync(`./data/${filename}`, JSON.stringify(data, null, 4));
    console.log(`successfully written to file ${filename}`)
}

requestData()

setInterval(() => {
    requestData()
}, interval)
