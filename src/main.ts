/*
 * Created with @iobroker/create-adapter v2.3.0
 */

import * as utils from "@iobroker/adapter-core";
import { ChargerController } from "./ChargerController";
import { ChargerInfoData } from "./ChargerInfoData";
import { ChargerConnectorInfoData} from "./ChargerConnectorInfoData";
import { ChargerConnectorMeasurementData } from "./ChargerConnectorMeasurementData"

class SonnenCharger extends utils.Adapter {

	private chargerController : ChargerController;
	private updateInterval: ioBroker.Interval | undefined;
	private infoData : ChargerInfoData | undefined;

	public constructor(options: Partial<utils.AdapterOptions> = {}) {
		super({
			...options,
			name: "sonnen-charger",
		});

		this.chargerController = new ChargerController();

		this.on("ready", this.onReady.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	private async onReady(): Promise<void> {

		// Reset the connection indicator during startup
		this.setState("info.connection", true, true);

		// check configuration
		if (!this.config.serverIp) {
			this.log.error("Server IP is empty - please check instance configuration")
			return;
		}
		if (!this.config.serverPort) {
			this.log.error("Server port is empty - please check instance configuration")
			return;
		}
		if (!this.config.interval) {
			this.log.error("interval is empty - please check instance configuration")
			return;
		}

		this.log.info("config serverIp: " + this.config.serverIp);
		this.log.info("config serverPort: " + this.config.serverPort);
		this.log.info("config interval: " + this.config.interval);
		this.log.info("config allowWriteAccess: " + this.config.allowWriteAccess);

		this.chargerController.connect( this.config.serverIp, this.config.serverPort, this.actionsAfterConnect.bind(this));
	}

	private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
		if (!id || !state || state.ack) {
			return;
		} // Ignore acknowledged state changes

		if (state.val != null && state.val != false) {

			const myRegexp = new RegExp("sonnen-charger\\.(\\d)\\.commands(\\.connectors\\.(\\d))?\\.(.*)");
			const match = myRegexp.exec(id);

			if (match != null) {
				const command = match[4];
				const connectorNum : number = parseInt(match[3]);

				if (!connectorNum) {
					// Charger command
					this.log.info("Received command: <"+ command + "> with value <"+state.val+">");

					switch (command) {
						case "restart": {
							this.log.debug("restart");
							this.chargerController.commandRestart();
							this.setState(id,false,true);
							break;
						}
						case "setTime": {
							this.log.debug("setTime");
							if (typeof state.val === "number") {
								this.chargerController.commandSetTime(state.val);
							}
							this.setState(id,null,true);
							break;
						}
						default: {
							this.log.error("Command <"+command+"> not supported");
						}
					}
				} else {
					// Connector command
					this.log.info("Received command: <"+ command + "> for connector <" +connectorNum + "> with value <"+state.val+">");

					switch (command) {
						case "stopCharging": {
							this.log.debug("stopCharging");
							this.chargerController.commandStopCharging(connectorNum);
							this.setState(id,false,true);
							break;
						}
						case "pauseCharging": {
							this.log.debug("pauseCharging");
							this.chargerController.commandPauseCharging(connectorNum);
							this.setState(id,false,true);
							break;
						}
						case "setDepartureTime": {
							this.log.debug("setDepartureTime");
							if (typeof state.val === "number") {
								this.chargerController.commandSetDepartureTime(connectorNum, state.val);
							}
							this.setState(id,null,true);
							break;
						}
						case "setCurrentSetpoint": {
							this.log.debug("setCurrentSetpoint");
							if (typeof state.val === "number") {
								this.chargerController.commandSetCurrentSetpoint(connectorNum, state.val);
							}
							this.setState(id,null,true);
							break;
						}
						case "cancelCurrentSetpoint": {
							this.log.debug("cancelCurrentSetpoint");
							this.chargerController.commandCancelCurrentSetpoint(connectorNum);
							this.setState(id,false,true);
							break;
						}
						case "setPowerSetpoint": {
							this.log.debug("setPowerSetpoint");
							if (typeof state.val === "number") {
								this.chargerController.commandSetPowerSetpoint(connectorNum, state.val);
							}
							this.setState(id,null,true);
							break;
						}
						case "cancelPowerSetpoint": {
							this.log.debug("cancelPowerSetpoint");
							this.chargerController.commandCancelPowerSetpoint(connectorNum);
							this.setState(id,false,true);
							break;
						}
						default: {
							this.log.error("Command <"+command+"> not supported");
						}
					}
				}
			}
		}
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 */
	private onUnload(callback: () => void): void {
		try {
			// Reset the connection indicator during shutdown
			this.setState("info.connection", false, true);

			if (this.updateInterval){
				this.clearInterval(this.updateInterval);
			}

			callback();
		} catch (e) {
			callback();
		}
	}


	private actionsAfterConnect() : void {

		this.chargerController.fetchChargerInfoData(this.initChargerInfoData.bind(this));
	}

	private async initChargerInfoData(infoData : ChargerInfoData): Promise<void> {

		this.infoData = infoData;

		for(let i = 1; i <= this.infoData.getNumberOfConnectors(); i++) {
			this.createChargerConnectorInfoObjects(i);
			this.createChargerConnectorMeasurementObjects(i);
		}

		if (this.config.allowWriteAccess) {

			this.createChargerCommandObjects();

			for(let i = 1; i <= this.infoData.getNumberOfConnectors(); i++) {
				this.createChargerConnectorCommandObjects(i);
			}
			this.subscribeStates("commands.*");
		} else {
			this.deleteChannelAsync("commands");
		}

		this.setState("chargerSettings.serialNumber", infoData.getSerialNumber(), true);
		this.setState("chargerSettings.model", infoData.getModel(), true);
		this.setState("chargerSettings.hwVersion", infoData.getHardwareVersion(), true);
		this.setState("chargerSettings.swVersion", infoData.getSoftwareVersion(), true);
		this.setState("chargerSettings.numberOfConnectors", infoData.getNumberOfConnectors(), true);

		for(let i = 1; i <= this.infoData.getNumberOfConnectors(); i++) {
			this.chargerController.fetchConnectorInfoData(i, this.updateChargerConnectorInfoData.bind(this));
			this.chargerController.fetchConnectorMeasurementData(i, this.updateChargerConnectorMeasurementObjects.bind(this));
		}

		this.updateInterval = this.setInterval(async () => {
			this.updateChargerData();
		}, this.config.interval * 1000);
	}

	private async updateChargerData(): Promise<void> {
		if (this.infoData != undefined ) {
			for(let i = 1; i <= this.infoData.getNumberOfConnectors(); i++) {
				this.chargerController.fetchConnectorInfoData(i, this.updateChargerConnectorInfoData.bind(this));
				this.chargerController.fetchConnectorMeasurementData(i, this.updateChargerConnectorMeasurementObjects.bind(this));
			}
		}
	}

	private async createChargerConnectorInfoObjects(num : number): Promise<void> {

		this.log.debug("createChargerConnectorInfoObjects for connector "+num);

		this.setObjectNotExists("chargerSettings.connectors."+num, {
			type: "channel",
			common: {
				name: "connector " + num
			},
			native: {}
		});

		this.setObjectNotExists("chargerSettings.connectors."+num+".connectorType", {
			type: "state",
			common: {
				name: "Connector type",
				type: "string",
				role: "indicator",
				read: true,
				write: false
			},
			native: {}
		});

		this.setObjectNotExists("chargerSettings.connectors."+num+".numberOfPhases", {
			type: "state",
			common: {
				name: "Number phases",
				type: "number",
				role: "indicator",
				read: true,
				write: false
			},
			native: {}
		});

		this.setObjectNotExists("chargerSettings.connectors."+num+".l1ConnectedToPhase", {
			type: "state",
			common: {
				name: "L1 connected to phase",
				type: "number",
				role: "indicator",
				read: true,
				write: false
			},
			native: {}
		});

		this.setObjectNotExists("chargerSettings.connectors."+num+".l2ConnectedToPhase", {
			type: "state",
			common: {
				name: "L2 connected to phase",
				type: "number",
				role: "indicator",
				read: true,
				write: false
			},
			native: {}
		});

		this.setObjectNotExists("chargerSettings.connectors."+num+".l3ConnectedToPhase", {
			type: "state",
			common: {
				name: "L3 connected to phase",
				type: "number",
				role: "indicator",
				read: true,
				write: false
			},
			native: {}
		});

		this.setObjectNotExists("chargerSettings.connectors."+num+".customMaxCurrent", {
			type: "state",
			common: {
				name: "Custom max current",
				type: "number",
				role: "indicator",
				read: true,
				write: false,
				unit: "A"
			},
			native: {}
		});
	}

	private async updateChargerConnectorInfoData(num : number, data : ChargerConnectorInfoData): Promise<void> {

		this.log.debug("updateChargerConnectorInfoData for connector "+num);

		this.setState("chargerSettings.connectors."+num+".connectorType", data.getConnectorTypeAsString(), true);
		this.setState("chargerSettings.connectors."+num+".numberOfPhases", data.getNumberOfPhases(), true);
		this.setState("chargerSettings.connectors."+num+".l1ConnectedToPhase", data.getL1ConnectedToPhase(), true);
		this.setState("chargerSettings.connectors."+num+".l2ConnectedToPhase", data.getL2ConnectedToPhase(), true);
		this.setState("chargerSettings.connectors."+num+".l3ConnectedToPhase", data.getL3ConnectedToPhase(), true);
		this.setState("chargerSettings.connectors."+num+".customMaxCurrent", data.getCustomMaxCurrent(), true);
	}

	private async createChargerConnectorMeasurementObjects(num : number): Promise<void> {

		this.log.debug("createChargerConnectorMeasurementObjects for connector "+num);

		this.setObjectNotExists("measurements."+num, {
			type: "channel",
			common: {
				name: "connector "+ num
			},
			native: {}
		});

		this.setObjectNotExists("measurements."+num+".connectorStatus", {
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

		this.setObjectNotExists("measurements."+num+".connectorStatusLabel", {
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

		this.setObjectNotExists("measurements."+num+".measuredVehicleNumberOfPhases", {
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

		this.setObjectNotExists("measurements."+num+".measuredVehicleNumberOfPhasesLabel",{
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

		this.setObjectNotExists("measurements."+num+".evMaxPhaseCurrent", {
			type: "state",
			common: {
				name: "EV max phase current",
				type: "number",
				role: "value",
				read: true,
				write: false,
				unit: "A"
			},
			native: {}
		});

		this.setObjectNotExists("measurements."+num+".targetCurrentFromPowerMgm", {
			type: "state",
			common: {
				name: "Target current from power mgm or modbus",
				type: "number",
				role: "value",
				read: true,
				write: false,
				unit: "A"
			},
			native: {}
		});

		this.setObjectNotExists("measurements."+num+".frequency", {
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

		this.setObjectNotExists("measurements."+num+".voltageL1", {
			type: "state",
			common: {
				name: "L-N voltage (L1)",
				type: "number",
				role: "value",
				read: true,
				write: false,
				unit: "V"
			},
			native: {}
		});

		this.setObjectNotExists("measurements."+num+".voltageL2", {
			type: "state",
			common: {
				name: "L-N voltage (L2)",
				type: "number",
				role: "value",
				read: true,
				write: false,
				unit: "V"
			},
			native: {}
		});

		this.setObjectNotExists("measurements."+num+".voltageL3", {
			type: "state",
			common: {
				name: "L-N voltage (L3)",
				type: "number",
				role: "value",
				read: true,
				write: false,
				unit: "V"
			},
			native: {}
		});

		this.setObjectNotExists("measurements."+num+".currentL1", {
			type: "state",
			common: {
				name: "Curent (L1)",
				type: "number",
				role: "value",
				read: true,
				write: false,
				unit: "A"
			},
			native: {}
		});

		this.setObjectNotExists("measurements."+num+".currentL2", {
			type: "state",
			common: {
				name: "Curent (L2)",
				type: "number",
				role: "value",
				read: true,
				write: false,
				unit: "A"
			},
			native: {}
		});

		this.setObjectNotExists("measurements."+num+".currentL3", {
			type: "state",
			common: {
				name: "Curent (L3)",
				type: "number",
				role: "value",
				read: true,
				write: false,
				unit: "A"
			},
			native: {}
		});

		this.setObjectNotExists("measurements."+num+".activePowerL1", {
			type: "state",
			common: {
				name: "Active power (L1)",
				type: "number",
				role: "value",
				read: true,
				write: false,
				unit: "kW"
			},
			native: {}
		});

		this.setObjectNotExists("measurements."+num+".activePowerL2", {
			type: "state",
			common: {
				name: "Active power (L2)",
				type: "number",
				role: "value",
				read: true,
				write: false,
				unit: "kW"
			},
			native: {}
		});

		this.setObjectNotExists("measurements."+num+".activePowerL3", {
			type: "state",
			common: {
				name: "Active power (L3)",
				type: "number",
				role: "value",
				read: true,
				write: false,
				unit: "kW"
			},
			native: {}
		});

		this.setObjectNotExists("measurements."+num+".activePowerTotal", {
			type: "state",
			common: {
				name: "Active power (total)",
				type: "number",
				role: "value",
				read: true,
				write: false,
				unit: "kW"
			},
			native: {}
		});

		this.setObjectNotExists("measurements."+num+".powerFactor", {
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

		this.setObjectNotExists("measurements."+num+".totalImportedActiveEnergyInRunningSession", {
			type: "state",
			common: {
				name: "Total imported active energy in running session",
				type: "number",
				role: "value",
				read: true,
				write: false,
				unit: "kWh"
			},
			native: {}
		});

		this.setObjectNotExists("measurements."+num+".runningSessionDuration", {
			type: "state",
			common: {
				name: "Running session duration",
				type: "number",
				role: "value",
				read: true,
				write: false,
				unit: "s"
			},
			native: {}
		});

		this.setObjectNotExists("measurements."+num+".runningSessionDepartureTime", {
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

		this.setObjectNotExists("measurements."+num+".runningSessionDepartureTimeISO", {
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

		this.setObjectNotExists("measurements."+num+".runningSessionID", {
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

		this.setObjectNotExists("measurements."+num+".evMaxPower", {
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

		this.setObjectNotExists("measurements."+num+".evPlannedEnergy", {
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

	private async updateChargerConnectorMeasurementObjects(num : number, data : ChargerConnectorMeasurementData): Promise<void> {

		this.log.debug("updateChargerConnectorMeasurementObjects for connector "+num);

		this.setState("measurements."+num+".connectorStatus", data.getConnectorStatus(), true);
		this.setState("measurements."+num+".connectorStatusLabel", data.getConnectorStatusAsString(), true);
		this.setState("measurements."+num+".measuredVehicleNumberOfPhases", data.getMeasuredVehicleNumberOfPhases(), true);
		this.setState("measurements."+num+".measuredVehicleNumberOfPhasesLabel", data.getMeasuredVehicleNumberOfPhasesAsString(), true);
		this.setState("measurements."+num+".evMaxPhaseCurrent", data.getEvMaxPhaseCurrent(), true);
		this.setState("measurements."+num+".targetCurrentFromPowerMgm", data.getTargetCurrentFromPowerMgm(), true);
		this.setState("measurements."+num+".frequency", data.getFrequency(), true);
		this.setState("measurements."+num+".voltageL1", data.getVoltageL1(), true);
		this.setState("measurements."+num+".voltageL2", data.getVoltageL2(), true);
		this.setState("measurements."+num+".voltageL3", data.getVoltageL3(), true);
		this.setState("measurements."+num+".currentL1", data.getCurrentL1(), true);
		this.setState("measurements."+num+".currentL2", data.getCurrentL2(), true);
		this.setState("measurements."+num+".currentL3", data.getCurrentL3(), true);
		this.setState("measurements."+num+".activePowerL1", data.getActivePowerL1(), true);
		this.setState("measurements."+num+".activePowerL2", data.getActivePowerL2(), true);
		this.setState("measurements."+num+".activePowerL3", data.getActivePowerL3(), true);
		this.setState("measurements."+num+".activePowerTotal", data.getActivePowerTotal(), true);
		this.setState("measurements."+num+".powerFactor", data.getPowerFactor(), true);
		this.setState("measurements."+num+".totalImportedActiveEnergyInRunningSession", data.getTotalImportedActiveEnergyInRunningSession(), true);
		this.setState("measurements."+num+".runningSessionDuration", data.getRunningSessionDuration(), true);
		this.setState("measurements."+num+".runningSessionDepartureTime", data.getRunningSessionDepartureTime(), true);
		this.setState("measurements."+num+".runningSessionDepartureTimeISO",new Date(data.getRunningSessionDepartureTime()*1000).toISOString(),true);
		this.setState("measurements."+num+".runningSessionID", data.getRunningSessionID(), true);
		this.setState("measurements."+num+".evMaxPower", data.getEvMaxPower(), true);
		this.setState("measurements."+num+".evPlannedEnergy", data.getEvPlannedEnergy(), true);

	}

	private async createChargerCommandObjects() : Promise<void> {

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
				def: false,
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

	private async createChargerConnectorCommandObjects(num : number): Promise<void> {

		this.log.debug("createChargerConnectorCommandObjects for connector "+num);

		this.setObjectNotExists("commands.connectors."+num, {
			type: "channel",
			common: {
				name: "connector " + num
			},
			native: {}
		});

		this.setObjectNotExists("commands.connectors."+num+".stopCharging", {
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

		this.setObjectNotExists("commands.connectors."+num+".pauseCharging", {
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

		this.setObjectNotExists("commands.connectors."+num+".setDepartureTime", {
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

		this.setObjectNotExists("commands.connectors."+num+".setCurrentSetpoint", {
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

		this.setObjectNotExists("commands.connectors."+num+".cancelCurrentSetpoint", {
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

		this.setObjectNotExists("commands.connectors."+num+".setPowerSetpoint", {
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

		this.setObjectNotExists("commands.connectors."+num+".cancelPowerSetpoint", {
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

}

if (require.main !== module) {
	// Export the constructor in compact mode
	module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new SonnenCharger(options);
} else {
	// otherwise start the instance directly
	(() => new SonnenCharger())();
}
