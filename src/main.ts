import * as got from 'got';
const conf = require("../config.json");

function doIt() {
  const newTime = new Date().toISOString();
  console.log("New Request: " + newTime);
  got("https://icanhazip.com/").then(res => {
    var TheBody = conf.body;
    TheBody.content = res.body;
    TheBody.modified_on = newTime;

    console.log("Sending...");
    got.put(`https://api.cloudflare.com/client/v4/zones/${conf.body.zone_id}/dns_records/${conf.body.id}`, {
      headers: {
        "X-Auth-Email": conf.eMail,
        "X-Auth-Key": conf.apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(TheBody).replace("\\n", "")
    }).then(res => {
      console.log(conf.body.name + " updated!");
    }).catch(err => {
      if (err.statusCode === 504) {
        // The Cloudflare API had a hiccup there.
      } else {
        console.error(err);
      }
    });
  }).catch(err => {
    console.error(err);
  });
}

doIt();
setInterval(() => {
  doIt();
}, conf.interval);
