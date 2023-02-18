import { ModbusTCPClient } from "jsmodbus"
import { Socket, SocketConnectOpts } from "net"

import { ChargerInfoData } from "./ChargerInfoData";
import { ChargerConnectorInfoData } from "./ChargerConnectorInfoData";
import { ChargerConnectorMeasurementData } from "./ChargerConnectorMeasurementData";
import  {RegisterConverterUtil } from "./RegisterConverterUtil";

class ChargerController {

	private socket : Socket;
	private client : ModbusTCPClient;

	constructor() {

		this.socket = new Socket();
		this.client = new ModbusTCPClient(this.socket);
	}

	public async testConnect() : Promise<void> {

		try {

			console.info(" ");
			const infoData : ChargerInfoData = await this.fetchChargerInfoData();

			console.info("SerialNumber: "+infoData.getSerialNumber());
			console.info("Model: "+infoData.getModel());
			console.info("HardwareVersion: "+infoData.getHardwareVersion());
			console.info("SoftwareVersion: "+infoData.getSoftwareVersion());

			console.info("NumberOfConnectors: "+infoData.getNumberOfConnectors());

			console.info(" ");
			const connectorInfoData : ChargerConnectorInfoData = await this.fetchConnectorInfoData(1);

			console.info("ConnectorType: "+connectorInfoData.getConnectorTypeAsString());
			console.info("NumberOfPhases: "+connectorInfoData.getNumberOfPhases());
			console.info("L1ConnectedToPhase: "+connectorInfoData.getL1ConnectedToPhase());
			console.info("L2ConnectedToPhase: "+connectorInfoData.getL2ConnectedToPhase());
			console.info("L3ConnectedToPhase: "+connectorInfoData.getL3ConnectedToPhase());
			console.info("CustomMaxCurrent: "+connectorInfoData.getCustomMaxCurrent()+" A");

			console.info(" ");
			const connectorMeasementData : ChargerConnectorMeasurementData = await this.fetchConnectorMeasurementData(1);

			console.info("ConnectorStatus: "+connectorMeasementData.getConnectorStatusAsString());
			console.info("MeasuredVehicleNumberOfPhases: "+connectorMeasementData.getMeasuredVehicleNumberOfPhasesAsString());
			console.info("EvMaxPhaseCurrent: "+connectorMeasementData.getEvMaxPhaseCurrent()+" A");
			console.info("TargetCurrentFromPowerMgm: "+connectorMeasementData.getTargetCurrentFromPowerMgm()+" A");
			console.info("Frequency: "+connectorMeasementData.getFrequency() + " Hz");
			console.info("VoltageL1: "+connectorMeasementData.getVoltageL1() + " V");
			console.info("VoltageL2: "+connectorMeasementData.getVoltageL2() + " V");
			console.info("VoltageL3: "+connectorMeasementData.getVoltageL3() + " V");
			console.info("CurrentL1: "+connectorMeasementData.getCurrentL1() + " A");
			console.info("CurrentL2: "+connectorMeasementData.getCurrentL2() + " A");
			console.info("CurrentL3: "+connectorMeasementData.getCurrentL3() + " A");
			console.info("ActivePowerL1: "+connectorMeasementData.getActivePowerL1() + " kWh");
			console.info("ActivePowerL2: "+connectorMeasementData.getActivePowerL2() + " kWh");
			console.info("ActivePowerL3: "+connectorMeasementData.getActivePowerL3() + " kWh");
			console.info("ActivePowerTotal: "+connectorMeasementData.getActivePowerTotal() + " kWh");
			console.info("PowerFactor: "+connectorMeasementData.getPowerFactor());
			console.info("TotalImportedActiveEnergyInRunningSession: "+connectorMeasementData.getTotalImportedActiveEnergyInRunningSession()+ " kWh");
			console.info("RunningSessionDuration: "+connectorMeasementData.getRunningSessionDuration()+ " seconds");
			console.info("RunningSessionDepartureTime: "+connectorMeasementData.getRunningSessionDepartureTime()+ " seconds");
			console.info("RunningSessionID: "+connectorMeasementData.getRunningSessionID());
			console.info("EvMaxPower: "+connectorMeasementData.getEvMaxPower()+ " kW");
			console.info("EvPlannedEnergy: "+connectorMeasementData.getEvPlannedEnergy()+ " kW");

		}
		catch (e) {
			console.log("Error:", e);
		}

	}


	public connect(ipAddress : string, port : number) : void {

		const options: SocketConnectOpts = {
			"host": ipAddress,
			"port": port
		};

		this.socket.on("connect", this.testConnect.bind(this));

		this.socket.connect(options);
	}

	//public on(event: "connect", listener: () => void) {

	//}


	private async fetchInputRegister(start : number, count : number) : Promise<number[]> {

		const result : number[] = new Array<number>();
		await this.client.readInputRegisters(start, count)
			.then(function (resp) {
				//console.log(resp);

				for (let i  =0; i < resp.response.body.values.length; i++)
				{
					result[i] =  resp.response.body.values[i];
				}

				//socket.end();
			}).catch(function (...args) {
				console.error(args);
				//socket.end();
			})

		return result;
	}

	public async fetchChargerInfoData() : Promise<ChargerInfoData>
	{
		const registerData : number[]  =  await this.fetchInputRegister(990, 31);

		const data = new ChargerInfoData();
		data.setSerialNumber(RegisterConverterUtil.getRegisterDataAsString(registerData, 0, 10));
		data.setModel(RegisterConverterUtil.getRegisterDataAsString(registerData, 10, 10));
		data.setHardwareVersion(RegisterConverterUtil.getRegisterDataAsString(registerData, 20, 5));
		data.setSoftwareVersion(RegisterConverterUtil.getRegisterDataAsString(registerData, 25, 5));
		data.setNumberOfConnectors(RegisterConverterUtil.getRegisterDataAsInt16(registerData, 30));

		return data;
	}

	public async fetchConnectorInfoData(num : number) : Promise<ChargerConnectorInfoData>
	{
		const registerData : number[]  =  await this.fetchInputRegister(1022 + (num-1) * 100, 8);

		const data = new ChargerConnectorInfoData();
		data.setConnectorType(RegisterConverterUtil.getRegisterDataAsInt16(registerData, 0));
		data.setNumberOfPhases(RegisterConverterUtil.getRegisterDataAsInt16(registerData, 1));
		data.setL1ConnectedToPhase(RegisterConverterUtil.getRegisterDataAsInt16(registerData, 2));
		data.setL2ConnectedToPhase(RegisterConverterUtil.getRegisterDataAsInt16(registerData, 3));
		data.setL3ConnectedToPhase(RegisterConverterUtil.getRegisterDataAsInt16(registerData, 4));
		data.setCustomMaxCurrent(RegisterConverterUtil.getRegisterDataAsFloat32(registerData, 6));

		return data;
	}

	public async fetchConnectorMeasurementData(num : number) : Promise<ChargerConnectorMeasurementData>
	{
		const registerData : number[]  =  await this.fetchInputRegister(0 + (num-1) * 100, 48);

		const data = new ChargerConnectorMeasurementData();
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

		return data;
	}

}

export { ChargerController };