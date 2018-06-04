import events from '../events/events';

export default class EventsHandler {
    constructor() {
        this[events.MOUSE.MOUSE_MOVE] = [];
        this[events.MOUSE.MOUSE_DOWN] = [];
        this[events.KEYBOARD.KEY_PRESS] = [];
        this[events.KEYBOARD.KEY_DOWN] = [];
    }

    handle(event) {
        const handlers = this[event.type];

        if (event.type !== events.MOUSE.MOUSE_MOVE && event.type !== events.KEYBOARD.KEY_PRESS) {
            console.log(event);
        }

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
}
