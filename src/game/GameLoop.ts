import { IGameObject } from "./IGameObject";

class GameObjectRegistrationRequest {
	gameObject: IGameObject;
	isRegister: boolean;
	constructor(gameObject: IGameObject, isRegister: boolean) {
		this.gameObject = gameObject;
		this.isRegister = isRegister;
	}
}

export class GameLoop {
	private gameObjectsInLoop: IGameObject[] = [];
	private gameObjectRegistrationRequests: GameObjectRegistrationRequest[] = [];

	/* timing */
	fps = 60; // not enforced; rAF determines render FPS from monitor
	dT_physics = 1000/(2*this.fps);

	/* game loop */
	T1: number;
	T2: number;
	accumulator: number;
	get dT_render() {
		return this.T2 - this.T1; // frame time, time since last call (monitor FPS)
	}

	constructor() {
		this.T1 = -1;
		this.T2 = -1;
		this.accumulator = 0;
	}

	run() {
		window.requestAnimationFrame(this.run);
		this.T1 = (this.T2 > 0) ? this.T2 : window.performance.now();
		this.T2 = window.performance.now();

		this.accumulator += this.dT_render;
		// take as many dT seconds as necessary to get to within dT of msPerFrame
		while (this.accumulator >= this.dT_physics) {
			// previous state = current state
			// PHYSICS / GAME UPDATE @ current state w/ T, DT
			for (const gameObject of this.gameObjectsInLoop) {
				gameObject.update(this.dT_physics);
			}
			this.accumulator -= this.dT_physics;
		}
		// const alpha = accumulator / dT_physics;

		// RENDER
		// render state = previous state * (1 - alpha) + current state * alpha;
		for (const gameObject of this.gameObjectsInLoop) {
			gameObject.render(this.dT_render);
		}

		// MODIFY REGISTERED GAME OBJECTS
		const gameObjectRegistrationRequests: GameObjectRegistrationRequest[] = [...this.gameObjectRegistrationRequests];
		gameObjectRegistrationRequests.forEach((request: GameObjectRegistrationRequest) => {
			const gameObject: IGameObject = request.gameObject;
			if (request.isRegister) {
				if (this.gameObjectsInLoop.includes(gameObject)) {
					return;
				}
				this.gameObjectsInLoop.push(gameObject);
			} else {
				const index = this.gameObjectsInLoop.indexOf(gameObject, 0);
				if (index == -1) {
					return;
				}
				this.gameObjectsInLoop.splice(index, 1);
			}
		});
		this.gameObjectRegistrationRequests = [];
	}

	register(gameObject: IGameObject): void {
		const request = new GameObjectRegistrationRequest(gameObject, true);
		this.gameObjectRegistrationRequests.push(request);
	}

	unregister(gameObject: IGameObject): void {
		const request = new GameObjectRegistrationRequest(gameObject, false);
		this.gameObjectRegistrationRequests.push(request);
	}
}
