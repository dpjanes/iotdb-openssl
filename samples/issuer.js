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
const Q = require("bluebird-q")

const openssl = require("iotdb-openssl")

Q({
    x509_in: {
        in: "key.crt",
        issuer: true,
    },
})
    .then(openssl.x509)
    .then(sd => {
        console.log(sd.document.toString("utf-8").split("\n")[0])
    })
    .catch(error => {
        console.log(error);
    })
