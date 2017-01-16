/// <reference path="../typings/index.d.ts"/>

import * as got from 'got';
var conf = require("../config");
function doIt() {
  const newTime = new Date().toISOString();
  console.log("New Request: " + newTime);
  got("https://icanhazip.com/").then(res => {
    var TheBody = conf.body;
    TheBody.content = res.body;
    TheBody.modified_on = newTime;

    got.put(`https://api.cloudflare.com/client/v4/zones/${conf.zone_id}/dns_records/${conf.id}`, {
      headers: {
        "X-Auth-Email": conf.eMail,
        "X-Auth-Key": conf.apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(TheBody).replace("\\n", "")
    }).then(res => {
      console.log(conf.body.name + " updated!");
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
