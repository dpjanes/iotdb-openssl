/*
 *  issuer.js
 *
 *  David Janes
 *  IOTDB
 *  2017-08-09
 *
 *  This demonstrates how to pull the issuer out
 *  of a file. See "issuer_native" for a better 
 *  option.
 */

const _ = require("iotdb-helpers")

const fs = require("iotdb-fs")

const x509 = require("x509");

_.promise.make({
    path: "key.crt",
})
    .then(fs.read.utf8)
    .then(sd => {
        // const issuer = x509.parseCert(__dirname + "/key.crt")
        const issuer = x509.getIssuer(sd.document)
        console.log(JSON.stringify(issuer, null, 2))
    })
    .catch(error => {
        console.log("#", error)
    })
