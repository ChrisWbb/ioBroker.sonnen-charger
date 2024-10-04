"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var utils = __toESM(require("@iobroker/adapter-core"));
var import_ChargerController = require("./ChargerController");
var chargingMode = /* @__PURE__ */ ((chargingMode2) => {
  chargingMode2["MAX_POWER"] = "MAX";
  chargingMode2["PV_ONLY"] = "PV";
  chargingMode2["PV_ONLY_OPT"] = "PV +";
  chargingMode2["PV_BATT"] = "PV & Batterie";
  chargingMode2["PV_BATT_LIMIT"] = " PV & Batterie Limit";
  return chargingMode2;
})(chargingMode || {});
;
class SonnenCharger extends utils.Adapter {
  chargerController;
  updateInterval;
  updateTimeout;
  infoData;
  constructor(options = {}) {
    super({
      ...options,
      name: "sonnen-charger"
    });
    this.chargerController = new import_ChargerController.ChargerController();
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  /**
   * Is called when databases are connected and adapter received configuration.
   */
  async onReady() {
    this.setState("info.connection", true, true);
    if (!this.config.serverIp) {
      this.log.error("Server IP is empty - please check instance configuration");
      return;
    }
    if (!this.config.serverPort) {
      this.log.error("Server port is empty - please check instance configuration");
      return;
    }
    if (!this.config.interval) {
      this.log.error("interval is empty - please check instance configuration");
      return;
    }
    this.log.info("config serverIp: " + this.config.serverIp);
    this.log.info("config serverPort: " + this.config.serverPort);
    this.log.info("config interval: " + this.config.interval);
    this.log.info("config allowWriteAccess: " + this.config.allowWriteAccess);
    this.log.info("config activateChargerControl: " + this.config.activateChargerControl);
    if (this.config.activateChargerControl) {
      if (!this.config.id_production) {
        this.log.error("smart mode is activated and id_production is empty - please check instance configuration");
        return;
      }
      if (!this.config.id_total_consumption) {
        this.log.error("smart mode is activated and id_total_consumption is empty - please check instance configuration");
        return;
      }
      if (!this.config.id_battery_soc) {
        this.log.error("smart mode is activated and id_battery_soc is empty - please check instance configuration");
        return;
      }
      if (!this.config.id_battery_em_soc) {
        this.log.error("smart mode is activated and id_battery_em_soc is empty - please check instance configuration");
        return;
      }
      this.log.info("config id_production: " + this.config.id_production);
      this.log.info("config id_total_consumption: " + this.config.id_total_consumption);
      this.log.info("config id_battery_soc: " + this.config.id_battery_soc);
      this.log.info("config id_battery_em_soc: " + this.config.id_battery_em_soc);
    }
    this.chargerController.connect(this.config.serverIp, this.config.serverPort, this.actionsAfterConnect.bind(this));
  }
  onStateChange(id, state) {
    if (!id || !state || state.ack) {
      return;
    }
    if (state.val != null && state.val != false) {
      const myRegexp = new RegExp("sonnen-charger\\.(\\d)\\.commands(\\.connectors\\.(\\d))?\\.(.*)");
      const match = myRegexp.exec(id);
      if (match != null) {
        const command = match[4];
        const connectorNum = parseInt(match[3]);
        if (!connectorNum) {
          this.log.info("Received command: <" + command + "> with value <" + state.val + ">");
          switch (command) {
            case "restart": {
              this.log.debug("restart");
              this.chargerController.commandRestart();
              this.setState(id, false, true);
              break;
            }
            case "setTime": {
              this.log.debug("setTime");
              if (typeof state.val === "number") {
                this.chargerController.commandSetTime(state.val);
              }
              this.setState(id, null, true);
              break;
            }
            default: {
              this.log.error("Command <" + command + "> not supported");
            }
          }
        } else {
          this.log.info("Received command: <" + command + "> for connector <" + connectorNum + "> with value <" + state.val + ">");
          switch (command) {
            case "stopCharging": {
              this.log.debug("stopCharging");
              this.chargerController.commandStopCharging(connectorNum);
              this.setState(id, false, true);
              this.setState("commands.connectors." + connectorNum + ".setCurrentSetpoint", 0, true);
              break;
            }
            case "pauseCharging": {
              this.log.debug("pauseCharging");
              this.chargerController.commandPauseCharging(connectorNum);
              this.setState(id, false, true);
              this.setState("commands.connectors." + connectorNum + ".setCurrentSetpoint", 0, true);
              break;
            }
            case "setDepartureTime": {
              this.log.debug("setDepartureTime");
              if (typeof state.val === "number") {
                this.chargerController.commandSetDepartureTime(connectorNum, state.val);
              }
              this.setState(id, null, true);
              break;
            }
            case "setCurrentSetpoint": {
              this.log.debug("setCurrentSetpoint");
              if (typeof state.val === "number") {
                this.chargerController.commandSetCurrentSetpoint(connectorNum, state.val);
              }
              break;
            }
            case "cancelCurrentSetpoint": {
              this.log.debug("cancelCurrentSetpoint");
              this.chargerController.commandCancelCurrentSetpoint(connectorNum);
              this.setState(id, false, true);
              this.setState("commands.connectors." + connectorNum + ".setCurrentSetpoint", null, true);
              break;
            }
            case "setPowerSetpoint": {
              this.log.debug("setPowerSetpoint");
              if (typeof state.val === "number") {
                this.chargerController.commandSetPowerSetpoint(connectorNum, state.val);
              }
              this.setState(id, null, true);
              break;
            }
            case "cancelPowerSetpoint": {
              this.log.debug("cancelPowerSetpoint");
              this.chargerController.commandCancelPowerSetpoint(connectorNum);
              this.setState(id, false, true);
              break;
            }
            default: {
              this.log.error("Command <" + command + "> not supported");
            }
          }
          this.updateTimeout = this.setTimeout(async () => {
            this.log.debug("updateChargerConnectorInfoData for connector " + connectorNum);
            this.chargerController.fetchConnectorMeasurementData(connectorNum, this.updateChargerConnectorMeasurementObjects.bind(this));
          }, 1e3);
        }
      }
    }
  }
  /**
   * Is called when adapter shuts down - callback has to be called under any circumstances!
   */
  onUnload(callback) {
    try {
      this.setState("info.connection", false, true);
      if (this.updateInterval) {
        this.clearInterval(this.updateInterval);
      }
      if (this.updateTimeout) {
        this.clearTimeout(this.updateTimeout);
      }
      callback();
    } catch (e) {
      callback();
    }
  }
  actionsAfterConnect() {
    this.chargerController.fetchChargerInfoData(this.initChargerInfoData.bind(this));
  }
  async initChargerInfoData(infoData) {
    this.infoData = infoData;
    for (let i = 1; i <= this.infoData.getNumberOfConnectors(); i++) {
      this.createChargerConnectorInfoObjects(i);
      this.createChargerConnectorMeasurementObjects(i);
    }
    if (this.config.allowWriteAccess) {
      this.createChargerCommandObjects();
      this.createChargerConfigObjects();
      for (let i = 1; i <= this.infoData.getNumberOfConnectors(); i++) {
        this.createChargerConnectorCommandObjects(i);
      }
      this.subscribeStates("commands.*");
    } else {
      this.delObject("commands");
    }
    this.setState("chargerSettings.serialNumber", infoData.getSerialNumber(), true);
    this.setState("chargerSettings.model", infoData.getModel(), true);
    this.setState("chargerSettings.hwVersion", infoData.getHardwareVersion(), true);
    this.setState("chargerSettings.swVersion", infoData.getSoftwareVersion(), true);
    this.setState("chargerSettings.numberOfConnectors", infoData.getNumberOfConnectors(), true);
    for (let i = 1; i <= this.infoData.getNumberOfConnectors(); i++) {
      this.chargerController.fetchConnectorInfoData(i, this.updateChargerConnectorInfoData.bind(this));
      this.chargerController.fetchConnectorMeasurementData(i, this.updateChargerConnectorMeasurementObjects.bind(this));
    }
    this.updateInterval = this.setInterval(async () => {
      this.updateChargerData();
    }, this.config.interval * 1e3);
  }
  async updateChargerData() {
    if (this.infoData != void 0) {
      for (let i = 1; i <= this.infoData.getNumberOfConnectors(); i++) {
        this.chargerController.fetchConnectorInfoData(i, this.updateChargerConnectorInfoData.bind(this));
        this.chargerController.fetchConnectorMeasurementData(i, this.updateChargerConnectorMeasurementObjects.bind(this));
      }
    }
  }
  async createChargerConnectorInfoObjects(num) {
    this.log.debug("createChargerConnectorInfoObjects for connector " + num);
    this.setObjectNotExists("chargerSettings.connectors." + num, {
      type: "channel",
      common: {
        name: "connector " + num
      },
      native: {}
    });
    this.setObjectNotExists("chargerSettings.connectors." + num + ".connectorType", {
      type: "state",
      common: {
        name: "Connector type",
        type: "string",
        role: "value",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExists("chargerSettings.connectors." + num + ".numberOfPhases", {
      type: "state",
      common: {
        name: "Number phases",
        type: "number",
        role: "value",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExists("chargerSettings.connectors." + num + ".l1ConnectedToPhase", {
      type: "state",
      common: {
        name: "L1 connected to phase",
        type: "number",
        role: "value",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExists("chargerSettings.connectors." + num + ".l2ConnectedToPhase", {
      type: "state",
      common: {
        name: "L2 connected to phase",
        type: "number",
        role: "value",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExists("chargerSettings.connectors." + num + ".l3ConnectedToPhase", {
      type: "state",
      common: {
        name: "L3 connected to phase",
        type: "number",
        role: "value",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExists("chargerSettings.connectors." + num + ".customMaxCurrent", {
      type: "state",
      common: {
        name: "Custom max current",
        type: "number",
        role: "value.current",
        read: true,
        write: false,
        unit: "A"
      },
      native: {}
    });
  }
  async createChargerConfigObjects() {
    this.log.debug("createChargerConfigObjects");
    this.setObjectNotExists("config", {
      type: "channel",
      common: {
        name: "configuration for smart mode "
      },
      native: {}
    });
    let stateId = "config.chargerMode";
    if (!await this.getObjectAsync(stateId)) {
      await this.setObjectNotExists(stateId, {
        type: "state",
        common: {
          name: "Charger mode",
          type: "string",
          desc: "one of: MAX, PV, PV +, PV & Batterie, PV & Batterie Limit",
          role: "value",
          read: true,
          write: true
        },
        native: {}
      });
      this.setState(stateId, "PV", true);
    }
    stateId = "config.batteryMaxPower";
    if (!await this.getObjectAsync(stateId)) {
      await this.setObjectNotExists(stateId, {
        type: "state",
        common: {
          name: "Battery Max Power (W)",
          type: "number",
          desc: "Max power output of battery (W)",
          role: "value",
          read: true,
          write: true,
          unit: "W"
        },
        native: {}
      });
      this.setState(stateId, "4000", true);
    }
    stateId = "config.evMinPower";
    if (!await this.getObjectAsync(stateId)) {
      await this.setObjectNotExists(stateId, {
        type: "state",
        common: {
          name: "EV min power",
          type: "number",
          desc: "Min Charger Power for electric vehicle (W)",
          role: "value",
          read: true,
          write: true,
          unit: "W"
        },
        native: {}
      });
      this.setState(stateId, "3800", true);
    }
    stateId = "config.batteryMinSoC";
    if (!await this.getObjectAsync(stateId)) {
      await this.setObjectNotExists(stateId, {
        type: "state",
        common: {
          name: "Battery min state of charge (0 - 100)",
          type: "number",
          desc: "Min state of charge while charging",
          role: "value",
          read: true,
          write: true,
          unit: "W"
        },
        native: {}
      });
      this.setState(stateId, "60", true);
    }
  }
  async updateChargerConnectorInfoData(num, data) {
    this.log.debug("updateChargerConnectorInfoData for connector " + num);
    this.setState("chargerSettings.connectors." + num + ".connectorType", data.getConnectorTypeAsString(), true);
    this.setState("chargerSettings.connectors." + num + ".numberOfPhases", data.getNumberOfPhases(), true);
    this.setState("chargerSettings.connectors." + num + ".l1ConnectedToPhase", data.getL1ConnectedToPhase(), true);
    this.setState("chargerSettings.connectors." + num + ".l2ConnectedToPhase", data.getL2ConnectedToPhase(), true);
    this.setState("chargerSettings.connectors." + num + ".l3ConnectedToPhase", data.getL3ConnectedToPhase(), true);
    this.setState("chargerSettings.connectors." + num + ".customMaxCurrent", data.getCustomMaxCurrent(), true);
  }
  async createChargerConnectorMeasurementObjects(num) {
    this.log.debug("createChargerConnectorMeasurementObjects for connector " + num);
    this.setObjectNotExists("measurements." + num, {
      type: "channel",
      common: {
        name: "connector " + num
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".connectorStatus", {
      type: "state",
      common: {
        name: "Connnector status id",
        type: "number",
        role: "value",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".connectorStatusLabel", {
      type: "state",
      common: {
        name: "Connnector status",
        type: "string",
        role: "value",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".measuredVehicleNumberOfPhases", {
      type: "state",
      common: {
        name: "Measured vehicle number of phases id",
        type: "number",
        role: "value",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".measuredVehicleNumberOfPhasesLabel", {
      type: "state",
      common: {
        name: "Measured vehicle number of phases label",
        type: "string",
        role: "value",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".evMaxPhaseCurrent", {
      type: "state",
      common: {
        name: "EV max phase current",
        type: "number",
        role: "value.current",
        read: true,
        write: false,
        unit: "A"
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".targetCurrentFromPowerMgm", {
      type: "state",
      common: {
        name: "Target current from power mgm or modbus",
        type: "number",
        role: "value.current",
        read: true,
        write: false,
        unit: "A"
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".frequency", {
      type: "state",
      common: {
        name: "Frequency",
        type: "number",
        role: "value",
        read: true,
        write: false,
        unit: "Hz"
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".voltageL1", {
      type: "state",
      common: {
        name: "L-N voltage (L1)",
        type: "number",
        role: "value.voltage",
        read: true,
        write: false,
        unit: "V"
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".voltageL2", {
      type: "state",
      common: {
        name: "L-N voltage (L2)",
        type: "number",
        role: "value.voltage",
        read: true,
        write: false,
        unit: "V"
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".voltageL3", {
      type: "state",
      common: {
        name: "L-N voltage (L3)",
        type: "number",
        role: "value.voltage",
        read: true,
        write: false,
        unit: "V"
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".currentL1", {
      type: "state",
      common: {
        name: "Curent (L1)",
        type: "number",
        role: "value.current",
        read: true,
        write: false,
        unit: "A"
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".currentL2", {
      type: "state",
      common: {
        name: "Curent (L2)",
        type: "number",
        role: "value.current",
        read: true,
        write: false,
        unit: "A"
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".currentL3", {
      type: "state",
      common: {
        name: "Curent (L3)",
        type: "number",
        role: "value.current",
        read: true,
        write: false,
        unit: "A"
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".activePowerL1", {
      type: "state",
      common: {
        name: "Active power (L1)",
        type: "number",
        role: "value.power",
        read: true,
        write: false,
        unit: "kW"
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".activePowerL2", {
      type: "state",
      common: {
        name: "Active power (L2)",
        type: "number",
        role: "value.power",
        read: true,
        write: false,
        unit: "kW"
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".activePowerL3", {
      type: "state",
      common: {
        name: "Active power (L3)",
        type: "number",
        role: "value.power",
        read: true,
        write: false,
        unit: "kW"
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".activePowerTotal", {
      type: "state",
      common: {
        name: "Active power (total)",
        type: "number",
        role: "value.power",
        read: true,
        write: false,
        unit: "kW"
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".powerFactor", {
      type: "state",
      common: {
        name: "Power factor",
        type: "number",
        role: "value",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".totalImportedActiveEnergyInRunningSession", {
      type: "state",
      common: {
        name: "Total imported active energy in running session",
        type: "number",
        role: "value.power.consumption",
        read: true,
        write: false,
        unit: "kWh"
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".runningSessionDuration", {
      type: "state",
      common: {
        name: "Running session duration",
        type: "number",
        role: "value.interval",
        read: true,
        write: false,
        unit: "s"
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".runningSessionDepartureTime", {
      type: "state",
      common: {
        name: "Running session departure time",
        type: "number",
        role: "value",
        read: true,
        write: false,
        unit: "s"
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".runningSessionDepartureTimeISO", {
      type: "state",
      common: {
        name: "Running session departure time in ISO UTC format",
        type: "string",
        role: "value",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".runningSessionID", {
      type: "state",
      common: {
        name: "Running session ID",
        type: "number",
        role: "value",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".evMaxPower", {
      type: "state",
      common: {
        name: "EV max power",
        type: "number",
        role: "value",
        read: true,
        write: false,
        unit: "kW"
      },
      native: {}
    });
    this.setObjectNotExists("measurements." + num + ".evPlannedEnergy", {
      type: "state",
      common: {
        name: "EV planned energy",
        type: "number",
        role: "value",
        read: true,
        write: false,
        unit: "kWh"
      },
      native: {}
    });
  }
  async updateChargerConnectorMeasurementObjects(num, data) {
    this.log.debug("updateChargerConnectorMeasurementObjects for connector " + num);
    this.setState("measurements." + num + ".connectorStatus", data.getConnectorStatus(), true);
    this.setState("measurements." + num + ".connectorStatusLabel", data.getConnectorStatusAsString(), true);
    this.setState("measurements." + num + ".measuredVehicleNumberOfPhases", data.getMeasuredVehicleNumberOfPhases(), true);
    this.setState("measurements." + num + ".measuredVehicleNumberOfPhasesLabel", data.getMeasuredVehicleNumberOfPhasesAsString(), true);
    this.setState("measurements." + num + ".evMaxPhaseCurrent", data.getEvMaxPhaseCurrent(), true);
    this.setState("measurements." + num + ".targetCurrentFromPowerMgm", data.getTargetCurrentFromPowerMgm(), true);
    this.setState("measurements." + num + ".frequency", data.getFrequency(), true);
    this.setState("measurements." + num + ".voltageL1", data.getVoltageL1(), true);
    this.setState("measurements." + num + ".voltageL2", data.getVoltageL2(), true);
    this.setState("measurements." + num + ".voltageL3", data.getVoltageL3(), true);
    this.setState("measurements." + num + ".currentL1", data.getCurrentL1(), true);
    this.setState("measurements." + num + ".currentL2", data.getCurrentL2(), true);
    this.setState("measurements." + num + ".currentL3", data.getCurrentL3(), true);
    this.setState("measurements." + num + ".activePowerL1", data.getActivePowerL1(), true);
    this.setState("measurements." + num + ".activePowerL2", data.getActivePowerL2(), true);
    this.setState("measurements." + num + ".activePowerL3", data.getActivePowerL3(), true);
    this.setState("measurements." + num + ".activePowerTotal", data.getActivePowerTotal(), true);
    this.setState("measurements." + num + ".powerFactor", data.getPowerFactor(), true);
    this.setState("measurements." + num + ".totalImportedActiveEnergyInRunningSession", data.getTotalImportedActiveEnergyInRunningSession(), true);
    this.setState("measurements." + num + ".runningSessionDuration", data.getRunningSessionDuration(), true);
    this.setState("measurements." + num + ".runningSessionDepartureTime", data.getRunningSessionDepartureTime(), true);
    this.setState("measurements." + num + ".runningSessionDepartureTimeISO", new Date(data.getRunningSessionDepartureTime() * 1e3).toISOString(), true);
    this.setState("measurements." + num + ".runningSessionID", data.getRunningSessionID(), true);
    this.setState("measurements." + num + ".evMaxPower", data.getEvMaxPower(), true);
    this.setState("measurements." + num + ".evPlannedEnergy", data.getEvPlannedEnergy(), true);
    this.getState("commands.connectors." + num + ".setCurrentSetpoint", (err, state) => {
      if (state != null && state.val == data.getTargetCurrentFromPowerMgm()) {
        this.setState("commands.connectors." + num + ".setCurrentSetpoint", data.getTargetCurrentFromPowerMgm(), true);
      }
    });
    if (this.config.activateChargerControl) {
      this.checkChargerSmartMode();
    }
  }
  async createChargerCommandObjects() {
    this.log.debug("createChargerCommandObjects");
    this.setObjectNotExists("commands", {
      type: "channel",
      common: {
        name: "Commands"
      },
      native: {}
    });
    this.setObjectNotExists("commands.restart", {
      type: "state",
      common: {
        name: "Restart sonnen-charger",
        role: "button",
        def: false,
        type: "boolean",
        read: false,
        write: true
      },
      native: {}
    });
    this.setObjectNotExists("commands.setTime", {
      type: "state",
      common: {
        name: "Set time UTC",
        role: "value",
        type: "number",
        read: false,
        write: true,
        unit: " s"
      },
      native: {}
    });
    this.setObjectNotExists("commands.connectors", {
      type: "channel",
      common: {
        name: "Connector Commands"
      },
      native: {}
    });
  }
  async createChargerConnectorCommandObjects(num) {
    this.log.debug("createChargerConnectorCommandObjects for connector " + num);
    this.setObjectNotExists("commands.connectors." + num, {
      type: "channel",
      common: {
        name: "connector " + num
      },
      native: {}
    });
    this.setObjectNotExists("commands.connectors." + num + ".stopCharging", {
      type: "state",
      common: {
        name: "Stop charging",
        role: "button.stop",
        def: false,
        type: "boolean",
        read: false,
        write: true
      },
      native: {}
    });
    this.setObjectNotExists("commands.connectors." + num + ".pauseCharging", {
      type: "state",
      common: {
        name: "Pause charging",
        role: "button.pause",
        def: false,
        type: "boolean",
        read: false,
        write: true
      },
      native: {}
    });
    this.setObjectNotExists("commands.connectors." + num + ".setDepartureTime", {
      type: "state",
      common: {
        name: "Set departure time",
        type: "number",
        role: "value",
        read: false,
        write: true,
        unit: " s"
      },
      native: {}
    });
    this.setObjectNotExists("commands.connectors." + num + ".setCurrentSetpoint", {
      type: "state",
      common: {
        name: "Set current setpoint",
        type: "number",
        role: "value",
        read: false,
        write: true,
        unit: "A"
      },
      native: {}
    });
    this.setObjectNotExists("commands.connectors." + num + ".cancelCurrentSetpoint", {
      type: "state",
      common: {
        name: "Cancel current setpoint",
        role: "button",
        def: false,
        type: "boolean",
        read: false,
        write: true
      },
      native: {}
    });
    this.setObjectNotExists("commands.connectors." + num + ".setPowerSetpoint", {
      type: "state",
      common: {
        name: "Set power setpoint",
        type: "number",
        role: "value",
        read: false,
        write: true,
        unit: "kW"
      },
      native: {}
    });
    this.setObjectNotExists("commands.connectors." + num + ".cancelPowerSetpoint", {
      type: "state",
      common: {
        name: "Cancel power setpoint",
        role: "button",
        def: false,
        type: "boolean",
        read: false,
        write: true
      },
      native: {}
    });
  }
  async checkChargerSmartMode() {
    let production = 0;
    let consumptionTotal = 0;
    let batterySoC = 0;
    let batteryEmSoC = 0;
    let batteryPowerMinLevel = 0;
    let batteryMaxPower = 0;
    let chargerMode;
    let chargerStatus;
    let consumptionCharger = 0;
    let currentTargetFromPowerMgm = 0;
    let evMinPower = 0;
    let chargerTargetSetPoint = -1;
    const id_connectorStatus = "measurements.1.connectorStatusLabel";
    const id_activePowerTotal = "measurements.1.activePowerTotal";
    const id_targetCurrentFromPowerMgm = "measurements.1.targetCurrentFromPowerMgm";
    const id_chargerMode = "config.chargerMode";
    const id_batteryMaxPower = "config.batteryMaxPower";
    const id_batteryMinSoC = "config.batteryMinSoC";
    const id_evMinPower = "config.evMinPower";
    const externalIds = [this.config.id_production, this.config.id_total_consumption, this.config.id_battery_soc, this.config.id_battery_em_soc];
    const internalIds = [id_targetCurrentFromPowerMgm, id_activePowerTotal, id_connectorStatus, id_chargerMode, id_batteryMaxPower, id_batteryMinSoC, id_evMinPower];
    const externalPromises = externalIds.map((id) => this.getForeignStateAsync(id).then((state) => ({ id, state })));
    const internalPromises = internalIds.map((id) => this.getStateAsync(id).then((state) => ({ id, state })));
    const allPromises = externalPromises.concat(internalPromises);
    const results = await Promise.all(allPromises);
    results.forEach((result) => {
      if (result.state) {
        if (this.config.id_production === result.id) {
          production = result.state.val;
        }
        if (this.config.id_total_consumption === result.id) {
          consumptionTotal = result.state.val;
        }
        if (this.config.id_battery_soc === result.id) {
          batterySoC = result.state.val;
        }
        if (this.config.id_battery_em_soc === result.id) {
          batteryEmSoC = result.state.val;
        }
        if (id_activePowerTotal === result.id) {
          consumptionCharger = result.state.val * 1e3;
        }
        if (id_connectorStatus === result.id) {
          chargerStatus = result.state.val;
        }
        if (id_targetCurrentFromPowerMgm === result.id) {
          currentTargetFromPowerMgm = result.state.val;
        }
        if (id_chargerMode === result.id) {
          chargerMode = result.state.val;
        }
        if (id_batteryMinSoC === result.id) {
          batteryPowerMinLevel = result.state.val;
        }
        if (id_evMinPower === result.id) {
          evMinPower = result.state.val;
        }
        if (id_batteryMaxPower === result.id) {
          batteryMaxPower = result.state.val;
        }
        this.log.debug("id: " + result.id + " value: " + result.state.val);
      }
    });
    if (chargerStatus === "Charging" || chargerStatus === "ChargingPausedByEvse") {
      if (chargerMode == "MAX" /* MAX_POWER */) {
        chargerTargetSetPoint = 16;
      } else {
        let availablePower = 0;
        if (chargerMode == "PV" /* PV_ONLY */) {
          availablePower = production - consumptionTotal + consumptionCharger;
        } else if (chargerMode == "PV +" /* PV_ONLY_OPT */) {
          availablePower = production - consumptionTotal + consumptionCharger;
          if (availablePower <= evMinPower && batterySoC > batteryPowerMinLevel) {
            availablePower = evMinPower;
          }
        } else if (chargerMode == "PV & Batterie" /* PV_BATT */) {
          if (batterySoC > batteryEmSoC) {
            availablePower = production - consumptionTotal + consumptionCharger + batteryMaxPower;
          }
        } else if (chargerMode == " PV & Batterie Limit" /* PV_BATT_LIMIT */) {
          if (batterySoC > batteryEmSoC && batterySoC > batteryPowerMinLevel) {
            availablePower = production - consumptionTotal + consumptionCharger + batteryMaxPower;
          }
        } else {
          this.log.error("Unkown charging mode: " + chargerMode);
        }
        this.log.debug("availablePower: " + availablePower);
        chargerTargetSetPoint = this.calculateNewSetPoint(availablePower);
      }
      this.log.debug("chargerTargetSetPoint: " + chargerTargetSetPoint);
      if (chargerTargetSetPoint >= 0 && chargerTargetSetPoint != currentTargetFromPowerMgm) {
        if (chargerTargetSetPoint == 0) {
          console.log("Adjustment setPoint: pauseCharging");
        } else {
          console.log("Adjustment setPoint: " + currentTargetFromPowerMgm + " --> " + chargerTargetSetPoint);
        }
      }
    }
  }
  calculateNewSetPoint(availablePower) {
    if (availablePower >= 1e4)
      return 16;
    if (availablePower >= 9600)
      return 15;
    if (availablePower >= 8900)
      return 14;
    if (availablePower >= 8e3)
      return 13;
    if (availablePower >= 7700)
      return 12;
    if (availablePower >= 6900)
      return 11;
    if (availablePower >= 6100)
      return 10;
    if (availablePower >= 5700)
      return 9;
    if (availablePower >= 4900)
      return 8;
    if (availablePower >= 4e3)
      return 7;
    if (availablePower >= 3800)
      return 6;
    return 0;
  }
}
if (require.main !== module) {
  module.exports = (options) => new SonnenCharger(options);
} else {
  (() => new SonnenCharger())();
}
//# sourceMappingURL=main.js.map
