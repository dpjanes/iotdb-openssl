/*
 *  make_root_key.js
 *
 *  David Janes
 *  IOTDB
 *  2017-08-09
 */

const _ = require("iotdb-helpers")
const fs = require("iotdb-fs")
const Q = require("bluebird-q")

const openssl = require("iotdb-openssl")

// openssl genrsa -aes256 -out private/ca.key.pem 4096

Q({
    password: "david",
    genrsa_in: {
        "aes256": true,
        "out": openssl.outclude("document"),
        "passout": "pass:david",
        _: 512,
    },
})
    // make keypair
    .then(openssl.genrsa)

    /*
    // write private key
    .then(sd => _.d.update(sd, {
        document: sd.document_private,
        path: "key.key",
    }))
    .then(fs.write.buffer)

    // write public key
    .then(sd => _.d.update(sd, {
        document: sd.document_public,
        path: "key.crt",
    }))
    .then(fs.write.buffer)
    */

    .then(sd => {
        console.log("+", "ok", sd.document.toString(), "-")
    })
    .catch(error => {
        console.log(error);
    })
