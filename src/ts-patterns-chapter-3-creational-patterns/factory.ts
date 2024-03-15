// factory pattern

interface RocketFactory {
	createRocket(): Rocket;
	createPayload(): Payload;
	createStages(): Array<Stage>;
}

class Rocket {
	private static payload: Payload;
	private static stages: Array<Stage>;

	constructor() {}

	launch(): void {
		console.log("Rocket launched");

		Rocket.stages.forEach((stage) => {
			stage.ignite();
		});

		Rocket.payload.deploy();
	}

	setPayload(payload: Payload): void {
		Rocket.payload = payload;
	}

	setStages(stages: Array<Stage>): void {
		Rocket.stages = stages;
	}
}

class Payload {
	private id: number;

	constructor(id: number) {
		this.id = id;
	}

	deploy(): void {
		console.log("Payload deployed");
	}

	getId(): number {
		return this.id;
	}
}

class Stage {
	private name: string;
	private engines: Array<Engine>;

	constructor(name: string, engines: Array<Engine>) {
		this.name = name;
		this.engines = engines;
	}

	ignite(): void {
		console.log(this.name, " Stage ignited");
		this.engines.forEach((engine) => {
			engine.start();
		});
	}
}

class Engine {
	private id: number;
	private load: number;

	constructor(id: number, load: number) {
		this.id = id;
		this.load = load;
	}

	start(): void {
		console.log("Engine started - ", this.id);
		console.log("Engine load - ", this.load);
	}

	getId(): number {
		return this.id;
	}
}

class RocketFactory implements RocketFactory {
	buildRocket(): Rocket {
		let rocket = this.createRocket();

		let payload = this.createPayload();
		let stages = this.createStages();

		rocket.setPayload(payload);
		rocket.setStages(stages);

		return rocket;
	}

	createPayload(): Payload {
		return new Payload(Date.now());
	}

	createStages(): Array<Stage> {
		return [
			new Stage("land", [new Engine(1, 234234), new Engine(2, 1564600)]),
			new Stage("sea", [new Engine(1, 102340), new Engine(2, 1326500)]),
			new Stage("air", [new Engine(1, 12300), new Engine(2, 104340)]),
		];
	}

	createRocket(): Rocket {
		return new Rocket();
	}
}

class Satellite extends Payload {
	constructor(id: number) {
		super(id);
	}

	deploy(): void {
		console.log("Satellite deployed - Id: ", this.getId());
	}
}

class FirstStage extends Stage {
	constructor(name: string) {
		super(name, [new Engine(1, 12300), new Engine(2, 104340)]);
	}

	ignite(): void {
		console.log("First Stage ignited");
	}
}

class SecondStage extends Stage {
	constructor(name: string) {
		super(name, [new Engine(1, 412300), new Engine(2, 1043410)]);
	}

	ignite(): void {
		console.log("Second Stage ignited");
	}
}

const spaceXFactory = new RocketFactory();
const rocket = spaceXFactory.createRocket();

rocket.launch();

type FreightRocketStages = [FirstStage, SecondStage];

class FreightRocketFactory extends RocketFactory {
	nextSatelliteId: number = 0;

	createPayload(): Satellite {
		return new Satellite(this.nextSatelliteId++);
	}

	createStages(): FreightRocketStages {
		return [new FirstStage("land"), new SecondStage("sea")];
	}

	static buildRocket(): Rocket {
		const factory = new FreightRocketFactory();
		return factory.buildRocket();
	}
}

type FreightRocket = Rocket & {
	setPayload(payload: Satellite): void;
	setStages(stages: FreightRocketStages): void;
};

let frocket = FreightRocketFactory.buildRocket() as FreightRocket;
