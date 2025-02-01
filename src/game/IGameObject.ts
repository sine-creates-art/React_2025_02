export interface IGameObject {
	update(dT: number): void;
	render(dT: number): void;
}