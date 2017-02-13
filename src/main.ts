/// <reference path="../typings/index.d.ts"/>

import * as got from 'got';
const conf = require("../config.json");

function doIt() {
  const newTime = new Date().toISOString();
  console.log("New Request: " + newTime);
  got("https://icanhazip.com/").then(res => {
    var TheBody = conf.body;
    TheBody.content = res.body;
    TheBody.modified_on = newTime;

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
      console.error(err);
    });
    console.log("Sending...");
  }).catch(err => {
    console.error(err);
  });
}

doIt();
setInterval(() => {
  doIt();
}, conf.interval);
