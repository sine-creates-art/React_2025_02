/* https://www.davideaversa.it/blog/simple-event-system-typescript/ */
export interface IAsyncSignal<S, T> {
    bind(listener: string, handler: (source: S, data: T) => Promise<void>): void;
    unbind(listener: string): void;
}

export interface SignalBindingAsync<S, T> {
    listener?: string;
    handler: (source: S, data: T) => Promise<void>;
}

export class AsyncSignal<S, T> implements IAsyncSignal<S, T> {
    private handlers: Array<SignalBindingAsync<S, T>> = [];

    public bind(
        listener: string,
        handler: (source: S, data: T) => Promise<void>,
    ): void {
        if (this.contains(listener)) {
            this.unbind(listener);
        }
        this.handlers.push({ listener, handler });
    }

    public unbind(listener: string): void {
        this.handlers = this.handlers.filter(h => h.listener !== listener);
    }

    public async trigger(source: S, data: T): Promise<void> {
        this.handlers.slice(0).map(h => h.handler(source, data));
    }

    public async triggerAwait(source: S, data: T): Promise<void> {
        const promises = this.handlers.slice(0).map(h => h.handler(source, data));
        await Promise.all(promises);
    }

    public contains(listener: string): boolean {
        return this.handlers.some(h => h.listener === listener);
    }

    public expose(): IAsyncSignal<S, T> {
        return this;
    }
}