import { IGameObject } from "../game/IGameObject";

class Player implements IGameObject {
	player: JSX.Element;

	constructor(gameJSXElement: JSX.Element) {
		this.player = <div id="player"></div>;
		gameJSXElement.props
		document.getElementById(gameId)?.appendChild(this.player);
	}

	update(dT: number): void {
		// update position
		console.log(dT);
	}

	render(dT: number): void {
		// update CSS
		console.log(dT);
	}
}

export default Player;