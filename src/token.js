import inquirer from "inquirer";
import path from "path";
import fs from "fs";
import os from "os";

const eol = os.EOL;

async function promptForToken() {
  const questions = [];
  questions.push({
    type: "input",
    name: "username",
    message: "Please enter your Mapbox username"
  });
  questions.push({
    type: "input",
    name: "sk",
    message: "Please enter your secret access token"
  });

  const answers = await inquirer.prompt(questions);

  return {
    username: answers.username || "error",
    token: answers.sk || "error"
  };
}

async function writeEnv(userData) {
  const confirmation = [{
    type: "confirm",
    name: "confirm",
    message: "Does this information look correct?"
  }];
  inquirer.prompt(confirmation).then(userInput => {
    if (userInput.confirm) {
      const env = `MTS_TOKEN=${userData.token}${eol}MTS_USERNAME=${userData.username}`;
      const envDir = path.resolve(__dirname, "..");
      const envFile = path.join(envDir, ".env");

      fs.writeFile(envFile, env, err => {
        if (err) {
          console.log(err);
        } else {
          console.log("Username and token saved successfully.");
        }
      });
    }
  });
}

export default async function setToken() {
  const userData = await promptForToken();
  console.log(userData);
  await writeEnv(userData);
}
