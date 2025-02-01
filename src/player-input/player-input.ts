export enum PlayerInput {
	Left,
	Right,
	Down,
	Up,
}

type RawInputHandler = {
	key: string;
	handler: (e: KeyboardEvent) => void;
}

export type PlayerInputHandler = {
	input: PlayerInput;
	isOnActivate: boolean;
	handler: () => void;
}

export class PlayerInputManager {
	isRunning = false;

	private keyBindings = new Map<string, PlayerInput>([
		// WASD
		['a', PlayerInput.Left],
		['d', PlayerInput.Right],
		['s', PlayerInput.Down],
		['w', PlayerInput.Up],
		// Arrows
		['ArrowLeft', PlayerInput.Left],
		['ArrowRight', PlayerInput.Right],
		['ArrowDown', PlayerInput.Down],
		['ArrowUp', PlayerInput.Up],
	]);

	private rawInputsPressed = new Map<PlayerInput, string[]>();
	private inputHandlers = new Map<PlayerInput, PlayerInputHandler[]>;

	private rawInputKeyDownHandlers = new Map<string, RawInputHandler>;
	private rawInputKeyUpHandlers = new Map<string, RawInputHandler>;

	constructor() {
		Object.values(PlayerInput).forEach((input: string | PlayerInput) => {
			if (typeof input !== "string") {
				this.rawInputsPressed.set(input, []);
				this.inputHandlers.set(input, []);
			}
		});
	}

	startup(): void {
		if (this.isRunning) {
			return;
		}
		
		// raw inputs -> processed inputs
		this.keyBindings.forEach((input: PlayerInput, key: string) => {
			// define listeners
			const inputKeyDownHandler: RawInputHandler = {
				key: key,
				handler: (e: KeyboardEvent) => {
					if (e.key !== key) {
						return;
					}
					const pressed = this.rawInputsPressed.get(input);
					if (pressed === undefined || pressed.includes(key)) {
						return;
					}
					pressed.push(key);
					if (pressed.length !== 1) {
						return;
					}
					console.log("DOWN: ", input);
					// do the thing... emit that input activated
					const inputHandlers = this.inputHandlers.get(input);
					if (inputHandlers === undefined) {
						return;
					}
					inputHandlers.forEach((playerInputHandler: PlayerInputHandler) => {
						if (playerInputHandler.isOnActivate) {
							playerInputHandler.handler();
						}
					});
				},
			};
			const inputKeyUpHandler: RawInputHandler = {
				key: key,
				handler: (e: KeyboardEvent) => {
					if (e.key !== key) {
						return;
					}
					const pressed = this.rawInputsPressed.get(input);
					if (pressed === undefined || !pressed.includes(key)) {
						return;
					}
					const index = pressed.indexOf(key, 0);
					if (index == -1) {
						return;
					}
					this.rawInputsPressed.get(input)?.splice(index, 1);
					if (pressed.length !== 0) {
						return;
					}
					console.log("UP: ", input);
					const inputHandlers = this.inputHandlers.get(input);
					if (inputHandlers === undefined) {
						return;
					}
					inputHandlers.forEach((playerInputHandler: PlayerInputHandler) => {
						if (!playerInputHandler.isOnActivate) {
							playerInputHandler.handler();
						}
					});
					// do the thing... emit that input deactivated
				},
			};
			
			// hook up listeners
			document.addEventListener('keydown', inputKeyDownHandler.handler);
			document.addEventListener('keyup', inputKeyUpHandler.handler);
			
			// add to list
			this.rawInputKeyDownHandlers.set(key, inputKeyDownHandler);
			this.rawInputKeyUpHandlers.set(key, inputKeyUpHandler);
		});
		this.isRunning = true;
	}

	shutdown(): void {
		if (!this.isRunning) {
			return;
		}

		// disconnect listeners
		this.rawInputKeyDownHandlers.forEach((inputHandler: RawInputHandler) => {
			document.removeEventListener('keydown', inputHandler.handler);
		});
		this.rawInputKeyUpHandlers.forEach((inputHandler: RawInputHandler) => {
			document.removeEventListener('keyup', inputHandler.handler);
		});

		// clear lists
		this.rawInputKeyDownHandlers.clear();
		this.rawInputKeyUpHandlers.clear();

		this.isRunning = false;
	}

	register(playerInputHandler: PlayerInputHandler): void {
		if (!this.isRunning) {
			return;
		}
		const handlers = this.inputHandlers.get(playerInputHandler.input);
		if (handlers === undefined || handlers.includes(playerInputHandler)) {
			return;
		}
		handlers.push(playerInputHandler);
	}

	unregister(playerInputHandler: PlayerInputHandler): void {
		if (!this.isRunning) {
			return;
		}
		const handlers = this.inputHandlers.get(playerInputHandler.input);
		if (handlers === undefined || !handlers.includes(playerInputHandler)) {
			return;
		}
		const index = handlers.indexOf(playerInputHandler, 0);
		if (index == -1) {
			return;
		}
		this.inputHandlers.get(playerInputHandler.input)?.splice(index, 1);
	}
}