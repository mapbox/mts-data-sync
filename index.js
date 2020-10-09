#!/usr/bin/env node

require("dotenv").config({ path: __dirname + "/.env" });
// eslint-disable-next-line no-global-assign
require = require("esm")(module);
require("./src/cli").cli(process.argv);
