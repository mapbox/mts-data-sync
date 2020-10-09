// import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import sleep from "await-sleep";
import {
  initService,
  deleteTilesetSource,
  createTilesetSource,
  validateRecipe,
  createTileset,
  publishTileset,
  checkStatus,
  tilesetExists
} from "./services";

async function runServices(cnf, recipe) {

  try {
    await initService();
    await sleep(1500);
    await deleteTilesetSource(cnf.tilesetSourceId);
    await sleep(1500);
    await createTilesetSource(cnf.tilesetSourceId, cnf.tilesetSourcePath);
    await sleep(1500);
    await validateRecipe(recipe);
    const tilesetAlreadyExists = await tilesetExists(cnf.tilesetId);
    // await sleep(1500);
    if (!tilesetAlreadyExists) {
      await createTileset(cnf.tilesetId, cnf.tilesetName, recipe);
      await sleep(1500);
    }
    await publishTileset(cnf.tilesetId);
    await sleep(1500);
    await checkStatus(cnf.tilesetId);
  } catch (err) {
    console.log(err);
  }
}

export default function sync() {
  const pwd = process.cwd();
  let cnf, recipe;
  try {
    cnf = JSON.parse(fs.readFileSync(path.join(pwd, "mts-config.json")));
  } catch (err) {
    console.log("Missing mts-config.json in this directory.");
    console.log("Run mtsds --config to generate.");
  }
  try {
    recipe = JSON.parse(fs.readFileSync(path.join(pwd, "mts-recipe.json")));
  } catch (err) {
    console.log("Missing mts-recipe.json in this directory.");
    console.log("Run mtsds --config to generate.");
  }

  if (cnf && recipe) {
    runServices(cnf, recipe);
  }
}
