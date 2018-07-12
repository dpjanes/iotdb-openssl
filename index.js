/*
 *  index.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-07
 *
 *  Copyright [2013-2018] [David P. Janes]
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

"use strict";

const _ = require("iotdb-helpers")

const openssl = require("openssl-wrapper").exec
const tmp = require('tmp');

const fs = require("fs")
const assert = require("assert")

/**
 *  This will look up data in self and write
 *  it to a file. The filename is returned
 */
const include = (keypath, document_encoding) => self => {
    const buffer = _.d.first(self, keypath)
    assert.ok(_.is.Buffer(buffer) || _.is.String(buffer))

    const t = tmp.fileSync();

    if (_.is.String(buffer)) {
        fs.writeFileSync(t.name, buffer, document_encoding || "utf-8")
    } else {
        fs.writeFileSync(t.name, buffer)
    }

    return t.name;
}

/**
 *  Similar to include, but will return a variable
 *  with file: in front
 */
const passclude = (keypath, document_encoding) => self => {
    const buffer = _.d.first(self, keypath)
    assert.ok(_.is.Buffer(buffer) || _.is.String(buffer))

    const t = tmp.fileSync();

    if (_.is.String(buffer)) {
        fs.writeFileSync(t.name, buffer, document_encoding || "utf-8")
    } else {
        fs.writeFileSync(t.name, buffer)
    }

    return `file:${t.name}`;
}

/**
 *  This will make a temporary file.
 *  When the command has finished, the 
 *  contents of the temporary file 
 *  will be read into memory at this variable
 */
const outclude = (keypath, document_encoding) => self => {
    const t = tmp.fileSync();

    _.d.set(self, keypath, t.name)

    self._outclusiond[keypath] = {
        name: t.name,
        document_encoding: document_encoding,
    }

    return t.name;
}

/**
 *  Note:
 *  open ssl likes to deal with files on the file system, so a simple
 *  in/out model is not sufficient.
 *
 *  - inclusions: this will convert a document in memory into a temporary file
 *  - outclusions: this will create a temporary file. after the command
 *    has run, that file will be read into memory
 */
const _build = (name, command, post) => {
    command = command || name;
    post = post || (s => s);

    return _.promise.denodeify(
        (_self, done) => {
            const self = _.d.clone.shallow(_self)
            self._outclusiond = [];

            const in_key = `${name}_in`
            const out_key = `${name}_out`

            const _inclusions = o => {
                if (_.is.Array(o)) {
                    return o.map(_inclusions);
                } else if (_.is.Function(o)) {
                    return o(self)
                } else if (_.is.Object(o)) {
                    return _.mapObject(o, (value, key) => _inclusions(value))
                } else {
                    return o;
                }
            }

            const options = _inclusions(self[in_key])

            // trailing parameters come in with "_"
            if (_.is.Nullish(options._)) {
            } else if (_.is.Array(options._)) {
                options._.forEach(last => options[last] = false)
            } else {
                options[options._] = false;
            }
            delete options._;

            openssl(command, options, (error, out) => {
                if (error) { 
                    return done(error)
                }

                self.document = out;
                post(self)

                // outclusions
                _.mapObject(self._outclusiond, (outclusion, keypath) => {
                    _.d.set(self, keypath, fs.readFileSync(outclusion.name, outclusion.document_encoding))
                })
                delete self._outclusiond;

                done(null, self)
            })
        }
    )
}

const _p = name => {
    return ind => {
        return _.promise.denodeify((_self, done) => {
            const self = _.d.clone.shallow(_self)

            _.promise.make(self)
                .then(sd => _.d.add(sd, `${name}_in`, ind))
                .then(exports[name])
                .then(sd => done(null, sd))
                .catch(done)
        })
    }
}

/**
 *  API
 */
exports.x509 = _build("x509")
exports.req = _build("req")
exports.rsa = _build("rsa")
exports.genrsa = _build("genrsa")
exports.dgst = _build("dgst")
exports.ca = _build("ca")
exports.dgst.verify = _build("dgst", null, self => { self.verified = self.document.toString() === "Verified OK\n" ? true : false }) 

exports.x509.p = _p("x509")
exports.req.p = _p("req")
exports.rsa.p = _p("rsa")
exports.genrsa.p = _p("genrsa")
exports.dgst.p = _p("dgst")
exports.ca.p = _p("ca")

exports.include = include;
exports.passclude = passclude;
exports.outclude = outclude;
