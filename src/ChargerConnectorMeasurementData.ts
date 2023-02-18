class ChargerConnectorMeasurementData {

	private connectorStatus  = -1;
	private measuredVehicleNumberOfPhases  = -1;
	private evMaxPhaseCurrent  = -1;
	private targetCurrentFromPowerMgm  = -1;
	private frequency  = -1;
	private voltageL1  = -1;
	private voltageL2  = -1;
	private voltageL3  = -1;
	private currentL1  = -1;
	private currentL2  = -1;
	private currentL3  = -1;
	private activePowerL1  = -1;
	private activePowerL2  = -1;
	private activePowerL3  = -1;
	private activePowerTotal  = -1;
	private powerFactor  = -1;
	private totalImportedActiveEnergyInRunningSession  = -1;
	private runningSessionDuration  = -1;
	private runningSessionDepartureTime  = -1;
	private runningSessionID  = -1;
	private evMaxPower  = -1;
	private evPlannedEnergy  = -1;


	private decodeConnectorStatus(value : number): string  {
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

	private decodeVehicleNumberOfPhases(value : number) : string  {
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

	public setConnectorStatus(connectorStatus : number): void { this.connectorStatus = connectorStatus; }
	public setMeasuredVehicleNumberOfPhases(measuredVehicleNumberOfPhases : number): void { this.measuredVehicleNumberOfPhases = measuredVehicleNumberOfPhases; }
	public setEvMaxPhaseCurrent(evMaxPhaseCurrent : number): void { this.evMaxPhaseCurrent = evMaxPhaseCurrent; }
	public setTargetCurrentFromPowerMgm(targetCurrentFromPowerMgm : number): void { this.targetCurrentFromPowerMgm = targetCurrentFromPowerMgm; }
	public setFrequency(frequency : number): void { this.frequency = frequency; }
	public setVoltageL1(voltageL1 : number): void { this.voltageL1 = voltageL1; }
	public setVoltageL2(voltageL2 : number): void { this.voltageL2 = voltageL2; }
	public setVoltageL3(voltageL3 : number): void { this.voltageL3 = voltageL3; }
	public setCurrentL1(currentL1 : number): void { this.currentL1 = currentL1; }
	public setCurrentL2(currentL2 : number): void { this.currentL2 = currentL2; }
	public setCurrentL3(currentL3 : number): void { this.currentL3 = currentL3; }
	public setActivePowerL1(activePowerL1 : number): void { this.activePowerL1 = activePowerL1; }
	public setActivePowerL2(activePowerL2 : number): void { this.activePowerL2 = activePowerL2; }
	public setActivePowerL3(activePowerL3 : number): void { this.activePowerL3 = activePowerL3; }
	public setActivePowerTotal(activePowerTotal : number): void { this.activePowerTotal = activePowerTotal; }
	public setPowerFactor(powerFactor : number): void { this.powerFactor = powerFactor; }
	public setTotalImportedActiveEnergyInRunningSession(totalImportedActiveEnergyInRunningSession : number): void { this.totalImportedActiveEnergyInRunningSession = totalImportedActiveEnergyInRunningSession; }
	public setRunningSessionDuration(runningSessionDuration : number): void { this.runningSessionDuration = runningSessionDuration; }
	public setRunningSessionDepartureTime(runningSessionDepartureTime : number): void { this.runningSessionDepartureTime = runningSessionDepartureTime; }
	public setRunningSessionID(runningSessionID : number): void { this.runningSessionID = runningSessionID; }
	public setEvMaxPower(evMaxPower : number): void { this.evMaxPower = evMaxPower; }
	public setEvPlannedEnergy(evPlannedEnergy : number): void { this.evPlannedEnergy = evPlannedEnergy; }


	/* getter */

	public getConnectorStatus() : number { return this.connectorStatus; }
	public getMeasuredVehicleNumberOfPhases() : number { return this.measuredVehicleNumberOfPhases; }
	public getEvMaxPhaseCurrent() : number { return this.evMaxPhaseCurrent; }
	public getTargetCurrentFromPowerMgm() : number { return this.targetCurrentFromPowerMgm; }
	public getFrequency() : number { return this.frequency; }
	public getVoltageL1() : number { return this.voltageL1; }
	public getVoltageL2() : number { return this.voltageL2; }
	public getVoltageL3() : number { return this.voltageL3; }
	public getCurrentL1() : number { return this.currentL1; }
	public getCurrentL2() : number { return this.currentL2; }
	public getCurrentL3() : number { return this.currentL3; }
	public getActivePowerL1() : number { return this.activePowerL1; }
	public getActivePowerL2() : number { return this.activePowerL2; }
	public getActivePowerL3() : number { return this.activePowerL3; }
	public getActivePowerTotal() : number { return this.activePowerTotal; }
	public getPowerFactor() : number { return this.powerFactor; }
	public getTotalImportedActiveEnergyInRunningSession() : number { return this.totalImportedActiveEnergyInRunningSession; }
	public getRunningSessionDuration() : number { return this.runningSessionDuration; }
	public getRunningSessionDepartureTime() : number { return this.runningSessionDepartureTime; }
	public getRunningSessionID() : number { return this.runningSessionID; }
	public getEvMaxPower() : number { return this.evMaxPower; }
	public getEvPlannedEnergy() : number { return this.evPlannedEnergy; }

	public getConnectorStatusAsString() : string { return this.decodeConnectorStatus(this.connectorStatus); }
	public getMeasuredVehicleNumberOfPhasesAsString() : string { return this.decodeVehicleNumberOfPhases(this.measuredVehicleNumberOfPhases); }
}

export {ChargerConnectorMeasurementData}