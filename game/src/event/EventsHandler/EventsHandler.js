import events from '../events/events';

export default class EventsHandler {
    constructor() {
        this[events.MOUSE.MOUSE_MOVE] = [];
    }

    handle(event) {
        const handlers = this[event.type];

        if (event.type !== events.MOUSE.MOUSE_MOVE) {
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
