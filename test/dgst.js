/**
 *  test/dgst.js
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
const document = require("iotdb-document")

const assert = require("assert")
const path = require("path")

const openssl = require("..")
const _util = require("./_util")

const REFERENCE = "Hello World"
const SIGNED = "RK+yl1IHA1e3zdMdtNI8g0nCFH7BAP1CBCjALc9JAqFRUcQBLLKHrBR4eXu8zX7WFpbjwdPKgisl/FrMYozh6SNhGs98u5QdWl8nTTmK2/xhQQ7gayjYHSdO7LJ+8lczDTWL2SnBSarZQKZ5j52HQgK88FlXT4vGeBg7xIruXs5lKASws1G+UNY+eTWZVNtDjfO4x5U5jAqLptt6dnFRlLujeoK6X9f0GQb3AtG83kHCdGZY+/8lD2XbP9DE/5Luuc6gfjl+4QsXS+Ehd1d0O3U7x+dlGSmLdY99oY1uVnKR9fIN6CQ+XsegpGEtel2WNS6TOrGnmDFyYi9HPtV8yQtGBjA3kJquNA6Rk7BtipjJSgwcB64dHknPMElvLwaKjiRCUWqw1S51CV3CD4+95ZczZTDY3ZO9yqs6A8hv7zjDDCqzWNQpbaxxdiomkWvZjACDrMfY0gNuf2RM66YHz+fxKt6imtL0BrxgEHXLNz8mR8n1AsxtdZjKOCzTWRG5IVPcXnylYc4KuZCRiIe7YMyA8JzJk7v32rTZ9jpnRpzaht8aHH73OhKya3DKv0T9AP5Vcjr3fVizDBHpDayMgpU1dfpKhWgS4bp1s2ZsbZvxT6bpU1Dl+hu4CSeaWIOWH30ZuJDlXKkf1bLtHs0YWtENq8pEImnW5pqzvUsyY7g="

describe("dgst", function() {
    it("dgst works", function(done) {
        _.promise({
            document_in: REFERENCE,
            dgst_in: {
                sha256: true,
                sign: path.join(__dirname, "data", "key.key"),
                _: openssl.include("document_in", "base64"),
            },
        })
            .then(openssl.dgst)
            .then(sd => {
                const got = sd.document.toString("base64")
                const expected = SIGNED
                assert.strictEqual(got, expected)
            })
            .end(done)
    })
    it("dgst works with sign/include", function(done) {
        _.promise({
            document_in: REFERENCE,
            
            dgst_in: {
                sha256: true,
                sign: openssl.include("document"),
                _: openssl.include("document_in", "base64"),
            },
        })
            .then(fs.read.p(path.join(__dirname, "data", "key.key")))
            .then(openssl.dgst)
            .then(sd => {
                const got = sd.document.toString("base64")
                const expected = SIGNED
                assert.strictEqual(got, expected)
            })
            .end(done)
    })
    it("dgst parameterized", function(done) {
        _.promise({
            document_in: REFERENCE,
        })
            .then(openssl.dgst.p({
                sha256: true,
                sign: path.join(__dirname, "data", "key.key"),
                _: openssl.include("document_in", "base64"),
            }))
            .then(document.to.base64)
            .then(sd => {
                const got = sd.document // .toString("base64")
                const expected = SIGNED
                assert.strictEqual(got, expected)
            })
            .end(done)
    })
})
