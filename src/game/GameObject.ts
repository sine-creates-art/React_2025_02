import { IGameObject } from "./IGameObject";

export class GameObject implements IGameObject {
	public update(dT: number): void {
		if (dT < 0) {
			console.log("This is impossible! (update)");
		}
	}

	public render(dT: number): void {
		if (dT < 0) {
			console.log("This is impossible! (render)");
		}
		
	}
}