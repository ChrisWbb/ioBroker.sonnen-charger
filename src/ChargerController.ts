import { ModbusTCPClient } from "jsmodbus"
import { Socket, SocketConnectOpts } from "net"

import { ChargerInfoData } from "./ChargerInfoData";
import { ChargerConnectorInfoData } from "./ChargerConnectorInfoData";
import { ChargerConnectorMeasurementData } from "./ChargerConnectorMeasurementData";
import { RegisterConverterUtil } from "./RegisterConverterUtil";

class ChargerController {

	private socket : Socket;
	private client : ModbusTCPClient;

	constructor() {

		this.socket = new Socket();
		this.client = new ModbusTCPClient(this.socket);
	}

	public connect(ipAddress : string, port : number, callback: () => void) : void {

		const options: SocketConnectOpts = {
			"host": ipAddress,
			"port": port
		};

		this.socket.on("connect", callback);

		this.socket.connect(options);
	}

	public async fetchChargerInfoData(callback: (data : ChargerInfoData) => void) : Promise<void>
	{
		this.client.readInputRegisters(990, 31)
			.then(function (resp) {

				const data = new ChargerInfoData();
				const registerData : number[] | Buffer | Uint16Array = resp.response.body.values;
				data.setSerialNumber(RegisterConverterUtil.getRegisterDataAsString(registerData, 0, 10));
				data.setModel(RegisterConverterUtil.getRegisterDataAsString(registerData, 10, 10));
				data.setHardwareVersion(RegisterConverterUtil.getRegisterDataAsString(registerData, 20, 5));
				data.setSoftwareVersion(RegisterConverterUtil.getRegisterDataAsString(registerData, 25, 5));
				data.setNumberOfConnectors(RegisterConverterUtil.getRegisterDataAsInt16(registerData, 30));

				callback(data);
			})
			.catch(function (...args) {
				console.error(args);
			})
	}

	public async fetchConnectorInfoData(num : number, callback: (num : number, data : ChargerConnectorInfoData) => void) : Promise<void>
	{
		this.client.readInputRegisters(1022 + (num-1) * 100, 8)
			.then(function (resp) {

				const data = new ChargerConnectorInfoData();
				const registerData : number[] | Buffer | Uint16Array = resp.response.body.values;

				data.setConnectorType(RegisterConverterUtil.getRegisterDataAsInt16(registerData, 0));
				data.setNumberOfPhases(RegisterConverterUtil.getRegisterDataAsInt16(registerData, 1));
				data.setL1ConnectedToPhase(RegisterConverterUtil.getRegisterDataAsInt16(registerData, 2));
				data.setL2ConnectedToPhase(RegisterConverterUtil.getRegisterDataAsInt16(registerData, 3));
				data.setL3ConnectedToPhase(RegisterConverterUtil.getRegisterDataAsInt16(registerData, 4));
				data.setCustomMaxCurrent(RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 6));

				callback(num, data);
			})
			.catch(function (...args) {
				console.error(args);
			})
	}

	public async fetchConnectorMeasurementData(num : number, callback: (num : number, data : ChargerConnectorMeasurementData) => void) : Promise<void>
	{
		this.client.readInputRegisters(0 + (num-1) * 100, 48)
			.then(function (resp) {

				const data = new ChargerConnectorMeasurementData();
				const registerData : number[] | Buffer | Uint16Array = resp.response.body.values;

				data.setConnectorStatus(RegisterConverterUtil.getRegisterDataAsInt16(registerData, 0));
				data.setMeasuredVehicleNumberOfPhases(RegisterConverterUtil.getRegisterDataAsInt16(registerData, 1));
				data.setEvMaxPhaseCurrent(RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 2));
				data.setTargetCurrentFromPowerMgm(RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 4));
				data.setFrequency(RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 6));
				data.setVoltageL1(RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 8));
				data.setVoltageL2(RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 10));
				data.setVoltageL3(RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 12));
				data.setCurrentL1(RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 14));
				data.setCurrentL2(RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 16));
				data.setCurrentL3(RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 18));
				data.setActivePowerL1(RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 20));
				data.setActivePowerL2(RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 22));
				data.setActivePowerL3(RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 24));
				data.setActivePowerTotal(RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 26));
				data.setPowerFactor(RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 28));
				data.setTotalImportedActiveEnergyInRunningSession(RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 30));
				data.setRunningSessionDuration(RegisterConverterUtil.getRegisterDataAsInt64(registerData, 32));
				data.setRunningSessionDepartureTime(RegisterConverterUtil.getRegisterDataAsInt64(registerData, 36));
				data.setRunningSessionID(RegisterConverterUtil.getRegisterDataAsInt64(registerData, 40));
				data.setEvMaxPower(RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 44));
				data.setEvPlannedEnergy(RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 46));

				callback(num, data);
			})
			.catch(function (...args) {
				console.error(args);
			})
	}

	public async commandStopCharging(connectorNum : number) : Promise<void> {
		this.client.writeSingleRegister(1 + (connectorNum-1) * 100, 0);
	}

	public async commandPauseCharging(connectorNum : number) : Promise<void> {
		this.client.writeSingleRegister(2 + (connectorNum-1) * 100, 0);
	}

	public async commandSetDepartureTime(connectorNum : number, value : number) : Promise<void> {
		const int16Array : number[] = RegisterConverterUtil.int64ToInt16Array(value);
		this.client.writeMultipleRegisters(4 + (connectorNum-1) * 100, int16Array);
	}
	public async commandSetCurrentSetpoint(connectorNum : number, value : number) : Promise<void> {
		const int16Array : number[] = RegisterConverterUtil.float32ToInt16Array(value);
		this.client.writeMultipleRegisters(8 + (connectorNum-1) * 100, int16Array);
	}

	public async commandCancelCurrentSetpoint(connectorNum : number) : Promise<void> {
		this.client.writeSingleRegister(10 + (connectorNum-1) * 100, 0);
	}

	public async commandSetPowerSetpoint(connectorNum : number, value : number) : Promise<void> {
		const int16Array : number[] = RegisterConverterUtil.float32ToInt16Array(value);
		this.client.writeMultipleRegisters(11 + (connectorNum-1) * 100, int16Array);
	}

	public async commandCancelPowerSetpoint(connectorNum : number) : Promise<void> {
		this.client.writeSingleRegister(13 + (connectorNum-1) * 100, 0);
	}

	public async commandRestart() : Promise<void> {
		this.client.writeSingleRegister(1004, 0);
	}

	public async commandSetTime(value : number) : Promise<void> {
		const int16Array : number[] = RegisterConverterUtil.int64ToInt16Array(value);
		this.client.writeMultipleRegisters(1000, int16Array);
	}

}

export { ChargerController };