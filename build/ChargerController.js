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
var ChargerController_exports = {};
__export(ChargerController_exports, {
  ChargerController: () => ChargerController
});
module.exports = __toCommonJS(ChargerController_exports);
var import_jsmodbus = require("jsmodbus");
var import_net = require("net");
var import_ChargerInfoData = require("./ChargerInfoData");
var import_ChargerConnectorInfoData = require("./ChargerConnectorInfoData");
var import_ChargerConnectorMeasurementData = require("./ChargerConnectorMeasurementData");
var import_RegisterConverterUtil = require("./RegisterConverterUtil");
class ChargerController {
  socket;
  client;
  constructor() {
    this.socket = new import_net.Socket();
    this.client = new import_jsmodbus.ModbusTCPClient(this.socket);
  }
  connect(ipAddress, port, callback) {
    const options = {
      "host": ipAddress,
      "port": port
    };
    this.socket.on("connect", callback);
    this.socket.connect(options);
  }
  async fetchChargerInfoData(callback) {
    this.client.readInputRegisters(990, 31).then(function(resp) {
      const data = new import_ChargerInfoData.ChargerInfoData();
      const registerData = resp.response.body.values;
      data.setSerialNumber(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsString(registerData, 0, 10));
      data.setModel(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsString(registerData, 10, 10));
      data.setHardwareVersion(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsString(registerData, 20, 5));
      data.setSoftwareVersion(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsString(registerData, 25, 5));
      data.setNumberOfConnectors(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsInt16(registerData, 30));
      callback(data);
    }).catch(function(...args) {
      console.error(args);
    });
  }
  async fetchConnectorInfoData(num, callback) {
    this.client.readInputRegisters(1022 + (num - 1) * 100, 8).then(function(resp) {
      const data = new import_ChargerConnectorInfoData.ChargerConnectorInfoData();
      const registerData = resp.response.body.values;
      data.setConnectorType(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsInt16(registerData, 0));
      data.setNumberOfPhases(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsInt16(registerData, 1));
      data.setL1ConnectedToPhase(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsInt16(registerData, 2));
      data.setL2ConnectedToPhase(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsInt16(registerData, 3));
      data.setL3ConnectedToPhase(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsInt16(registerData, 4));
      data.setCustomMaxCurrent(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 6));
      callback(num, data);
    }).catch(function(...args) {
      console.error(args);
    });
  }
  async fetchConnectorMeasurementData(num, callback) {
    this.client.readInputRegisters(0 + (num - 1) * 100, 48).then(function(resp) {
      const data = new import_ChargerConnectorMeasurementData.ChargerConnectorMeasurementData();
      const registerData = resp.response.body.values;
      data.setConnectorStatus(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsInt16(registerData, 0));
      data.setMeasuredVehicleNumberOfPhases(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsInt16(registerData, 1));
      data.setEvMaxPhaseCurrent(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 2));
      data.setTargetCurrentFromPowerMgm(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 4));
      data.setFrequency(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 6));
      data.setVoltageL1(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 8));
      data.setVoltageL2(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 10));
      data.setVoltageL3(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 12));
      data.setCurrentL1(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 14));
      data.setCurrentL2(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 16));
      data.setCurrentL3(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 18));
      data.setActivePowerL1(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 20));
      data.setActivePowerL2(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 22));
      data.setActivePowerL3(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 24));
      data.setActivePowerTotal(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 26));
      data.setPowerFactor(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 28));
      data.setTotalImportedActiveEnergyInRunningSession(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 30));
      data.setRunningSessionDuration(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsInt64(registerData, 32));
      data.setRunningSessionDepartureTime(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsInt64(registerData, 36));
      data.setRunningSessionID(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsInt64(registerData, 40));
      data.setEvMaxPower(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 44));
      data.setEvPlannedEnergy(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 46));
      callback(num, data);
    }).catch(function(...args) {
      console.error(args);
    });
  }
  async commandStopCharging(connectorNum) {
    this.client.writeSingleRegister(1 + (connectorNum - 1) * 100, 0);
  }
  async commandPauseCharging(connectorNum) {
    this.client.writeSingleRegister(2 + (connectorNum - 1) * 100, 0);
  }
  async commandSetDepartureTime(connectorNum, value) {
    const int16Array = import_RegisterConverterUtil.RegisterConverterUtil.int64ToInt16Array(value);
    this.client.writeMultipleRegisters(4 + (connectorNum - 1) * 100, int16Array);
  }
  async commandSetCurrentSetpoint(connectorNum, value) {
    const int16Array = import_RegisterConverterUtil.RegisterConverterUtil.float32ToInt16Array(value);
    this.client.writeMultipleRegisters(8 + (connectorNum - 1) * 100, int16Array);
  }
  async commandCancelCurrentSetpoint(connectorNum) {
    this.client.writeSingleRegister(10 + (connectorNum - 1) * 100, 0);
  }
  async commandSetPowerSetpoint(connectorNum, value) {
    const int16Array = import_RegisterConverterUtil.RegisterConverterUtil.float32ToInt16Array(value);
    console.info(int16Array);
    this.client.writeMultipleRegisters(11 + (connectorNum - 1) * 100, int16Array);
  }
  async commandCancelPowerSetpoint(connectorNum) {
    this.client.writeSingleRegister(13 + (connectorNum - 1) * 100, 0);
  }
  async commandRestart() {
    this.client.writeSingleRegister(1004, 0);
  }
  async commandSetTime(value) {
    const int16Array = import_RegisterConverterUtil.RegisterConverterUtil.int64ToInt16Array(value);
    this.client.writeMultipleRegisters(1e3, int16Array);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChargerController
});
//# sourceMappingURL=ChargerController.js.map
