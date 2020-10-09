import fs from "fs";
import geojsonStream from "geojson-stream";

async function convertData(geojson) {
  try {
    const ldgeojson = fs.createWriteStream(geojson + "l");
    console.log("Converting GeoJSON file...");
    return new Promise((resolve, reject) => {
      fs.createReadStream(geojson)
        .pipe(geojsonStream.parse(row => {
          if (row.geometry.coordinates === null) {
            return null;
          }
          return (JSON.stringify(row) + "\r\n");
        }))
        .pipe(ldgeojson)
        .on("finish", () => {
          console.log("Finished writing file...");
          resolve(true);
        })
        .on("error", reject);
    });
  } catch (err) {
    console.log(err);
  }
}

export default async function convert(geojson) {
  const converted = await convertData(geojson);
  if (converted) {
    console.log("Line-delimited GeoJSON ready for upload.");
    return true;
  }
}
