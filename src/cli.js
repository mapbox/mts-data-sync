import arg from "arg";
import config from "./config";
import sync from "./sync";
import estimate from "./estimate";
import convert from "./convert";
import setToken from "./token";
import os from "os";

const eol = os.EOL;

function argsToOptions(rawArgs) {
  const args = arg(
    {
      "--config": String,
      "--sync": Boolean,
      "--estimate": Boolean,
      "--convert": String,
      "--token": Boolean,
      "-c": "--config",
      "-s": "--sync",
      "-e": "--estimate"
    },
    {
      argv: rawArgs.slice(2),
      permissive: true
    }
  );
  return {
    config: args["--config"] || false,
    sync: args["--sync"] || false,
    estimate: args["--estimate"] || false,
    convert: args["--convert"] || false,
    token: args["--token"] || false
  };
}

export async function cli(args) {
  if (!process.env.MTS_TOKEN || !process.env.MTS_USERNAME) {
    console.log("No access token or username in .env. Running token installation script.");
    setToken();
  } else {

    let options = {};
    try {
      options = argsToOptions(args);
    } catch (err) {
      console.log(err.message);
    }

    if (options.config) {
      config(options);
    } else if (options.sync) {
      sync(options);
    } else if (options.estimate) {
      estimate();
    } else if (options.convert) {
      convert(options.convert);
    } else if (options.token) {
      setToken();
    } else {
      console.log(`Run mtsds with valid options: ${eol}--config filename.geojson, ${eol}--convert filename.geojson, ${eol}--sync, ${eol}--token, ${eol}or --estimate`);
    }
  }
}
