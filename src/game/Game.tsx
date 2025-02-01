import { useEffect } from "react";
import { PlayerInput, PlayerInputHandler, PlayerInputManager } from "../player-input/player-input";
//import { GameLoop } from "./GameLoop";

function Game() {
	//let gameLoop: GameLoop = new GameLoop();
	const gameDiv = <div id="game"></div>;

	useEffect(() => {
		const playerInput = new PlayerInputManager();
		playerInput.startup();

		const player = document.getElementById("player");
		if (player === null) {
			return;
		}

		let playerPositionX = 0;
		let playerPositionY = 0;
		const screenPositionX = window.innerWidth;
		const screenPositionY = window.innerHeight;

		player.style.left = (screenPositionX/2 - playerPositionX)+"px";
		player.style.top = (screenPositionY/2 - playerPositionY)+"px";

		function updatePlayer(player: HTMLElement) {
			player.style.left = (screenPositionX/2 + playerPositionX)+"px";
			player.style.top = (screenPositionY/2 - playerPositionY)+"px";
		}

		const playerInputHandler1: PlayerInputHandler = {
			input: PlayerInput.Up,
			isOnActivate: true,
			handler: () => {
				//const player = document.getElementById("player");
				if (player !== null) {
					playerPositionY += 10;
					updatePlayer(player);
				}
			}
		};
		playerInput.register(playerInputHandler1);
		const playerInputHandler2: PlayerInputHandler = {
			input: PlayerInput.Down,
			isOnActivate: true,
			handler: () => {
				//const player = document.getElementById("player");
				if (player !== null) {
					playerPositionY -= 10;
					updatePlayer(player);
				}
			}
		};
		playerInput.register(playerInputHandler2);
		const playerInputHandler3: PlayerInputHandler = {
			input: PlayerInput.Right,
			isOnActivate: true,
			handler: () => {
				//const player = document.getElementById("player");
				if (player !== null) {
					playerPositionX += 10;
					updatePlayer(player);
				}
			}
		};
		playerInput.register(playerInputHandler3);
		const playerInputHandler4: PlayerInputHandler = {
			input: PlayerInput.Left,
			isOnActivate: true,
			handler: () => {
				//const player = document.getElementById("player");
				if (player !== null) {
					playerPositionX -= 10;
					updatePlayer(player);
				}
			}
		};
		playerInput.register(playerInputHandler4);

		return () => {
			playerInput.shutdown();
			playerInput.unregister(playerInputHandler1);
			playerInput.unregister(playerInputHandler2);
			playerInput.unregister(playerInputHandler3);
			playerInput.unregister(playerInputHandler4);
		}
	}, []);

	return (
		<>
			{gameDiv}
		</>
	)
}

export default Game;