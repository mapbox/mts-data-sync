import arg from "arg";
import config from "./config";
import sync from "./sync";
import estimate from "./estimate";
import convert from "./convert";
import setToken from "./token";
import fetch from "node-fetch";
import os from "os";

const eol = os.EOL;

async function checkToken() {
  // logs a pluginName for internal solution tracking
  try {
    const token = process.env.MTS_TOKEN;
    const url = "https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/0/0/0.vector.pbf?pluginName=MTSDataSync&access_token=";
    await fetch(url + token).then(res => {
      if (res) {
        return;
      } else {
        console.log("token failed");
      }
    });
  } catch (err) {
    console.log(err);
  }

}

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
    await checkToken();

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
      console.log(`Run mtsds with valid options: ${eol}--config filename.geojsonl, ${eol}--convert filename.geojsonl, ${eol}--sync, ${eol}--token, ${eol}or --estimate`);
    }
  }
}
