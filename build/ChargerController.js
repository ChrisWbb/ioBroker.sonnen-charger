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
  constructor() {
    this.socket = new import_net.Socket();
    this.client = new import_jsmodbus.ModbusTCPClient(this.socket);
  }
  async testConnect() {
    try {
      console.info(" ");
      let infoData = await this.fetchChargerInfoData();
      console.info("SerialNumber: " + infoData.getSerialNumber());
      console.info("Model: " + infoData.getModel());
      console.info("HardwareVersion: " + infoData.getHardwareVersion());
      console.info("SoftwareVersion: " + infoData.getSoftwareVersion());
      console.info("NumberOfConnectors: " + infoData.getNumberOfConnectors());
      console.info(" ");
      let connectorInfoData = await this.fetchConnectorInfoData(1);
      console.info("ConnectorType: " + connectorInfoData.getConnectorTypeAsString());
      console.info("NumberOfPhases: " + connectorInfoData.getNumberOfPhases());
      console.info("L1ConnectedToPhase: " + connectorInfoData.getL1ConnectedToPhase());
      console.info("L2ConnectedToPhase: " + connectorInfoData.getL2ConnectedToPhase());
      console.info("L3ConnectedToPhase: " + connectorInfoData.getL3ConnectedToPhase());
      console.info("CustomMaxCurrent: " + connectorInfoData.getCustomMaxCurrent() + " A");
      console.info(" ");
      let connectorMeasementData = await this.fetchConnectorMeasurementData(1);
      console.info("ConnectorStatus: " + connectorMeasementData.getConnectorStatusAsString());
      console.info("MeasuredVehicleNumberOfPhases: " + connectorMeasementData.getMeasuredVehicleNumberOfPhasesAsString());
      console.info("EvMaxPhaseCurrent: " + connectorMeasementData.getEvMaxPhaseCurrent() + " A");
      console.info("TargetCurrentFromPowerMgm: " + connectorMeasementData.getTargetCurrentFromPowerMgm() + " A");
      console.info("Frequency: " + connectorMeasementData.getFrequency() + " Hz");
      console.info("VoltageL1: " + connectorMeasementData.getVoltageL1() + " V");
      console.info("VoltageL2: " + connectorMeasementData.getVoltageL2() + " V");
      console.info("VoltageL3: " + connectorMeasementData.getVoltageL3() + " V");
      console.info("CurrentL1: " + connectorMeasementData.getCurrentL1() + " A");
      console.info("CurrentL2: " + connectorMeasementData.getCurrentL2() + " A");
      console.info("CurrentL3: " + connectorMeasementData.getCurrentL3() + " A");
      console.info("ActivePowerL1: " + connectorMeasementData.getActivePowerL1() + " kWh");
      console.info("ActivePowerL2: " + connectorMeasementData.getActivePowerL2() + " kWh");
      console.info("ActivePowerL3: " + connectorMeasementData.getActivePowerL3() + " kWh");
      console.info("ActivePowerTotal: " + connectorMeasementData.getActivePowerTotal() + " kWh");
      console.info("PowerFactor: " + connectorMeasementData.getPowerFactor());
      console.info("TotalImportedActiveEnergyInRunningSession: " + connectorMeasementData.getTotalImportedActiveEnergyInRunningSession() + " kWh");
      console.info("RunningSessionDuration: " + connectorMeasementData.getRunningSessionDuration() + " seconds");
      console.info("RunningSessionDepartureTime: " + connectorMeasementData.getRunningSessionDepartureTime() + " seconds");
      console.info("RunningSessionID: " + connectorMeasementData.getRunningSessionID());
      console.info("EvMaxPower: " + connectorMeasementData.getEvMaxPower() + " kW");
      console.info("EvPlannedEnergy: " + connectorMeasementData.getEvPlannedEnergy() + " kW");
    } catch (e) {
      console.log("Error:", e);
    }
  }
  connect(ipAddress, port) {
    let options = {
      "host": ipAddress,
      "port": port
    };
    this.socket.on("connect", this.testConnect.bind(this));
    this.socket.connect(options);
  }
  on(event, listener) {
  }
  async fetchInputRegister(start, count) {
    let result = new Array();
    let modbusResponse = await this.client.readInputRegisters(start, count).then(function(resp) {
      for (let i = 0; i < resp.response.body.values.length; i++) {
        result[i] = resp.response.body.values[i];
      }
    }).catch(function() {
      console.error(arguments);
    });
    return result;
  }
  async fetchChargerInfoData() {
    let registerData = await this.fetchInputRegister(990, 31);
    let data = new import_ChargerInfoData.ChargerInfoData();
    data.setSerialNumber(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsString(registerData, 0, 10));
    data.setModel(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsString(registerData, 10, 10));
    data.setHardwareVersion(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsString(registerData, 20, 5));
    data.setSoftwareVersion(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsString(registerData, 25, 5));
    data.setNumberOfConnectors(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsInt16(registerData, 30));
    return data;
  }
  async fetchConnectorInfoData(num) {
    let registerData = await this.fetchInputRegister(1022 + (num - 1) * 100, 8);
    let data = new import_ChargerConnectorInfoData.ChargerConnectorInfoData();
    data.setConnectorType(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsInt16(registerData, 0));
    data.setNumberOfPhases(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsInt16(registerData, 1));
    data.setL1ConnectedToPhase(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsInt16(registerData, 2));
    data.setL2ConnectedToPhase(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsInt16(registerData, 3));
    data.setL3ConnectedToPhase(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsInt16(registerData, 4));
    data.setCustomMaxCurrent(import_RegisterConverterUtil.RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 6));
    return data;
  }
  async fetchConnectorMeasurementData(num) {
    let registerData = await this.fetchInputRegister(0 + (num - 1) * 100, 48);
    let data = new import_ChargerConnectorMeasurementData.ChargerConnectorMeasurementData();
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
    return data;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChargerController
});
//# sourceMappingURL=ChargerController.js.map
