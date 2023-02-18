/*
 * Created with @iobroker/create-adapter v2.3.0
 */

import * as utils from "@iobroker/adapter-core";
import { ChargerController } from "./ChargerController";

class SonnenCharger extends utils.Adapter {

	private chargerController : ChargerController;
	private timer: NodeJS.Timeout | undefined;

	public constructor(options: Partial<utils.AdapterOptions> = {}) {
		super({
			...options,
			name: "sonnen-charger",
		});

		this.chargerController = new ChargerController();

		this.on("ready", this.onReady.bind(this));
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

		this.log.info("conncet to modbus");

		this.chargerController.connect( this.config.serverIp, this.config.serverPort);

		// TODO loop over numberOf Connctors
		this.createChargerConnectorInfoObjects(1);
		this.createChargerConnectorMeasurementObjects(1);

		this.timer = setInterval(async () => {
			await this.updateChargerData();
		  }, this.config.interval * 1000);
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 */
	private onUnload(callback: () => void): void {
		try {

			// Reset the connection indicator during shutdown
			this.setState("info.connection", false, true);

			// Here you must clear all timeouts or intervals that may still be active
			// clearTimeout(timeout1);
			// clearTimeout(timeout2);
			// ...

			clearInterval(this.timer);

			callback();
		} catch (e) {
			callback();
		}
	}

	private async updateChargerData(): Promise<void> {

		//TODO nur nach Initialisierung
		this.updateChargerInfoData();

		//TODO loop
		this.updateChargerConnectorInfoData(1);
		this.updateChargerConnectorMeasurementObjects(1);
	}


	private async updateChargerInfoData(): Promise<void> {

		this.log.info("updateChargerInfoData");

		const infoData = await this.chargerController.fetchChargerInfoData();
		this.setState("chargerSettings.serialNumber", infoData.getSerialNumber(), true);
		this.setState("chargerSettings.model", infoData.getModel(), true);
		this.setState("chargerSettings.hwVersion", infoData.getHardwareVersion(), true);
		this.setState("chargerSettings.swVersion", infoData.getSoftwareVersion(), true);
		this.setState("chargerSettings.numberOfConnectors", infoData.getNumberOfConnectors(), true);
	}

	private async createChargerConnectorInfoObjects(num : number): Promise<void> {

		this.log.info("createChargerConnectorInfoObjects for connector "+num);

		await this.setObjectNotExistsAsync("chargerSettings.connectors."+num, {
			type: "channel",
			common: {
				name: "todo"
			},
			native: {}
		});

		await this.setObjectNotExistsAsync("chargerSettings.connectors."+num+".connectorType", {
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

		await this.setObjectNotExistsAsync("chargerSettings.connectors."+num+".numberOfPhases", {
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

		await this.setObjectNotExistsAsync("chargerSettings.connectors."+num+".l1ConnectedToPhase", {
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

		await this.setObjectNotExistsAsync("chargerSettings.connectors."+num+".l2ConnectedToPhase", {
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

		await this.setObjectNotExistsAsync("chargerSettings.connectors."+num+".l3ConnectedToPhase", {
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

		await this.setObjectNotExistsAsync("chargerSettings.connectors."+num+".customMaxCurrent", {
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

	private async updateChargerConnectorInfoData(num : number): Promise<void> {

		this.log.info("updateChargerConnectorInfoData for connector "+num);

		const infoData = await this.chargerController.fetchConnectorInfoData(num);
		this.setState("chargerSettings.connectors."+num+".connectorType", infoData.getConnectorTypeAsString(), true);
		this.setState("chargerSettings.connectors."+num+".numberOfPhases", infoData.getNumberOfPhases(), true);
		this.setState("chargerSettings.connectors."+num+".l1ConnectedToPhase", infoData.getL1ConnectedToPhase(), true);
		this.setState("chargerSettings.connectors."+num+".l2ConnectedToPhase", infoData.getL2ConnectedToPhase(), true);
		this.setState("chargerSettings.connectors."+num+".l3ConnectedToPhase", infoData.getL3ConnectedToPhase(), true);
		this.setState("chargerSettings.connectors."+num+".customMaxCurrent", infoData.getCustomMaxCurrent(), true);
	}

	private async createChargerConnectorMeasurementObjects(num : number): Promise<void> {

		this.log.info("createChargerConnectorMeasurementObjects for connector "+num);

		await this.setObjectNotExistsAsync("measurements."+num, {
			type: "channel",
			common: {
				name: "measurements"
			},
			native: {}
		});

		await this.setObjectNotExistsAsync("measurements."+num+".connectorStatus", {
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

		await this.setObjectNotExistsAsync("measurements."+num+".connectorStatusLabel", {
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

		await this.setObjectNotExistsAsync("measurements."+num+".measuredVehicleNumberOfPhases", {
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

		await this.setObjectNotExistsAsync("measurements."+num+".measuredVehicleNumberOfPhasesLabel",{
			type: "state",
			common: {
				name: "Measured vehicle number of phases",
				type: "string",
				role: "value",
				read: true,
				write: false
			},
			native: {}
		});

		await this.setObjectNotExistsAsync("measurements."+num+".evMaxPhaseCurrent", {
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

		await this.setObjectNotExistsAsync("measurements."+num+".targetCurrentFromPowerMgm", {
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

		await this.setObjectNotExistsAsync("measurements."+num+".frequency", {
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

		await this.setObjectNotExistsAsync("measurements."+num+".voltageL1", {
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

		await this.setObjectNotExistsAsync("measurements."+num+".voltageL2", {
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

		await this.setObjectNotExistsAsync("measurements."+num+".voltageL3", {
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

		await this.setObjectNotExistsAsync("measurements."+num+".currentL1", {
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

		await this.setObjectNotExistsAsync("measurements."+num+".currentL2", {
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

		await this.setObjectNotExistsAsync("measurements."+num+".currentL3", {
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

		await this.setObjectNotExistsAsync("measurements."+num+".activePowerL1", {
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

		await this.setObjectNotExistsAsync("measurements."+num+".activePowerL2", {
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

		await this.setObjectNotExistsAsync("measurements."+num+".activePowerL3", {
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

		await this.setObjectNotExistsAsync("measurements."+num+".activePowerTotal", {
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

		await this.setObjectNotExistsAsync("measurements."+num+".powerFactor", {
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

		await this.setObjectNotExistsAsync("measurements."+num+".totalImportedActiveEnergyInRunningSession", {
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

		await this.setObjectNotExistsAsync("measurements."+num+".runningSessionDuration", {
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

		await this.setObjectNotExistsAsync("measurements."+num+".runningSessionDepartureTime", {
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

		await this.setObjectNotExistsAsync("measurements."+num+".runningSessionID", {
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

		await this.setObjectNotExistsAsync("measurements."+num+".evMaxPower", {
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

		await this.setObjectNotExistsAsync("measurements."+num+".evPlannedEnergy", {
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

	private async updateChargerConnectorMeasurementObjects(num : number): Promise<void> {

		this.log.info("updateChargerConnectorMeasurementObjects for connector "+num);

		const infoData = await this.chargerController.fetchConnectorMeasurementData(num);
		this.setState("measurements."+num+".connectorStatus", infoData.getConnectorStatus(), true);
		this.setState("measurements."+num+".connectorStatusLabel", infoData.getConnectorStatusAsString(), true);
		this.setState("measurements."+num+".measuredVehicleNumberOfPhases", infoData.getMeasuredVehicleNumberOfPhases(), true);
		this.setState("measurements."+num+".measuredVehicleNumberOfPhasesLabel", infoData.getMeasuredVehicleNumberOfPhasesAsString(), true);
		this.setState("measurements."+num+".evMaxPhaseCurrent", infoData.getEvMaxPhaseCurrent(), true);
		this.setState("measurements."+num+".targetCurrentFromPowerMgm", infoData.getTargetCurrentFromPowerMgm(), true);
		this.setState("measurements."+num+".frequency", infoData.getFrequency(), true);
		this.setState("measurements."+num+".voltageL1", infoData.getVoltageL1(), true);
		this.setState("measurements."+num+".voltageL2", infoData.getVoltageL2(), true);
		this.setState("measurements."+num+".voltageL3", infoData.getVoltageL3(), true);
		this.setState("measurements."+num+".currentL1", infoData.getCurrentL1(), true);
		this.setState("measurements."+num+".currentL2", infoData.getCurrentL2(), true);
		this.setState("measurements."+num+".currentL3", infoData.getCurrentL3(), true);
		this.setState("measurements."+num+".activePowerL1", infoData.getActivePowerL1(), true);
		this.setState("measurements."+num+".activePowerL2", infoData.getActivePowerL2(), true);
		this.setState("measurements."+num+".activePowerL3", infoData.getActivePowerL3(), true);
		this.setState("measurements."+num+".activePowerTotal", infoData.getActivePowerTotal(), true);
		this.setState("measurements."+num+".powerFactor", infoData.getPowerFactor(), true);
		this.setState("measurements."+num+".totalImportedActiveEnergyInRunningSession", infoData.getTotalImportedActiveEnergyInRunningSession(), true);
		this.setState("measurements."+num+".runningSessionDuration", infoData.getRunningSessionDuration(), true);
		this.setState("measurements."+num+".runningSessionDepartureTime", infoData.getRunningSessionDepartureTime(), true);
		this.setState("measurements."+num+".runningSessionID", infoData.getRunningSessionID(), true);
		this.setState("measurements."+num+".evMaxPower", infoData.getEvMaxPower(), true);
		this.setState("measurements."+num+".evPlannedEnergy", infoData.getEvPlannedEnergy(), true);
	}
}

if (require.main !== module) {
	// Export the constructor in compact mode
	module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new SonnenCharger(options);
} else {
	// otherwise start the instance directly
	(() => new SonnenCharger())();
}
