import fs from "fs";
import path from "path";

const checkFileExistsSync = function(filepath){
  let flag = true;
  try {
    fs.accessSync(filepath, fs.constants.F_OK);
  } catch (e){
    flag = false;
  }
  return flag;
};

const readConfig = function (pwd) {
  const cnfFile = path.join(pwd, "mts-config.json");
  if (checkFileExistsSync(cnfFile)) {
    try {
      const cnf = JSON.parse(fs.readFileSync(cnfFile));
      return cnf;
    } catch (err) {
      console.log("Invalid mts-config.json: parsing failed.");
      console.log("Verify that mts-config.json is valid JSON.");
    }
  } else {
    console.log("Missing mts-config.json in this directory.");
    console.log("Run mtsds --config to generate.");
  }
};

const readRecipe = function (pwd) {
  const recipeFile = path.join(pwd, "mts-recipe.json");
  if (checkFileExistsSync(recipeFile)) {
    try {
      const recipe = JSON.parse(fs.readFileSync(recipeFile));
      return recipe;
    } catch (err) {
      console.log("Invalid mts-recipe.json: parsing failed.");
      console.log("Verify that mts-recipe.json is valid JSON.");
    }
  } else {
    console.log("Missing mts-recipe.json in this directory.");
    console.log("Run mtsds --config to generate.");
  }
};

export {
  readConfig,
  readRecipe
};
