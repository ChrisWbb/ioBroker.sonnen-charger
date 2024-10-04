// This file extends the AdapterConfig type from "@types/iobroker"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
	namespace ioBroker {
		interface AdapterConfig {
			serverIp: string;
			serverPort: number;
			interval: number;
			allowWriteAccess: boolean;
			activateChargerControl: boolean;
			id_production: string;
			id_total_consumption: string;
			id_battery_soc: string;
			id_battery_em_soc: string;
			disableDepartureTime: boolean;
		}
	}
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};
