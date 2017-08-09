/*
 *  make_key.js
 *
 *  David Janes
 *  IOTDB
 *  2017-08-09
 *
 *  Make a keypair. We could just have "openssl req"
 *  write the keys to disk, but in this case we put
 *  them in memory and write them out ourselves
 */

const _ = require("iotdb-helpers")
const fs = require("iotdb-fs")
const Q = require("bluebird-q")

const openssl = require("iotdb-openssl")

Q({
    req_in: {
        "nodes": true,
        "x509": true,
        "sha256": true,
        "newkey": "rsa:4096",
        "keyout": openssl.outclude("document_private"), //, "utf8"), // `${KEY}.key`,
        "out": openssl.outclude("document_public"), //, "utf8"), // `${KEY}.crt`,
        "days": 365,
        "subj": "/C=CA/ST=Ontario/L=Toronto/O=Consensas/OU=IT/CN=David",
    },
})
    // make keypair
    .then(openssl.req)

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

    .then(sd => {
        console.log("+", "ok")
    })
    .catch(error => {
        console.log(error);
    })
