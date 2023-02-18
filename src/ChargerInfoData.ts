class ChargerInfoData {

	private serialNumber  = "";
	private model  = "";
	private hardwareVersion  = "";
	private softwareVersion  = "";
	private numberOfConnectors  = -1;

	/* setter */

	public setSerialNumber(serialNumber : string) : void {
		this.serialNumber = serialNumber;
	}

	public setModel(model : string) : void {
		this.model = model;
	}

	public setHardwareVersion(hardwareVersion : string) : void {
		this.hardwareVersion = hardwareVersion;
	}

	public setSoftwareVersion(softwareVersion : string) : void {
		this.softwareVersion = softwareVersion;
	}

	public setNumberOfConnectors(numberOfConnectors : number) : void {
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