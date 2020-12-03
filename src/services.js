import open from "open";
import mts from "@mapbox/mapbox-sdk/services/tilesets";

let accessToken = null;
let mtsService = null;

const initService = async function () {
  try {
    accessToken = process.env.MTS_TOKEN;
    mtsService = mts({ accessToken });
  } catch (error) {
    console.log(error);
  }
};

// kick off the sync process by deleting the tileset source
const deleteTilesetSource = async function (tilesetSourceId) {
  try {
    const response = await mtsService.deleteTilesetSource({ id: tilesetSourceId }).send();
    if (response.statusCode === 204) {
      console.log(`Preparing tileset source data: ${tilesetSourceId}`);
      return response;
    }
  } catch (error) {
    console.log(error);
  }
};

// create a tileset source aka upload your data
const createTilesetSource = async function (tilesetSourceId, tilesetSourcePath) {
  // TODO validate the source data first
  // TODO handle multiple files for upload
  console.log("Uploading the source data...");
  try {
    const response = await mtsService.createTilesetSource({ id: tilesetSourceId, file: tilesetSourcePath }).send();
    console.log(`Tileset source created: ${response.body.id}. Files ${response.body.files}, Size: ${response.body.file_size} bytes`);
    console.log(response.body);
    return response;
  } catch (error) {
    console.log(error);
  }
};

// validate the recipe
const validateRecipe = async function (recipe) {
  try {
    const response = await mtsService.validateRecipe({ recipe: recipe }).send();
    if (response.body.valid) {
      console.log("Recipe validated");
      return response;
    } else {
      throw response;
    }
  } catch (error) {
    console.log(error);
  }
};

const tilesetExists = async function (tilesetId) {
  try {
    const response = await mtsService.listTilesets().send();
    const exists = response.body.filter(tileset => tileset.id === `${process.env.MTS_USERNAME}.${tilesetId}`);
    if (exists.length > 0) {
      console.log("Tileset already exists");
      console.log(exists);
      return response;
    }
    return false;
  } catch (error) {
    console.log(error);
  }
};

// has the tileset been created? if not, create the tileset using the tileset source
const createTileset = async function (tilesetId, tilesetName, recipe) {
  try {
    const response = await mtsService.createTileset({
      tilesetId: `${process.env.MTS_USERNAME}.${tilesetId}`,
      recipe: recipe,
      name: tilesetName
    }).send();
    console.log(`Tileset ${process.env.MTS_USERNAME}.${tilesetId} created`);
    console.log(response.body);
    return response;
  } catch (error) {
    console.log(error);
  }
};

// if the tileset exists, make sure it has the latest recipe
const updateRecipe = async function (tilesetId, recipe) {
  try {
    const response = await mtsService.updateRecipe({
      tilesetId: `${process.env.MTS_USERNAME}.${tilesetId}`,
      recipe: recipe
    }).send();
    console.log(response.body);
    return response;
  } catch (error) {
    console.log(error);
  }
};

// publish the tileset
const publishTileset = async function (tilesetId) {
  try {
    const publishRequest = mtsService.publishTileset({
      tilesetId: `${process.env.MTS_USERNAME}.${tilesetId}`
    });
    publishRequest.query = { pluginName: "MTSDataSync" };
    const response = await publishRequest.send();
    console.log(response.body);
    return response;
  } catch (error) {
    console.log(error);
  }
};

// log the job id and status message
const tilesetStatus = function (tilesetId) {
  // eslint-disable-next-line no-use-before-define
  setTimeout(checkStatus, 10000, tilesetId);
};

// Check job status and report warnings
const jobStatus = async function (tilesetId, jobId) {
  console.log("Checking completed job status...");
  try {
    const response = await mtsService.tilesetJob({ tilesetId: `${process.env.MTS_USERNAME}.${tilesetId}`, jobId }).send();
    return response.body;
  } catch (error) {
    console.log(error);
    return;
  }
};

// request the status every 10s, logging the status to the console until it's 'success'
// provide some kind of preview / visual inspector
const checkStatus = async function (tilesetId) {
  try {
    const response = await mtsService.tilesetStatus({
      tilesetId: `${process.env.MTS_USERNAME}.${tilesetId}`
    }).send();
    if (response.body.status === "processing" || response.body.status === "queued") {
      console.log(`Status: ${response.body.status} ${response.body.id}`);
      console.log(response.body);
      tilesetStatus(tilesetId);
    } else if (response.body.status === "success") {
      console.log(await jobStatus(tilesetId, response.body.latest_job));
      console.log(`Complete: opening https://studio.mapbox.com/tilesets/${response.body.id}/`);
      open(`https://studio.mapbox.com/tilesets/${response.body.id}/`, { url: true });
    } else {
      console.log("Error creating tileset", response.body);
      console.log(await jobStatus(tilesetId, response.body.latest_job));
    }
  } catch (error) {
    console.log(error);
  }
};

export {
  initService,
  deleteTilesetSource,
  createTilesetSource,
  validateRecipe,
  tilesetExists,
  createTileset,
  updateRecipe,
  publishTileset,
  tilesetStatus,
  checkStatus
};
