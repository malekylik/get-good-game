import { merge } from 'lodash';

import Collision from '../../Collision/Collision';
import Animatable from '../../Animation/Animatable';
import EventsHandler from '../../event/EventsHandler/EventsHandler';
import events from '../../event/events/events';

export class Component {
    constructor(top = 0, left = 0, width = 0, height = 0, parentComponent = null) {
        this.parentComponent = parentComponent;

        this.properties = {};

        this.properties.drawBorder = false;
        this.properties.overflow = 'visible';
        this.hovered = false;

        this.properties.color = {
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: '#000000',
        };

        this.properties.cursor = 'auto';

        this.collision = new Collision();
        this.animations = new Animatable(this);

        this.handlers = new EventsHandler();
        this.handlers.addEventListener(events.MOUSE.MOUSE_MOVE, this.handleHover.bind(this));
        
        this.setBoundingClientRect(top, left, width, height);

        this.hoverProperties = {};

        merge(this.hoverProperties, this.properties);

    }

    traverse(callback) {
    }

    handleHover(e) {
        const c = e.target;
        const canvasHTML = document.querySelector('canvas');
        if (canvasHTML.style.cursor !== c.properties.cursor) {
            canvasHTML.style.cursor = c.properties.cursor;
        }

        if (c.hovered !== true) {
            c.hovered = true;
        }
    }

    getBoundingClientRect() {
        return this.animations.animatedProperties.boundingClientRect;
    }

    getClippedBoundingClientRect() {
        return this.animations.animatedProperties.clippedBoundingClientRect;
    }

    setBoundingClientRect(top = 0, left = 0, width = 0, height = 0) {
        this.properties.boundingClientRect = {
            top,
            left,
            width,
            height,
            right: left + width,
            bottom: top + height
        };

        this.animations.animatedProperties.boundingClientRect = {};
        merge(this.animations.animatedProperties.boundingClientRect, this.properties.boundingClientRect);

        this.calculateClippedSize(this.properties.overflow);
    }

    setBoundingClippedClientRect(top = 0, left = 0, width = 0, height = 0) {
        this.properties.clippedBoundingClientRect = {
            top,
            left,
            width,
            height,
            right: left + width,
            bottom: top + height
        };

        this.animations.animatedProperties.clippedBoundingClientRect = {};
        merge(this.animations.animatedProperties.clippedBoundingClientRect, this.properties.clippedBoundingClientRect);
    }

    setBackgroundColor(color = '#000000') {
        this.properties.color.backgroundColor = color;
        this.hoverProperties.color.backgroundColor = color;
        this.animations.animatedProperties.color.backgroundColor = color;
    }

    setBorderColor(color = '#000000') {
        this.properties.color.borderColor = color;
        this.hoverProperties.color.borderColor = color;
        this.animations.animatedProperties.color.borderColor = color;
    }

    setParentComponent(parentComponent) {
        this.parentComponent = parentComponent;
    }

    setOverflow(overflow) {
        this.properties.overflow = overflow;
        this.hoverProperties.overflow = overflow;
        this.animations.animatedProperties.overflow = overflow;
        this.calculateClippedSize(overflow);
    }

    calculateClippedSize(overflow) {
        this.traverse((o) => {
            const parent = o.getParentComponent();

            let { top, right, bottom, left } = o.getBoundingClientRect();
                if (parent !== null) {
                    const parentBox = parent.getClippedBoundingClientRect();
    
                    if (left < 0) {
                        left = 0;
                    }
        
                    if (top < 0) {
                        top = 0;
                    }
        
                    if (parentBox.width < right) {
                        right = parentBox.width;
                    }
        
                    if (parentBox.height < bottom) {
                        bottom = parentBox.height;
                    }
                } 

            o.setBoundingClippedClientRect(top, left, Math.abs(right - left), Math.abs(bottom - top));
        });
    }

    getParentComponent() {
        return this.parentComponent;
    }

    getOverflow() {
        return this.properties.overflow;
    }

    addComponent(component) {

    }

    removeComponent(component) {

    }

    setContextProperties(context, elapseTime) {
        this.animations.animate(context, this, elapseTime);
    }

    paintComponent(context, elapseTime) {
        context.save();
        let { top, left, width, height } = this.getClippedBoundingClientRect();
        let color = this.animations.animatedProperties.color;
                
        if (this.drawBorder) {
            context.strokeStyle = color.borderColor;
            context.strokeRect(left, top, width, height);
        }

        context.fillStyle = color.backgroundColor;
        context.fillRect(left, top, width, height);
        context.restore();
    }

    drawComponent(context, elapseTime) {
        context.save();

        this.setContextProperties(context, elapseTime);
        this.paintComponent(context, elapseTime);

        context.restore();
    }

    draw(context, elapseTime) {
        context.save();
        
        let { top, left, width, height } = this.getClippedBoundingClientRect();
        const parent = this.getParentComponent();

        if (parent !== null) {
            context.translate(parent.getClippedBoundingClientRect().left, parent.getClippedBoundingClientRect().top);
        }

        this.drawComponent(context, elapseTime);

        if (this.children) {
            for (let o of this.children) {
                o.draw(context, elapseTime);
            }
        }

        context.restore();
    }
}

export class CompositeComponent extends Component {
    constructor(top = 0, left = 0, width = 0, height = 0, parentComponent = null) {
        super(top, left, width, height, parentComponent);

        this.children = [];
    }

    addComponent(component) {
        component.setParentComponent(this);
        this.children.push(component);
    }

    removeComponent(component) {
        const index = this.children.indexOf(component);

        if ((~index) !== 0) {
            this.children.splice(index, 1);
            return true;
        }

        return false;
    }

    traverse(callback) {
        callback(this);

        if (this.children) {
            for (let o of this.children) {
                if (o.traverse) {
                    o.traverse(callback);
                } else {
                    callback(o);
                }
            } 
        } 
    }

    checkForCollision(objectMetric) {
        const elementInside = [];
        let biggestDepth = 1;

        this.traverse((o) => {
            const { top, left, width, height } = o.getClippedBoundingClientRect();
            const oCoord = {
                width,
                height
            };

            let absoluteTop = top;
            let absoluteLeft = left;

            let depth = 1;

            let parent = o.getParentComponent();

            while (parent !== null) {
                const { top, left } = parent.getClippedBoundingClientRect();
                
                absoluteTop += top;
                absoluteLeft += left;

                depth += 1;

                parent = parent.getParentComponent();
            }

            oCoord.top = absoluteTop;
            oCoord.left = absoluteLeft;

            if (this.collision.isInside(oCoord, objectMetric)) {
                elementInside.push({
                    o,
                    depth
                });

                if (depth > biggestDepth) {
                    biggestDepth = depth;
                }
            }
        });

        if (elementInside.length !== 0) {
            return elementInside;
        }

        return null;
    }
}
