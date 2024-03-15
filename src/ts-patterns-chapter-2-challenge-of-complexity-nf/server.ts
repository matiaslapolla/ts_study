import { SyncingRequest } from "./client";

export interface DataStore {
	timestamp: number;
	data: string;
}

export interface ServerDataItem {
	id: string;
	value: string;
	timestamp: number;
	lastModifiedTime: number;
}

export interface ServerDataStore {
	[id: string]: ServerDataItem[];
}

export interface Syncingresponse {
	timestamp: number;
	changes: {
		[id: string]: ServerDataItem[];
	};
}

export interface ServerChangeMap {
	[id: string]: ServerDataItem[];
}

export class Server {
	store: ServerDataStore = Object.create(null);

	synchronize(request: SyncingRequest): Syncingresponse {
		let lastTimestamp = request.timestamp;
		let now = Date.now();
		let serverChanges: ServerChangeMap = Object.create(null);
		let clientChanges = request.changes;
		let items = this.store.items;

		for (const id of Object.keys(clientChanges)) {
			let clientChange = clientChanges[id];
			if (
				Object.hasOwnProperty.call(items, id) &&
				items[id].lastModifiedTime > clientChange.lastModifiedTime
			) {
				continue;
			}
			items[id] = {
				id,
				value: clientChange.value,
				timestamp: now,
				lastModifiedTime: clientChange.lastModifiedTime,
			};
		}

		for (let id of Object.keys(items)) {
			let item: any = items[id];
			if (item.timestamp > lastTimestamp) {
				serverChanges[id] = item;
			}
		}

		return {
			timestamp: now,
			changes: serverChanges,
		};
	}

	getData(timestamp: number): DataStore | undefined {
		let items: ServerDataItem[] = [];

		for (let id in this.store) {
			let item = this.store[id];
			items.push(...item);
		}

		return {
			timestamp,
			data: items.map((item) => item.value),
		};
	}
}
