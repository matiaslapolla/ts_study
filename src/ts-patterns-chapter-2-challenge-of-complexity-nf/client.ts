import { Server } from "./server";

export interface ClientDataItem {
	id: string;
	value: string;
}

export interface ClientDataStore {
	timestamp: number;
	items: {
		[id: string]: ClientDataItem[];
	};
	changed: {
		[id: string]: number;
	};
}

export interface SyncingRequest {
	timestamp: number;
	changes: {
		[id: string]: ClientChange;
	};
}

export interface ClientChange {
	lastModifiedTime: number;
	value: string;
}

export interface ClientChangeMap {
	[id: string]: ClientChange;
}

export class Client {
	store: ClientDataStore = {
		changed: Object.create(null),
		timestamp: 0,
		items: Object.create(null),
	};

	constructor(public server: Server) {}

	synchronize(): void {
		let clientItems = this.store.items;
		let clientChanges: ClientChangeMap = Object.create(null);
		let changedTimes = this.store.changed;
		for (let id of Object.keys(clientItems)) {
			let item = clientItems[id];
			let lastModifiedTime = changedTimes[id];
			clientChanges[id] = {
				lastModifiedTime,
				value: item.value,
			};
		}
		let response = this.server.synchronize({
			timestamp: this.store.timestamp,
			changes: clientChanges,
		});
		this.store.changed = Object.create(null);
	}

	update(id: string, value: string[]): void {
		this.store.timestamp = Date.now();
		this.store.items[id] = {
			id,
			value,
		};
		this.store.changed[id] = Date.now();
	}
}
