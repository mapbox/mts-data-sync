import inquirer from "inquirer";
import fs from "fs";
import handleData from "./convert";

async function promptForConfig(options) {
  const questions = [];
  if (options.config) {
    questions.push({
      type: "input",
      name: "tilesetId",
      message: "Please enter an ID for your tileset",
      validate: value => {
        const reg = /^[a-zA-Z0-9-_]+$/g;
        if (!reg.test(value) || value.length > 32) {
          return ("Tileset IDs should only contain up to 32 alphanumeric characters, dashes, or underscore.");
        } else {
          return true;
        }
      }
    });
    questions.push({
      type: "input",
      name: "tilesetName",
      message: "Please enter a name for your tileset",
      validate: value => {
        if (value.length > 64) {
          return ("Tileset names are limited to 64 characters.");
        } else {
          return true;
        }
      }
    });
  }

  const answers = await inquirer.prompt(questions);
  const tilesetSourceId = answers.tilesetId.slice(0, 27) + "-src";
  const filePath = options.config + "l";
  return {
    username: process.env.MTS_USERNAME || "error",
    tilesetSourceId: tilesetSourceId || "error",
    tilesetSourcePath: filePath || "error",
    tilesetId: answers.tilesetId || "error",
    tilesetName: answers.tilesetName || "error"
  };
}

async function writeConfig(config) {
  const confirmation = [{
    type: "confirm",
    name: "confirm",
    message: "Does this configuration look okay?"
  }];
  inquirer.prompt(confirmation).then(userInput => {
    if (userInput.confirm) {
      fs.writeFile("./mts-config.json", JSON.stringify(config, null, "  "), err => {
        if (err) {
          console.log(err);
        } else {
          console.log("Configuration written successfully.");
        }
      });
      const recipe = {
        "version": 1,
        "layers": {
          [config.tilesetId]: {
            "source": `mapbox://tileset-source/${config.username}/${config.tilesetSourceId}`,
            "minzoom": 0,
            "maxzoom": 5
          }
        }
      };
      fs.writeFile("./mts-recipe.json", JSON.stringify(recipe, null, "  "), err => {
        if (err) {
          console.log(err);
        } else {
          console.log("Recipe written successfully.");
        }
      });
    }
  });
}

export default async function config(options) {
  if (!fs.existsSync(options.config)) {
    console.log("Source data not found.");
    return;
  }
  console.log("Preparing source data...");
  const convertData = await handleData(options.config);
  if (convertData) {
    const config = await promptForConfig(options);
    console.log(config);
    await writeConfig(config);
  }
}
