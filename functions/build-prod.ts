/* eslint-disable require-jsdoc */
import { execSync } from "child_process";
import { existsSync } from "fs";
import * as path from "path";

function runCommand(command: string, errorMessage: string) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(errorMessage, error);
    process.exit(1);
  }
}

function main() {
  console.log("Setting environment to production...");
  process.env.NODE_ENV = "production";

  // Define paths
  const xlfcNewCodebasePath = path.resolve(__dirname, "../xlfc-newcodebase");
  const functionsPath = path.resolve(__dirname, "../functions");

  // Build xlfc-newcodebase project
  if (existsSync(xlfcNewCodebasePath)) {
    console.log("Building xlfc-newcodebase project...");
    runCommand(
      `cd ${xlfcNewCodebasePath} && npm run build`,
      "xlfc-newcodebase build failed."
    );
    console.log("xlfc-newcodebase build completed.");
  } else {
    console.error("xlfc-newcodebase directory not found.");
    process.exit(1);
  }

  // Build Firebase functions
  if (existsSync(functionsPath)) {
    console.log("Building Firebase functions...");
    runCommand(
      `cd ${functionsPath} && npm run build`,
      "Firebase functions build failed."
    );
    console.log("Firebase functions build completed.");
  } else {
    console.error("functions directory not found.");
    process.exit(1);
  }

  // Deploy to production
  console.log("Deploying to production...");
  runCommand("firebase deploy --only functions", "Firebase deployment failed.");
  console.log("Firebase deployment completed successfully!");
}

main();
