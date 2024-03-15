interface af_RocketFactory {
	createRocket(): Rocket;
	createPayload(): Payload;
	createStages(): Array<Stage>;
}

interface af_Rocket {
	payload: Payload;
	stages: Array<Stage>;
}
interface af_Payload {
	weight: number;
}

interface af_Engine {
	ignite(): void;
}

interface af_Stage {
	engine: Array<Engine>;
}

class ExperimentalRocket implements af_Rocket {}

class ExperimentalPayload implements af_Payload {}

class ExperimentalStage implements af_Stage {}

class ExperimentalSatellite implements af_Payload {}

class Client {
	buildRocket(factory: RocketFactory): af_Rocket {
		let rocket = factory.createRocket();
		rocket.payload = factory.createPayload();
		rocket.stages = factory.createStages();
		return rocket;
	}
}

class FreightRocketFactory implements RocketFactory {}

class ExperimentalRocketFactory implements RocketFactory {}
