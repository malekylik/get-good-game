import { merge, uniqueId, get } from 'lodash';

import Collision from '../../Collision/Collision';
import Animatable from '../../Animation/Animatable';
import EventsHandler from '../../event/EventsHandler/EventsHandler';
import events from '../../event/events/events';
import Label from './Label';

import { Component } from './Component';
import { getTextWidthWithCanvas } from '../../utils/textWidth';

export class Component {
    constructor(top = 0, left = 0, width = 0, height = 0, parentComponent = null, name) {
        this.parentComponent = parentComponent;

        this.properties = {};

        this.properties.drawBorder = false;
        this.properties.overflow = 'visible';
        this.hovered = false;

        this.properties.color = {
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: '#000000',
        };

        this.backgroundImage = null;

        this.properties.top = top;
        this.properties.left = left;
        this.properties.width = width;
        this.properties.height = height;

        this.properties.cursor = 'auto';

        this.collision = new Collision();
        this.animations = new Animatable(this);

        this.handlers = new EventsHandler();
        this.handlers.addEventListener(events.MOUSE.MOUSE_MOVE, this.handleHover);
        
        ({ top, left, width, height } = this.convertFromPercentageToPixel(top, left, width, height));

        this.hoverProperties = {};

        merge(this.hoverProperties, this.properties);

        this.setBoundingClientRect(top, left, width, height);

        this.scrollXOffset = 0;
        this.scrollYOffset = 0;

        if (parentComponent !== null) {
            parentComponent.addComponent(this, name);
            merge(this.initialBoundingClientRect, this.properties.boundingClientRect);
        } else {
            this.initialBoundingClientRect = {};
            merge(this.initialBoundingClientRect, this.properties.boundingClientRect);
        }
    }

    addEventListener(name, event) {
        this.handlers.addEventListener(name, event)
    }

    convertFromPercentageToPixel(top, left, width, height) {
        const parent = this.getParentComponent();
        let parentWidth, parentHeight;
        const reg = /%/;
        const floor = Math.floor;

        if (parent === null) {
            parentWidth = window.innerWidth;
            parentHeight = window.innerHeight;
        } else {
            ({ width: parentWidth, height: parentHeight } = parent.getBoundingClientRect());
        }

        if (typeof top === 'string' && reg.test(top)) {
            top = floor(parseFloat(top) / 100 * parentHeight);
        }

        if (typeof left === 'string' && reg.test(left)) {
            left = floor(parseFloat(left) / 100 * parentWidth);
        }

        if (typeof width === 'string' && reg.test(width)) {
            width = floor(parseFloat(width) / 100 * parentWidth);
        }
        
        if (typeof height === 'string' && reg.test(height)) {
            height = floor(parseFloat(height) / 100 * parentHeight);
        }

        return {
            top,
            left,
            width,
            height
        };
    }

    traverse(callback) {
        return callback(this);
    }

    alignCenter() {
        const parent = this.getParentComponent();
        let parentWidth = window.innerWidth;
        let parentHeight = window.innerHeight;

        if (parent !== null) {
            ({ width: parentWidth, height: parentHeight } = parent.getBoundingClientRect());
        }

        const { width, height } = this.getBoundingClientRect();

        let centredTop = Math.round((parentHeight - height) / 2);
        let centredLeft = Math.round((parentWidth - width) / 2);

        this.setBoundingClientRect(centredTop, centredLeft, width, height);
    }

    setBackgroundImage(image = null) {
        this.backgroundImage = image;

        const { width, height } = this.getBoundingClientRect();

        this.backgroundImage.setSize(width, height);
    }

    calculateTotalWidthComponent(o, sumPath, sum , index, prop) {
        const value = get(o, prop);
        sumPath[String(index)] = sum + value;
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

    setHovered(hovered) {
        if (this.hovered !== hovered) {
            this.hovered = hovered;

            merge(this.animatedProperties, this.properties);
        }
    }

    setBoundingClientRect(top, left, width, height) {
        const prevBoundingBox = this.getBoundingClientRect();

        let prevTop;
        let prevLeft;
        let prevWidth;
        let prevHeight;

        if (prevBoundingBox) {
            ({ top: prevTop, left: prevLeft, width: prevWidth, height: prevHeight } = prevBoundingBox);
        }

        if (prevBoundingBox && typeof top !== "number") {
            top = prevTop;
        }

        if (prevBoundingBox && typeof left !== "number") {
            left = prevLeft;
        }

        if (prevBoundingBox && typeof width !== "number") {
            width = prevWidth;
        }

        if (prevBoundingBox && typeof height !== "number") {
            height = prevHeight;
        }

        this.properties.top = top;
        this.properties.left = left;
        this.properties.width = width;
        this.properties.height = height;

        this.properties.boundingClientRect = {
            top,
            left,
            width,
            height,
            right: left + width,
            bottom: top + height
        };

        this.animations.animatedProperties.boundingClientRect = {};
        this.hoverProperties.boundingClientRect = {};
        merge(this.animations.animatedProperties.boundingClientRect, this.properties.boundingClientRect);
        merge(this.hoverProperties.boundingClientRect, this.properties.boundingClientRect);

        // if (this.overflow === 'hidden' && this.overflow === 'scroll') {
        //     this.calculateClippedSize(this.properties.overflow);
        // } else {
        //     this.setBoundingClippedClientRect(top, left, width, height);
        // }
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
        this.hoverProperties.clippedBoundingClientRect = {};
        merge(this.animations.animatedProperties.clippedBoundingClientRect, this.properties.clippedBoundingClientRect);
        merge(this.hoverProperties.clippedBoundingClientRect, this.properties.clippedBoundingClientRect);
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

        let { top, left, width, height } = this.properties;
        ({ top, left, width, height } = this.convertFromPercentageToPixel(top, left, width, height));
        this.setBoundingClientRect(top, left, width, height);
        this.initialBoundingClientRect = {};
        merge(this.initialBoundingClientRect, this.properties.boundingClientRect);
    }

    setOverflow(overflow) {
        this.properties.overflow = overflow;
        this.hoverProperties.overflow = overflow;
        this.animations.animatedProperties.overflow = overflow;

        if (overflow === 'overflow') {
            this.calculateClippedSize();
        }

        if (overflow === 'scroll') {
            const totalHeight = this.calculateTotalHeightComponent();
            const totalWidth = this.calculateTotalWidthComponent();

            const { width, height } = this.getBoundingClientRect();

            if (totalHeight > height) {
                this.scrollY = new ScrollBar('vertical', totalHeight, this);
            }

            if (totalWidth > width) {
                this.scrollX = new ScrollBar('horizontal', totalWidth, this);
            }
        }
    }

    calculateClippedSize() {
        this.traverse((o) => {
            const parent = o.getParentComponent();

            let { top, right, bottom, left } = o.getBoundingClientRect();
                if (parent !== null) {
                    const parentBox = parent.getBoundingClientRect();
    
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
                        if (top > parentBox.top) {
                            bottom = top;
                        } else {
                            bottom = parentBox.height;
                        }
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
        let { top, left, width, height } = this.getBoundingClientRect();
        let color = this.animations.animatedProperties.color;
                
        if (this.drawBorder) {
            context.strokeStyle = color.borderColor;
            context.strokeRect(left, top, width, height);
        }

        context.fillStyle = color.backgroundColor;
        context.fillRect(left, top, width, height);

        if (this.properties.overflow === 'scroll' || this.properties.overflow === 'overflow') {
            const path = new Path2D();
            path.rect(left, top, width, height);
            context.clip(path, "nonzero");
        }

        if (this.backgroundImage !== null) {
            this.backgroundImage.draw(context, left, top);
        }
    }

    drawComponent(context, elapseTime) {
        this.setContextProperties(context, elapseTime);
        this.paintComponent(context, elapseTime);
    }

    draw(context, elapseTime) {
        context.save();
        
        const parent = this.getParentComponent();

        if (parent !== null) {
            context.translate(parent.getBoundingClientRect().left, parent.getBoundingClientRect().top);
        }

        this.drawComponent(context, elapseTime);

        if (this.children) {
            for (let o of this.children) {
                o.component.draw(context, elapseTime);
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

    addComponent(component, name) {
        component.setParentComponent(this);

        if (name !== undefined && typeof name === 'string') {
            this.children.push({
                component,
                name
            });
        } else {
            this.children.push({
                component,
                name: uniqueId('component ')
            });
        }
    }

    removeComponent(component) {
        const index = this.children.findIndex(({ component: childComponent }) => childComponent === component);

        if ((~index) !== 0) {
            this.children.splice(index, 1);
            return true;
        }

        return false;
    }

    getChildComponent(index) {
        if (typeof index === 'number') {
            if (this.children.length < index && index >= 0) {
                return this.children[index].component;
            }
        }

        const child = this.children.find(e => e.name === index);  

        return child ? child.component : null;  
    }

    traverse(callback) {
        const stop = callback(this)
        if (stop) {
            return;
        };

        if (this.children) {
            for (let o of this.children) {
                const { component } = o;
                if (component.traverse) {
                    component.traverse(callback);
                } else {
                    const stop = callback(component)
                    if (stop) {
                        return;
                    };
                }
            } 
        } 
    }

    setScrollYOffer(scrollYOffer) {
        this.scrollYOffset = scrollYOffer;

        this.children.forEach(({ component }) => {
            if (component instanceof ScrollBar) {
                return;
            }

            const { top } = component.initialBoundingClientRect; 
            component.setBoundingClientRect(top + scrollYOffer);
        })

        this.calculateClippedSize();
    }

    setScrollXOffer(scrollXOffer) {
        this.scrollXOffset = scrollXOffer;

        this.children.forEach(({ component }) => {
            if (component instanceof ScrollBar) {
                return;
            }

            const { left } = component.initialBoundingClientRect; 
            component.setBoundingClientRect(undefined, left + scrollXOffer);
        })

        this.calculateClippedSize();
    }

    calculateTotalWidthComponent() {
        if (this.children.length === 0) {
            return null;
        }

        let maxComponent = this.children[0].component;
        const { left, width } = maxComponent.getBoundingClientRect();

        let max = left + width;

        for (let i = 1; i < this.children.length; i++) {
            const component = this.children[i].component;
            let { left, width } = component.getBoundingClientRect();
            
            if (left + width > max) {
               max = left + width;
            }
        }

        return max;
    } 

    calculateTotalHeightComponent() {
        if (this.children.length === 0) {
            return null;
        }

        let maxComponent = this.children[0].component;
        const { top, height } = maxComponent.getBoundingClientRect();

        let max = top + height;

        for (let i = 1; i < this.children.length; i++) {
            const component = this.children[i].component;
            let { top, height } = component.getBoundingClientRect();
            
            if (top + height > max) {
               max = top + height;
            }
        }

        return max;
    } 

    checkForCollision(objectMetric) {
        const elementInside = [];
        let biggestDepth = 1;

        this.traverse((o) => {
            const { top, left, width, height } = o.getBoundingClientRect();
            const oCoord = {
                width,
                height
            };

            let absoluteTop = 0;
            let absoluteLeft = 0;

            let depth = 1;

            let parent = o.getParentComponent();

            const parentOverflow = [];

            while (parent !== null) {
                let { top, left } = parent.getBoundingClientRect();
               
                absoluteTop += top;
                absoluteLeft += left;

                depth += 1;

                if (parent.getOverflow() === 'scroll' || parent.getOverflow() === 'overflow') {
                    parentOverflow.push(parent);
                }

                parent = parent.getParentComponent();
            }

            absoluteTop += top;
            absoluteLeft += left;

            oCoord.top = absoluteTop;
            oCoord.left = absoluteLeft;

            if (parentOverflow.length !== 0) {
                for (let i = 0; i < parentOverflow.length; i++) {
                    let { top, left, width, height } = parentOverflow[i].getBoundingClientRect();

                    let parentTop = top;
                    let parentLeft = left;

                    let p = parentOverflow[i].getParentComponent();

                    while (p !== null) {
                        let { top, left } = p.getBoundingClientRect();
                       
                        parentTop += top;
                        parentLeft += left;
            
                        p = p.getParentComponent();
                    }
 
                    const pBox = {
                        top: parentTop,
                        left: parentLeft,
                        width,
                        height
                    };

                    const isInsideParent = o.collision.isInside(pBox, oCoord);

                    if (!isInsideParent) {
                        return null;
                    }
                }
            }

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

class ScrollBar extends CompositeComponent {
    constructor(orientation, childWidth, parentComponent) {
        const height = 17;

        let parentWidth = window.innerWidth;
        let parentHeight = window.innerHeight;

        if (parentComponent) {
            ({ width: parentWidth, height: parentHeight } = parentComponent.getBoundingClientRect());
        }

        let width;

        if (orientation === 'vertical') {  
            width = parentHeight; 
            super(0, parentWidth - height, height, width, parentComponent);
        } else {
            width = parentWidth; 
            super(parentHeight - height, 0, width, height, parentComponent);
        }

        this.childWidth = childWidth;

        this.setBackgroundColor('#F1F1F1');

        let prevButtonText = String.fromCharCode(parseInt('25c4', 16));
        let nextButtonText = String.fromCharCode(parseInt('25ba', 16));

        if (orientation === 'vertical') {
            prevButtonText = String.fromCharCode(parseInt('25b2', 16));
            nextButtonText = String.fromCharCode(parseInt('25bc', 16));
        }

        this.orientation = orientation

        let nextButton;
        const prevButton = new Button(0, 0, height, height, prevButtonText, this);

        if (orientation === 'vertical') {
            nextButton = new Button(width - 2 * height, 0, height, height, nextButtonText, this);
        } else {
            nextButton = new Button(0, width - 2 * height, height, height, nextButtonText, this);
        }

        prevButton.setBackgroundColor('#F1F1F1');
        nextButton.setBackgroundColor('#F1F1F1');

        prevButton.animations.setAnimation('hovered', 0, (context, initialProperties, properties, elapseTime, e) => {
            properties.color.backgroundColor = initialProperties.color.backgroundColor;
        });

        nextButton.animations.setAnimation('hovered', 0, (context, initialProperties, properties, elapseTime, e) => {
            properties.color.backgroundColor = initialProperties.color.backgroundColor;
        });

        prevButton.hoverProperties.color.backgroundColor = '#D2D2D2';
        nextButton.hoverProperties.color.backgroundColor = '#D2D2D2';

        let scrollBackground;

        const scrollBackgroundWidth = width - 3 * height;

        if (orientation === 'vertical') {
            scrollBackground = new CompositeComponent(height, 0, height, scrollBackgroundWidth, this);
        } else {
            scrollBackground = new CompositeComponent(0, height, scrollBackgroundWidth, height, this);
        }

        let scroll;

        let partOfParent;
        
        if (orientation === 'vertical') {
            partOfParent = parentHeight / childWidth;
        } else {
            partOfParent = parentWidth / childWidth;
        }

        if (orientation === 'vertical') {
            scroll = new Component(0, 2, height - 4, Math.floor(partOfParent * (scrollBackgroundWidth)), scrollBackground);
        } else {
            scroll = new Component(2, 0, Math.floor(partOfParent * (scrollBackgroundWidth)), height - 4, scrollBackground);
        }

        scroll.setBackgroundColor('#C1C1C1');

        this.scrollPos = 0;
        this.scrollPosMax = scrollBackgroundWidth - Math.floor(partOfParent * (scrollBackgroundWidth));

        this.partOfParent = partOfParent;

        let parAndChildDif;

        if (orientation === 'vertical') {
            parAndChildDif = childWidth - parentHeight;
        } else {
            parAndChildDif = childWidth - parentWidth;
        }

        let currentChildPos = 0;
        let part = 10 / this.scrollPosMax;

        prevButton.addEventListener(events.MOUSE.MOUSE_DOWN, (e) => {
            if (this.scrollPos + 10 < 0) {
                this.scrollPos += 10;
                currentChildPos += part * parAndChildDif;
            } else {
                this.scrollPos = 0;
                currentChildPos = 0;
            }

            if (this.orientation === 'vertical') {
                scroll.setBoundingClientRect(-this.scrollPos);
                parentComponent.setScrollYOffer(currentChildPos);
            } else {
                scroll.setBoundingClientRect(undefined, -this.scrollPos);
                parentComponent.setScrollXOffer(currentChildPos);
            }
        });

        nextButton.addEventListener(events.MOUSE.MOUSE_DOWN, (e) => {
            if (this.scrollPos - 10 > -this.scrollPosMax) {
                this.scrollPos -= 10;
                currentChildPos -= part * parAndChildDif;
            } else {
                this.scrollPos = -this.scrollPosMax;
                currentChildPos = -parAndChildDif;
            }

            if (this.orientation === 'vertical') {
                scroll.setBoundingClientRect(-this.scrollPos);
                parentComponent.setScrollYOffer(currentChildPos);
            } else {
                scroll.setBoundingClientRect(undefined, -this.scrollPos);
                parentComponent.setScrollXOffer(currentChildPos);
            }
        });
    }    
}

class Button extends Component {
    constructor(top = 0, left = 0, width = 0, height = 0, text = '', parentComponent = null) {
        super(top, left, width, height, parentComponent);

        const textWidth = getTextWidthWithCanvas(text, 'monospace', '16px')

        this.label = new Label(Math.floor(height / 2) - 16 / 2, Math.floor(width / 2) - Math.floor(textWidth / 2), textWidth + 1, 16, text);
        this.properties.cursor = 'pointer';
    }

    paintComponent(context, elapsedTime) { 
        super.paintComponent(context, elapsedTime);

        const { top, left } = this.getBoundingClientRect();
   
        context.save();

        context.translate(left, top);

        this.label.draw(context, elapsedTime);

        context.restore();
    }
}
