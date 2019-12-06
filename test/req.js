/**
 *  test/req.js
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

describe("req", function() {
    it("works", function(done) {
        _.promise({
            req_in: {
                "nodes": true,
                "x509": true,
                "sha256": true,
                "newkey": "rsa:512",
                "keyout": openssl.outclude("document_private", "utf-8"), 
                "out": openssl.outclude("document_public"),
                "days": 365,
                "subj": "/C=CA/ST=Ontario/L=Toronto/O=Consensas/OU=IT/CN=David",
            },
        })
            .then(openssl.req)
            .then(sd => {
                assert.ok(_.is.String(sd.document_private))
                assert.ok(_.is.Buffer(sd.document_public))
                assert.strictEqual(sd.document_public.toString("utf-8").indexOf("-----BEGIN CERTIFICATE-----"), 0)
                assert.strictEqual(sd.document_private.indexOf("-----BEGIN PRIVATE KEY-----"), 0)
            })
            .end(done)
    })
    it("parameterized", function(done) {
        _.promise({})
            .then(openssl.req.p({
                "nodes": true,
                "x509": true,
                "sha256": true,
                "newkey": "rsa:512",
                "keyout": openssl.outclude("document_private", "utf-8"), 
                "out": openssl.outclude("document_public"),
                "days": 365,
                "subj": "/C=CA/ST=Ontario/L=Toronto/O=Consensas/OU=IT/CN=David",
            }))
            .then(sd => {
                assert.ok(_.is.String(sd.document_private))
                assert.ok(_.is.Buffer(sd.document_public))
                assert.strictEqual(sd.document_public.toString("utf-8").indexOf("-----BEGIN CERTIFICATE-----"), 0)
                assert.strictEqual(sd.document_private.indexOf("-----BEGIN PRIVATE KEY-----"), 0)
            })
            .end(done)
    })
})
