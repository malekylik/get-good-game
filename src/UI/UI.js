import events from '../event/events/events';

export default class UI {
    constructor(canvas) {
        this.selected = null;
        this.hovered = null;
        this.uiComponents = [];
        this.tabTree = []; 

        this.tabIndex = -1;
        this.canvas = canvas;
    }

    updateTabTree() {
        this.tabTree = [];

        for (let scene of this.uiComponents) {
            scene.traverse((o) => {
                if (o.tabable) {
                    this.tabTree.push(o);
                }
            });
        }

        this.tabIndex = this.tabTree.indexOf(this.selected);
    }

    resetCursorToArrow() {
        if (this.canvas.style.cursor !== 'auto') {
            this.canvas.style.cursor = 'auto';
        }
    }

    getMostDeepElement(elements) {
        let mostDepth = 0;
        let index = -1;

        elements.forEach(({ depth }, i) => {
            if (depth >= mostDepth) {
                mostDepth = depth;
                index = i;
            };
        });
        
        return elements[index].o;
    }

    changeHoveredElement(element) {
        if (this.hovered !== null) {
            this.hovered.handlers.handle({
                ...event,
                type: events.MOUSE.MOUSE_LEAVE,
                target: this.hovered,
                relatedTarget: element
            });

            this.hovered.setHovered(false);
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

    changeSelectedElement(element) {
        if (this.selected) {
            this.selected.isSelected = false;
        }

        this.selected = element;

        if (element !== null) {
            element.isSelected = true;
        }

        this.tabIndex = this.tabTree.indexOf(this.selected);
    }

    dropUI() {
        this.uiComponents = [];
        this.changeSelectedElement(null);
    }

    handleMouseEvent(event) {
        for (let scene of this.uiComponents) {
            const elements = scene.checkForCollision({ ...event.payload.mouseCoord, width: 1, height: 1 }); 

            let element = null;

            if (elements !== null) {                  
                element = this.getMostDeepElement(elements);
                event.target = element;
            } else {
                this.resetCursorToArrow();
            }

            if (this.hovered !== element) {
                this.changeHoveredElement(element);
            }

            if (event.type === events.MOUSE.MOUSE_UP || event.type === events.MOUSE.MOUSE_DOWN) {
                if (this.selected !== element) {
                    this.changeSelectedElement(element);
                }
            }

            if (element !== null) {
                elements.sort((l, r) => r.depth - l.depth);

                elements.forEach(({ o }) => {
                    o.handlers.handle(event);
                });
            }
        }
    }

    handleKeyboardEvent(event) {
        const selected = this.selected;

        event.target = selected;
        selected.handlers.handle(event);

        let parent = selected.getParentComponent();

        while (parent !== null) {
            parent.handlers.handle(event);

            parent = parent.getParentComponent();
        }
    }
 
    handleEvent(event) {
        event.cancelBubble = false;
        
        if (events[event.subtype] === events.MOUSE) {
            this.handleMouseEvent(event);
        }

        if (events[event.subtype] === events.KEYBOARD) {
            if (event.payload.key === 'Tab') {
                this.setNextSelectedElement();
            } else if (this.selected) {
                this.handleKeyboardEvent(event);
            } 
        } 
    }

    setNextSelectedElement() {
        const next = this.tabTree[(this.tabIndex + 1) % this.tabTree.length] || null;

        if (next !== null) {
            this.changeSelectedElement(next);
        }
    }

    add(component) {
        this.uiComponents.push(component);

        this.updateTabTree();
    }

    remove(component) {
        const index = this.uiComponents.indexOf(component);

        if (~index) {
            this.uiComponents.splice(index, 1);
            this.updateTabTree();
        }
    }
}
