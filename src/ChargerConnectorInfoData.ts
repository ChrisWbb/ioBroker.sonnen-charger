class ChargerConnectorInfoData {

	private connectorType  = -1;
	private numberOfPhases  = -1;
	private l1ConnectedToPhase  = -1;
	private l2ConnectedToPhase  = -1;
	private l3ConnectedToPhase  = -1;
	private customMaxCurrent  = -1;


	private decodeConnectorType(value : number) : string {
		switch (value) {
			case 1:
				return "SocketType2";
			case 2:
				return "PlugType2";
		}
		return "";
	}

	/* setter */

	public setConnectorType(connectorType : number): void { this.connectorType = connectorType; }
	public setNumberOfPhases(numberOfPhases : number): void { this.numberOfPhases = numberOfPhases; }
	public setL1ConnectedToPhase(l1ConnectedToPhase : number): void { this.l1ConnectedToPhase = l1ConnectedToPhase; }
	public setL2ConnectedToPhase(l2ConnectedToPhase : number): void { this.l2ConnectedToPhase = l2ConnectedToPhase; }
	public setL3ConnectedToPhase(l3ConnectedToPhase : number): void { this.l3ConnectedToPhase = l3ConnectedToPhase; }
	public setCustomMaxCurrent(customMaxCurrent : number): void { this.customMaxCurrent = customMaxCurrent; }

	/* getter */

	public getConnectorType() : number { return this.connectorType; }
	public getNumberOfPhases() : number { return this.numberOfPhases; }
	public getL1ConnectedToPhase() : number { return this.l1ConnectedToPhase; }
	public getL2ConnectedToPhase() : number { return this.l2ConnectedToPhase; }
	public getL3ConnectedToPhase() : number { return this.l3ConnectedToPhase; }
	public getCustomMaxCurrent() : number { return this.customMaxCurrent; }

	public getConnectorTypeAsString() : string { return this.decodeConnectorType(this.connectorType); }
}

export {ChargerConnectorInfoData}