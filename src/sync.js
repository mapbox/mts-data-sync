import sleep from "await-sleep";
import { readConfig, readRecipe } from "./utils";
import {
  initService,
  deleteTilesetSource,
  createTilesetSource,
  validateRecipe,
  createTileset,
  updateRecipe,
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
    } else {
      await updateRecipe(cnf.tilesetId, recipe);
    }
    await sleep(1500);
    await publishTileset(cnf.tilesetId);
    await sleep(1500);
    await checkStatus(cnf.tilesetId);
  } catch (err) {
    console.log(err);
  }
}

export default function sync() {
  const pwd = process.cwd();

  const cnf = readConfig(pwd);
  const recipe = readRecipe(pwd);

  if (cnf && recipe) {
    runServices(cnf, recipe);
  }
}
