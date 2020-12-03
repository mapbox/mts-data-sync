import fs from "fs";
import { readConfig, readRecipe } from "./utils";
import ndjson from "ndjson";
import tarea from "@turf/area";
import tilebelt from "@mapbox/tilebelt";
import cover from "@mapbox/tile-cover";
import skuInvoice from "./pricebook";
import os from "os";

const eol = os.EOL;

const calculateTileArea = function (quadkeys) {
  console.log(`Calculating tile area${eol}`);
  let area = 0;
  quadkeys.forEach(quadkey => {
    const tile = tilebelt.quadkeyToTile(quadkey);
    const tileGeo = tilebelt.tileToGeoJSON(tile);
    area += tarea(tileGeo) / 1000000;
  });
  return area.toFixed(0);
};

const getBillingMaxZoom = function (zoom) {
  switch (true) {
    case zoom < 6:
      return { maxZoom: 5, sku: "lowzoom_free" };
    case zoom < 11:
      return { maxZoom: 6, sku: "processing10m" };
    case zoom < 14:
      return { maxZoom: 11, sku: "processing1m" };
    case zoom < 17:
      return { maxZoom: 14, sku: "processing30cm" };
    default:
      return { maxZoom: 17, sku: "processing1cm" };
  }
};

const sizeJob = function (pwd, cnf, recipe) {
  const billingMaxZoom = getBillingMaxZoom(
    recipe.layers[cnf.tilesetId].maxzoom
  );

  const maxZoom = billingMaxZoom.maxZoom;
  const sku = billingMaxZoom.sku;

  // TODO loop through all layers to get the max maxzoom
  const limits = {
    min_zoom: recipe.layers[cnf.tilesetId].minzoom,
    max_zoom: maxZoom
  };

  const allQuads = [];

  console.log(`Estimating job size... this could take a while depending on your max zoom`);

  fs.createReadStream(cnf.tilesetSourcePath)
    .pipe(ndjson.parse())
    .on("data", geo => {
      const tiles = cover.indexes(geo.geometry, limits);
      tiles.forEach(tile => {
        if (!allQuads.includes(tile)) {
          allQuads.push(tile);
        }
      });
    })
    .on("end", () => {
      console.log(
        `Estimated number of tiles at billing zoom ${limits.max_zoom}: ${allQuads.length.toLocaleString()}${eol}`
      );
      const area = calculateTileArea(allQuads);

      if (sku === "lowzoom_free") {
        console.log(`This data is processed for free.${eol}`);
      } else {
        const priceEstimate = skuInvoice(sku, area);
        console.log(`Tiling ${priceEstimate.formattedTotalSubunits} in the ${priceEstimate.skuName} tier${eol}`);
        console.log(`Estimated total cost is: ${priceEstimate.previewFormattedTotalCharge}${eol}`);
        console.log(`This estimate does not take into account any prior MTS usage or discount tier.`);
        console.log(`To get a more accurate pricing estimate, add this area to your past usage this billing cycle.`);
        console.log(`Total area processed this month is visible at https://account.mapbox.com/statistics.`);
        console.log(`Input this total value into the MTS pricing calculator (https://www.mapbox.com/pricing/#tilesets)${eol}for a complete price estimate.`);
      }
    });
};

export default function estimate() {
  const pwd = process.cwd();

  const cnf = readConfig(pwd);
  const recipe = readRecipe(pwd);

  if (cnf && recipe) {
    sizeJob(pwd, cnf, recipe);
  }
}
