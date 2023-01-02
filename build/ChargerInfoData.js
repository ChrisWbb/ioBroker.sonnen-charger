"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var ChargerInfoData_exports = {};
__export(ChargerInfoData_exports, {
  ChargerInfoData: () => ChargerInfoData
});
module.exports = __toCommonJS(ChargerInfoData_exports);
class ChargerInfoData {
  constructor() {
    this.serialNumber = "";
    this.model = "";
    this.hardwareVersion = "";
    this.softwareVersion = "";
    this.numberOfConnectors = -1;
  }
  setSerialNumber(serialNumber) {
    this.serialNumber = serialNumber;
  }
  setModel(model) {
    this.model = model;
  }
  setHardwareVersion(hardwareVersion) {
    this.hardwareVersion = hardwareVersion;
  }
  setSoftwareVersion(softwareVersion) {
    this.softwareVersion = softwareVersion;
  }
  setNumberOfConnectors(numberOfConnectors) {
    this.numberOfConnectors = numberOfConnectors;
  }
  getSerialNumber() {
    return this.serialNumber;
  }
  getModel() {
    return this.model;
  }
  getHardwareVersion() {
    return this.hardwareVersion;
  }
  getSoftwareVersion() {
    return this.softwareVersion;
  }
  getNumberOfConnectors() {
    return this.numberOfConnectors;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChargerInfoData
});
//# sourceMappingURL=ChargerInfoData.js.map
