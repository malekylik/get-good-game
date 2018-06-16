import events from '../events/events';

export default class EventsHandler {
    constructor() {
        this[events.MOUSE.MOUSE_MOVE] = [];
        this[events.MOUSE.MOUSE_DOWN] = [];
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
}
