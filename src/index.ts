//Uncomment and run npm install -g to use globally
//#! /usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import path from "path";
import figlet from "figlet";

const program = new Command();

console.log(figlet.textSync("Device CLI Tool"));

program
  .version("1.0.0")
  .description("CLI tool for listing and searching devices")
  .option("-l, --list-all-devices", "List all devices")
  .option("-f, --list-family <value>", "List devices matching a family name")
  .option("-m, --list-model <value>", "List devices matching a model name")
  .option("-t, --list-type <value>", "List devices matching a type")
  .parse(process.argv);

const options = program.opts();

function listAllDevices() {
  fs.readFile("./data/device-data.json", "utf8", (err, data) => {
    try {
      const deviceJsonData = JSON.parse(data);
      console.table(deviceJsonData);
    } catch (error: any) {
      console.error(`Error reading file: ${error.message}`);
    }
  });
}

function listDevicesByFamily(familyName: string) {
  fs.readFile("./data/device-data.json", "utf8", (err, data) => {
    try {
      const filteredDevicesFamily = JSON.parse(data).filter(
        (d: any) => d.family === familyName,
      );
      if (filteredDevicesFamily.length > 0) {
        console.table(filteredDevicesFamily);
      } else {
        emptyResult();
      }
    } catch (error: any) {
      console.error(`Error reading file: ${error.message}`);
    }
  });
}

function listDevicesByModel(modelName: string) {
  fs.readFile("./data/device-data.json", "utf8", (err, data) => {
    try {
      const filteredDevicesByModel = JSON.parse(data).filter(
        (d: any) => d.model === modelName,
      );
      if (filteredDevicesByModel.length > 0) {
        console.table(filteredDevicesByModel);
      } else {
        emptyResult();
      }
    } catch (error: any) {
      console.error(`Error reading file: ${error.message}`);
    }
  });
}

function listDevicesByType(typeName: string) {
  fs.readFile("./data/device-data.json", "utf8", (err, data) => {
    try {
      const filteredDevicesByType = JSON.parse(data).filter(
        (d: any) => d.type === typeName,
      );
      if (filteredDevicesByType.length > 0) {
        console.table(filteredDevicesByType);
      } else {
        emptyResult();
      }
    } catch (error: any) {
      console.error(`Error reading file: ${error.message}`);
    }
  });
}

function emptyResult() {
  console.warn("No devices found");
}

if (options.listAllDevices) {
  listAllDevices();
}

if (options.listFamily) {
  const familyName: string = options.listFamily;
  listDevicesByFamily(familyName);
}

if (options.listModel) {
  const modelName: string = options.listModel;
  listDevicesByModel(modelName);
}

if (options.listType) {
  const typeName: string = options.listType;
  listDevicesByType(typeName);
}

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
