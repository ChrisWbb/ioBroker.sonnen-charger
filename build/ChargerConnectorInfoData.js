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
var ChargerConnectorInfoData_exports = {};
__export(ChargerConnectorInfoData_exports, {
  ChargerConnectorInfoData: () => ChargerConnectorInfoData
});
module.exports = __toCommonJS(ChargerConnectorInfoData_exports);
class ChargerConnectorInfoData {
  connectorType = -1;
  numberOfPhases = -1;
  l1ConnectedToPhase = -1;
  l2ConnectedToPhase = -1;
  l3ConnectedToPhase = -1;
  customMaxCurrent = -1;
  decodeConnectorType(value) {
    switch (value) {
      case 1:
        return "SocketType2";
      case 2:
        return "PlugType2";
    }
    return "";
  }
  /* setter */
  setConnectorType(connectorType) {
    this.connectorType = connectorType;
  }
  setNumberOfPhases(numberOfPhases) {
    this.numberOfPhases = numberOfPhases;
  }
  setL1ConnectedToPhase(l1ConnectedToPhase) {
    this.l1ConnectedToPhase = l1ConnectedToPhase;
  }
  setL2ConnectedToPhase(l2ConnectedToPhase) {
    this.l2ConnectedToPhase = l2ConnectedToPhase;
  }
  setL3ConnectedToPhase(l3ConnectedToPhase) {
    this.l3ConnectedToPhase = l3ConnectedToPhase;
  }
  setCustomMaxCurrent(customMaxCurrent) {
    this.customMaxCurrent = customMaxCurrent;
  }
  /* getter */
  getConnectorType() {
    return this.connectorType;
  }
  getNumberOfPhases() {
    return this.numberOfPhases;
  }
  getL1ConnectedToPhase() {
    return this.l1ConnectedToPhase;
  }
  getL2ConnectedToPhase() {
    return this.l2ConnectedToPhase;
  }
  getL3ConnectedToPhase() {
    return this.l3ConnectedToPhase;
  }
  getCustomMaxCurrent() {
    return this.customMaxCurrent;
  }
  getConnectorTypeAsString() {
    return this.decodeConnectorType(this.connectorType);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChargerConnectorInfoData
});
//# sourceMappingURL=ChargerConnectorInfoData.js.map
