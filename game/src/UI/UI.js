import events from '../event/events/events';

export default class UI {
    constructor() {
        this.selected = null;
        this.hovered = null;
        this.uiComponents = [];
    }

    handleEvent(event) {
        if (events[event.subtype] === events.MOUSE) {
            for (let scene of this.uiComponents) {
                const elements = scene.checkForCollision({ ...event.payload.mouseCoord, width: 1, height: 1 }); 

                let element = null;
    
                if (elements !== null) {
                    let mostDepth = 0;
                    let index = -1;
            
                    elements.forEach(({ depth }, i) => {
                        if (depth > mostDepth) {
                            mostDepth = depth;
                            index = i;
                        };
                    });
                    
                    element = elements[index].o;
                    event.target = element;
                } else {
                    const canvasHTML = document.querySelector('canvas');
                    if (canvasHTML.style.cursor !== 'auto') {
                        canvasHTML.style.cursor = 'auto';
                    }
                }
    
                if (this.hovered !== element) {
                    if (this.hovered !== null) {
                        this.hovered.handlers.handle({
                            ...event,
                            type: events.MOUSE.MOUSE_LEAVE,
                            target: this.hovered,
                            relatedTarget: element
                        });
                    }
    
                    if (element !== null) {
                        element.handlers.handle({
                            ...event,
                            type: events.MOUSE.MOUSE_ENTER,
                            target: element,
                            relatedTarget: this.hovered,
                        });
                    }
    
                    this.hovered = element;
                }

                if (event.type === events.MOUSE.MOUSE_DOWN) {
                    if (this.selected !== element) {
                        if (this.selected) {
                            this.selected.isSelected = false;
                        }
    
                        this.selected = element;
    
                        if (element !== null) {
                            element.isSelected = true;
                        }
                    }
                }

                if (element !== null) {
                        element.handlers.handle(event);
                }
            }
        }

        if (events[event.subtype] === events.KEYBOARD && this.selected) {
            event.target = this.selected;
            this.selected.handlers.handle(event);
        }
    }

    add(component) {
        this.uiComponents.push(component);
    }
}
