/**
 *  test/issuer.js
 *
 *  David Janes
 *  IOTDB
 *  2019-12-05
 *
 *  Copyright (2013-2020) David P. Janes
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict"

const _ = require("iotdb-helpers")
const fs = require("iotdb-fs")

const assert = require("assert")
const path = require("path")

const openssl = require("..")
const _util = require("./_util")

describe("issuer", function() {
    it("works", function(done) {
        _.promise.make({
            x509_in: {
                in: path.join(__dirname, "data", "key.crt"),
                issuer: true,
            },
        })
            .then(openssl.x509)
            .then(sd => {
                const got = sd.document.toString("utf-8").split("\n")[0].replace(/issuer= /, "")
                const want = "/C=CA/ST=Ontario/L=Toronto/O=Consensas/OU=IT/CN=David"

                assert.deepEqual(got, want)
            })
            .end(done)
    })
    it("paramaterized", function(done) {
        _.promise.make()
            .then(openssl.x509.p({
                in: path.join(__dirname, "data", "key.crt"),
                issuer: true,
            }))
            .then(sd => {
                const got = sd.document.toString("utf-8").split("\n")[0].replace(/issuer= /, "")
                const want = "/C=CA/ST=Ontario/L=Toronto/O=Consensas/OU=IT/CN=David"

                assert.deepEqual(got, want)
            })
            .end(done)
    })
    it("issuer.issuer", function(done) {
        _.promise.make({
            x509_in: {
                in: path.join(__dirname, "data", "key.crt"),
                issuer: true,
            },
        })
            .then(openssl.x509.issuer)
            .then(sd => {
                const got = sd.issuer
                const want = "/C=CA/ST=Ontario/L=Toronto/O=Consensas/OU=IT/CN=David"

                assert.deepEqual(got, want)
            })
            .end(done)
    })
})
