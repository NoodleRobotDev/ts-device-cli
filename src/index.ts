//Uncomment and run npm install -g to use globally
//#! /usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import figlet from "figlet";
import Device from "./types/Device";
import { promisify } from "node:util";

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

const readFile = promisify(fs.readFile);

async function listAllDevices() {
  try {
    const data = await readFile("./data/device-data.json", "utf8");
    const deviceJsonData: any[] = JSON.parse(data);

    const devices: Device[] = deviceJsonData.map((device: any) => ({
      type: device.type,
      family: device.family,
      model: device.model,
    }));

    console.table(devices);
  } catch (error: any) {
    console.error(`Error reading file: ${error.message}`);
  }
}

async function listDevicesByFamily(familyName: string): Promise<void> {
  try {
    const data = await readFile("./data/device-data.json", "utf8");
    const devices: Device[] = JSON.parse(data);

    const filteredDevicesFamily = devices.filter(
      (d) => d.family === familyName,
    );

    if (filteredDevicesFamily.length > 0) {
      console.table(filteredDevicesFamily);
    } else {
      emptyResult();
    }
  } catch (error: any) {
    console.error(`Error reading file: ${error.message}`);
  }
}

async function listDevicesByModel(modelName: string): Promise<void> {
  try {
    const data = await readFile("./data/device-data.json", "utf8");
    const devices: Device[] = JSON.parse(data);

    const filteredDevicesByModel = devices.filter((d) => d.model === modelName);

    if (filteredDevicesByModel.length > 0) {
      console.table(filteredDevicesByModel);
    } else {
      emptyResult();
    }
  } catch (error: any) {
    console.error(`Error reading file: ${error.message}`);
  }
}

async function listDevicesByType(typeName: string): Promise<void> {
  try {
    const data = await readFile("./data/device-data.json", "utf8");
    const devices: Device[] = JSON.parse(data);

    const filteredDevicesByType = devices.filter((d) => d.type === typeName);

    if (filteredDevicesByType.length > 0) {
      console.table(filteredDevicesByType);
    } else {
      emptyResult();
    }
  } catch (error: any) {
    console.error(`Error reading file: ${error.message}`);
  }
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
