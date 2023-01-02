class ChargerInfoData {

    private serialNumber : string = "";
    private model : string = "";
    private hardwareVersion : string = "";
    private softwareVersion : string = "";
    private numberOfConnectors : number = -1;
 
    constructor() {

    }

    /* setter */

    public setSerialNumber(serialNumber : string) {
        this.serialNumber = serialNumber;
    }

    public setModel(model : string) {
        this.model = model;
    }

    public setHardwareVersion(hardwareVersion : string) {
        this.hardwareVersion = hardwareVersion;
    }

    public setSoftwareVersion(softwareVersion : string) {
        this.softwareVersion = softwareVersion;
    }

    public setNumberOfConnectors(numberOfConnectors : number) {
        this.numberOfConnectors = numberOfConnectors;
    }

    /* getter */

    public getSerialNumber() : string {
        return this.serialNumber;
    }

    public getModel() : string {
        return this.model;
    }

    public getHardwareVersion() : string {
        return this.hardwareVersion;
    }

    public getSoftwareVersion() : string {
        return this.softwareVersion;
    }

    public getNumberOfConnectors() : number {
        return this.numberOfConnectors;
    }

}

export {ChargerInfoData}