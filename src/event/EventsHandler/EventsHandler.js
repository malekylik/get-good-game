import events from '../events/events';

export default class EventsHandler {
    constructor() {
        this[events.MOUSE.MOUSE_MOVE] = [];
        this[events.MOUSE.MOUSE_UP] = [];
        this[events.MOUSE.MOUSE_DOWN] = [];
        this[events.MOUSE.MOUSE_ENTER] = [];
        this[events.MOUSE.MOUSE_LEAVE] = [];
        this[events.KEYBOARD.KEY_PRESS] = [];
        this[events.KEYBOARD.KEY_DOWN] = [];
        this[events.ANIMATION.ANIMATION_END] = [];
    }

    handle(event) {
        const handlers = this[event.type];

        if (handlers) {
            for (let handler of handlers) {
                handler(event);
            }
        }
    }

    addEventListener(name, event) {
        if (this[name]) {
            this[name].push(event);
        }
    }

    removeEventListener(name, event) {
        if (this[name]) {
            const index = this[name].findIndex(registeredEvent => registeredEvent === event);

            if (~index) {
                this[name].splice(index, 1);
            }
        }
    }
}
