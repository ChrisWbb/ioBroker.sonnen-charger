class ChargerConnectorMeasurementData {

    private connectorStatus : number = -1;
    private measuredVehicleNumberOfPhases : number = -1;
    private evMaxPhaseCurrent : number = -1;
    private targetCurrentFromPowerMgm : number = -1;
    private frequency : number = -1;
    private voltageL1 : number = -1;
    private voltageL2 : number = -1;
    private voltageL3 : number = -1;
    private currentL1 : number = -1;
    private currentL2 : number = -1;
    private currentL3 : number = -1;
    private activePowerL1 : number = -1;
    private activePowerL2 : number = -1;
    private activePowerL3 : number = -1;
    private activePowerTotal : number = -1;
    private powerFactor : number = -1;
    private totalImportedActiveEnergyInRunningSession : number = -1;
    private runningSessionDuration : number = -1;
    private runningSessionDepartureTime : number = -1;
    private runningSessionID : number = -1;
    private evMaxPower : number = -1;
    private evPlannedEnergy : number = -1;
    
    constructor() {

    } 

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

    public setConnectorStatus(connectorStatus : number) { this.connectorStatus = connectorStatus; }
    public setMeasuredVehicleNumberOfPhases(measuredVehicleNumberOfPhases : number) { this.measuredVehicleNumberOfPhases = measuredVehicleNumberOfPhases; }
    public setEvMaxPhaseCurrent(evMaxPhaseCurrent : number) { this.evMaxPhaseCurrent = evMaxPhaseCurrent; }
    public setTargetCurrentFromPowerMgm(targetCurrentFromPowerMgm : number) { this.targetCurrentFromPowerMgm = targetCurrentFromPowerMgm; }
    public setFrequency(frequency : number) { this.frequency = frequency; }
    public setVoltageL1(voltageL1 : number) { this.voltageL1 = voltageL1; }
    public setVoltageL2(voltageL2 : number) { this.voltageL2 = voltageL2; }
    public setVoltageL3(voltageL3 : number) { this.voltageL3 = voltageL3; }
    public setCurrentL1(currentL1 : number) { this.currentL1 = currentL1; }
    public setCurrentL2(currentL2 : number) { this.currentL2 = currentL2; }
    public setCurrentL3(currentL3 : number) { this.currentL3 = currentL3; }
    public setActivePowerL1(activePowerL1 : number) { this.activePowerL1 = activePowerL1; }
    public setActivePowerL2(activePowerL2 : number) { this.activePowerL2 = activePowerL2; }
    public setActivePowerL3(activePowerL3 : number) { this.activePowerL3 = activePowerL3; }
    public setActivePowerTotal(activePowerTotal : number) { this.activePowerTotal = activePowerTotal; }
    public setPowerFactor(powerFactor : number) { this.powerFactor = powerFactor; }
    public setTotalImportedActiveEnergyInRunningSession(totalImportedActiveEnergyInRunningSession : number) { this.totalImportedActiveEnergyInRunningSession = totalImportedActiveEnergyInRunningSession; }
    public setRunningSessionDuration(runningSessionDuration : number) { this.runningSessionDuration = runningSessionDuration; }
    public setRunningSessionDepartureTime(runningSessionDepartureTime : number) { this.runningSessionDepartureTime = runningSessionDepartureTime; }
    public setRunningSessionID(runningSessionID : number) { this.runningSessionID = runningSessionID; }
    public setEvMaxPower(evMaxPower : number) { this.evMaxPower = evMaxPower; }
    public setEvPlannedEnergy(evPlannedEnergy : number) { this.evPlannedEnergy = evPlannedEnergy; }

    
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