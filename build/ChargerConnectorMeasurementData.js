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
var ChargerConnectorMeasurementData_exports = {};
__export(ChargerConnectorMeasurementData_exports, {
  ChargerConnectorMeasurementData: () => ChargerConnectorMeasurementData
});
module.exports = __toCommonJS(ChargerConnectorMeasurementData_exports);
class ChargerConnectorMeasurementData {
  connectorStatus = -1;
  measuredVehicleNumberOfPhases = -1;
  evMaxPhaseCurrent = -1;
  targetCurrentFromPowerMgm = -1;
  frequency = -1;
  voltageL1 = -1;
  voltageL2 = -1;
  voltageL3 = -1;
  currentL1 = -1;
  currentL2 = -1;
  currentL3 = -1;
  activePowerL1 = -1;
  activePowerL2 = -1;
  activePowerL3 = -1;
  activePowerTotal = -1;
  powerFactor = -1;
  totalImportedActiveEnergyInRunningSession = -1;
  runningSessionDuration = -1;
  runningSessionDepartureTime = -1;
  runningSessionID = -1;
  evMaxPower = -1;
  evPlannedEnergy = -1;
  decodeConnectorStatus(value) {
    switch (value) {
      case 0:
        return "Unknown";
      case 1:
        return "SocketAvailable";
      case 2:
        return "WaitingForVehicleToBeConnected";
      case 3:
        return "WaitingForVehicleToStart";
      case 4:
        return "Charging";
      case 5:
        return "ChargingPausedByEv";
      case 6:
        return "ChargingPausedByEvse";
      case 7:
        return "ChargingEnded";
      case 8:
        return "ChargingFault";
      case 9:
        return "UnpausingCharging";
      case 10:
        return "Unavailable";
    }
    return "";
  }
  decodeVehicleNumberOfPhases(value) {
    switch (value) {
      case 0:
        return "Three phases";
      case 1:
        return "Single phase (L1)";
      case 2:
        return "Single phase (L2)";
      case 3:
        return "Single phase (L3)";
      case 4:
        return "Unknown";
      case 5:
        return "Two phases";
    }
    return "";
  }
  /* setter */
  setConnectorStatus(connectorStatus) {
    this.connectorStatus = connectorStatus;
  }
  setMeasuredVehicleNumberOfPhases(measuredVehicleNumberOfPhases) {
    this.measuredVehicleNumberOfPhases = measuredVehicleNumberOfPhases;
  }
  setEvMaxPhaseCurrent(evMaxPhaseCurrent) {
    this.evMaxPhaseCurrent = evMaxPhaseCurrent;
  }
  setTargetCurrentFromPowerMgm(targetCurrentFromPowerMgm) {
    this.targetCurrentFromPowerMgm = targetCurrentFromPowerMgm;
  }
  setFrequency(frequency) {
    this.frequency = frequency;
  }
  setVoltageL1(voltageL1) {
    this.voltageL1 = voltageL1;
  }
  setVoltageL2(voltageL2) {
    this.voltageL2 = voltageL2;
  }
  setVoltageL3(voltageL3) {
    this.voltageL3 = voltageL3;
  }
  setCurrentL1(currentL1) {
    this.currentL1 = currentL1;
  }
  setCurrentL2(currentL2) {
    this.currentL2 = currentL2;
  }
  setCurrentL3(currentL3) {
    this.currentL3 = currentL3;
  }
  setActivePowerL1(activePowerL1) {
    this.activePowerL1 = activePowerL1;
  }
  setActivePowerL2(activePowerL2) {
    this.activePowerL2 = activePowerL2;
  }
  setActivePowerL3(activePowerL3) {
    this.activePowerL3 = activePowerL3;
  }
  setActivePowerTotal(activePowerTotal) {
    this.activePowerTotal = activePowerTotal;
  }
  setPowerFactor(powerFactor) {
    this.powerFactor = powerFactor;
  }
  setTotalImportedActiveEnergyInRunningSession(totalImportedActiveEnergyInRunningSession) {
    this.totalImportedActiveEnergyInRunningSession = totalImportedActiveEnergyInRunningSession;
  }
  setRunningSessionDuration(runningSessionDuration) {
    this.runningSessionDuration = runningSessionDuration;
  }
  setRunningSessionDepartureTime(runningSessionDepartureTime) {
    this.runningSessionDepartureTime = runningSessionDepartureTime;
  }
  setRunningSessionID(runningSessionID) {
    this.runningSessionID = runningSessionID;
  }
  setEvMaxPower(evMaxPower) {
    this.evMaxPower = evMaxPower;
  }
  setEvPlannedEnergy(evPlannedEnergy) {
    this.evPlannedEnergy = evPlannedEnergy;
  }
  /* getter */
  getConnectorStatus() {
    return this.connectorStatus;
  }
  getMeasuredVehicleNumberOfPhases() {
    return this.measuredVehicleNumberOfPhases;
  }
  getEvMaxPhaseCurrent() {
    return this.evMaxPhaseCurrent;
  }
  getTargetCurrentFromPowerMgm() {
    return this.targetCurrentFromPowerMgm;
  }
  getFrequency() {
    return this.frequency;
  }
  getVoltageL1() {
    return this.voltageL1;
  }
  getVoltageL2() {
    return this.voltageL2;
  }
  getVoltageL3() {
    return this.voltageL3;
  }
  getCurrentL1() {
    return this.currentL1;
  }
  getCurrentL2() {
    return this.currentL2;
  }
  getCurrentL3() {
    return this.currentL3;
  }
  getActivePowerL1() {
    return this.activePowerL1;
  }
  getActivePowerL2() {
    return this.activePowerL2;
  }
  getActivePowerL3() {
    return this.activePowerL3;
  }
  getActivePowerTotal() {
    return this.activePowerTotal;
  }
  getPowerFactor() {
    return this.powerFactor;
  }
  getTotalImportedActiveEnergyInRunningSession() {
    return this.totalImportedActiveEnergyInRunningSession;
  }
  getRunningSessionDuration() {
    return this.runningSessionDuration;
  }
  getRunningSessionDepartureTime() {
    return this.runningSessionDepartureTime;
  }
  getRunningSessionID() {
    return this.runningSessionID;
  }
  getEvMaxPower() {
    return this.evMaxPower;
  }
  getEvPlannedEnergy() {
    return this.evPlannedEnergy;
  }
  getConnectorStatusAsString() {
    return this.decodeConnectorStatus(this.connectorStatus);
  }
  getMeasuredVehicleNumberOfPhasesAsString() {
    return this.decodeVehicleNumberOfPhases(this.measuredVehicleNumberOfPhases);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChargerConnectorMeasurementData
});
//# sourceMappingURL=ChargerConnectorMeasurementData.js.map
