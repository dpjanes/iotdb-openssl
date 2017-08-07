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

const bluebird = require("bluebird")
const Q = require("bluebird-q")
const openssl = require("openssl-wrapper").exec
const tmp = require('tmp');


const fs = require("fs")
const assert = require("assert")

/**
 *  This will look up data in self and write
 *  it to a file. The filename is returned
 */
const include = keypath => self => {
    const buffer = _.d.first(self, keypath)
    assert.ok(_.is.Buffer(buffer))

    const t = tmp.fileSync();

    fs.writeFileSync(t.name, buffer)

    return t.name;
}

/**
 */
const _build = (name, command, post) => {
    command = command || name;
    post = post || (s => s);

    return Q.denodeify(
        (_self, done) => {
            const self = _.d.clone.shallow(_self)
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

                done(null, self)
            })
        }
    )
}

/**
 *  API
 */
exports.x509 = _build("x509")
exports.dgst = _build("dgst")
exports.dgst.verify = _build("dgst", null, self => { self.verified = self.document.toString() === "Verified OK\n" ? true : false }) 
exports.include = include;
