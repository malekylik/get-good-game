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
        this.isSelected = false;
        this.drawBorder = false;
        this.tabable = false;

        this.properties.color = {
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgb(77, 144, 254)',
        };

        this.backgroundImage = null;
        this.onremove = null;

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

    removeEventListener(name, event) {
        this.handlers.removeEventListener(name, event)
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

    alignCenter(relativeElementWidth, relativeElementHeight) {
        const parent = this.getParentComponent();
        let parentWidth = 0;
        let parentHeight = 0;

        if (relativeElementWidth !== undefined && relativeElementHeight !== undefined) {
            parentWidth = relativeElementWidth;
            parentHeight = relativeElementHeight;
        } else {
            if (parent !== null) {
                ({ width: parentWidth, height: parentHeight } = parent.getBoundingClientRect());
            } else {
                parentWidth = window.innerWidth;
                parentHeight = window.innerHeight;
            }
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
        const canvas = e.canvas;
        if (canvas.style.cursor !== c.properties.cursor) {
            canvas.style.cursor = c.properties.cursor;
        }

        if (c.hovered !== true) {
            c.hovered = true;
            merge(c.animations.animatedProperties, c.hoverProperties);
        }
    }

    getBoundingClientRect() {
        return this.animations.animatedProperties.boundingClientRect;
    }

    setHovered(hovered) {
        if (this.hovered !== hovered) {
            this.hovered = hovered;

            if (hovered) {
                merge(this.animations.animatedProperties, this.hoverProperties);
            } else {
                merge(this.animations.animatedProperties, this.properties);
            }
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

        if (top === undefined && prevBoundingBox && typeof top !== "number") {
            top = prevTop;
        }

        if (left === undefined && prevBoundingBox && typeof left !== "number") {
            left = prevLeft;
        }

        if (width === undefined && prevBoundingBox && typeof width !== "number") {
            width = prevWidth;
        }

        if (height === undefined && prevBoundingBox && typeof height !== "number") {
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

    getParentComponent() {
        return this.parentComponent;
    }

    getBackgroundImage() {
        return this.backgroundImage;
    }

    getOverflow() {
        return this.properties.overflow;
    }

    getAbsoluteCoord() {
        let { top, left } = this.getBoundingClientRect();

        let parent = this.getParentComponent();

        while (parent !== null) {
            const { top: parentTop, left: parentLeft } = parent.getBoundingClientRect();

            top += parentTop;
            left += parentLeft;

            parent = parent.getParentComponent();
        }

        return {
            top,
            left
        };
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

        if (this.drawBorder && this.isSelected) {
            context.strokeStyle = color.borderColor;
            context.strokeRect(left, top, width, height);
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
            if (typeof this.children[index].component.onremove === 'function') {
                this.children[index].component.onremove();
            }

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

    dropChildren() {
        this.children = [];
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

            const backgroundImage = this.getBackgroundImage();

            if (backgroundImage) {
                backgroundImage.setScrollYOffer(backgroundImage.y + scrollYOffer);
            }
        })
    }

    setScrollXOffer(scrollXOffer) {
        this.scrollXOffset = scrollXOffer;

        this.children.forEach(({ component }) => {
            if (component instanceof ScrollBar) {
                return;
            }

            const { left } = component.initialBoundingClientRect; 
            component.setBoundingClientRect(undefined, left + scrollXOffer);

            const backgroundImage = this.getBackgroundImage();

            if (backgroundImage) {
                backgroundImage.setScrollXOffer(backgroundImage.x + scrollXOffer);
            }
        })
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

    getAbsoluteCoord() {
        let parent = this.getParentComponent();
        let { top, left } = this.getBoundingClientRect();

        while (parent !== null) {
            const { top: parentTop, left: parentLeft } = parent.getBoundingClientRect();
           
            top += parentTop;
            left += parentLeft;

            parent = parent.getParentComponent();
        }

        return {
            top,
            left
        }
    }

    checkForCollision(objectMetric) {
        const elementInside = [];
        let biggestDepth = 1;

        this.traverse((o) => {
            const { width, height } = o.getBoundingClientRect();
            const { top: absoluteTop, left: absoluteLeft } = o.getAbsoluteCoord();
            const oCoord = {
                top: absoluteTop,
                left: absoluteLeft,
                width,
                height
            };

            let depth = 1;

            let parent = o.getParentComponent();

            const parentOverflow = [];

            while (parent !== null) {
                depth += 1;

                if (parent.getOverflow() === 'scroll' || parent.getOverflow() === 'overflow') {
                    parentOverflow.push(parent);
                }

                parent = parent.getParentComponent();
            }

            if (parentOverflow.length !== 0) {
                for (let i = 0; i < parentOverflow.length; i++) {
                    const { top: parentTop, left: parentLeft } = parentOverflow[i].getAbsoluteCoord();
                    const { width, height } = parentOverflow[i].getBoundingClientRect();

                    if (!o.collision.isInside(
                        oCoord,
                        {
                            top: parentTop,
                            left: parentLeft,
                            width,
                            height
                        })) {

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

        this.prevButtonHandler = this.prevButtonHandler.bind(this);
        this.nextButtonHandler = this.nextButtonHandler.bind(this);

        this.childWidth = childWidth;
        this.orientation = orientation;

        this.setBackgroundColor('#F1F1F1');

        const { prevButton, nextButton } = this.createScrollButtons(orientation, width, height);

        if (orientation === 'vertical') {
            this.partOfParent = parentHeight / childWidth;
            this.parAndChildDif = childWidth - parentHeight;
        } else {
            this.partOfParent = parentWidth / childWidth;
            this.parAndChildDif = childWidth - parentWidth;
        }

        this.scroll = this.createScroll(orientation, width, height, this.partOfParent);

        this.currentChildPos = 0;
        this.part = 10 / this.scrollPosMax;

        this.scrollPos = 0;

        prevButton.addEventListener(events.MOUSE.MOUSE_DOWN, this.prevButtonHandler);
        nextButton.addEventListener(events.MOUSE.MOUSE_DOWN, this.nextButtonHandler);
    }

    prevButtonHandler(e) {
        const parentComponent = this.getParentComponent();
        const scroll = this.scroll;

        if (this.scrollPos + 10 < 0) {
            this.scrollPos += 10;
            this.currentChildPos += this.part * this.parAndChildDif;
        } else {
            this.scrollPos = 0;
            this.currentChildPos = 0;
        }

        if (this.orientation === 'vertical') {
            scroll.setBoundingClientRect(-this.scrollPos);
            parentComponent.setScrollYOffer(Math.round(this.currentChildPos));
        } else {
            scroll.setBoundingClientRect(undefined, -this.scrollPos);
            parentComponent.setScrollXOffer(Math.round(this.currentChildPos));
        }
    }

    nextButtonHandler(e) {
        const parentComponent = this.getParentComponent();
        const scroll = this.scroll;

        if (this.scrollPos - 10 > -this.scrollPosMax) {
            this.scrollPos -= 10;
            this.currentChildPos -= this.part * this.parAndChildDif;
        } else {
            this.scrollPos = -this.scrollPosMax;
            this.currentChildPos = -this.parAndChildDif;
        }

        if (this.orientation === 'vertical') {
            scroll.setBoundingClientRect(-this.scrollPos);
            parentComponent.setScrollYOffer(Math.round(this.currentChildPos));
        } else {
            scroll.setBoundingClientRect(undefined, -this.scrollPos);
            parentComponent.setScrollXOffer(Math.round(this.currentChildPos));
        }
    }

    getScrollButtonsChar(orientation) {
        let prevButtonText = String.fromCharCode(parseInt('25c4', 16));
        let nextButtonText = String.fromCharCode(parseInt('25ba', 16));

        if (orientation === 'vertical') {
            prevButtonText = String.fromCharCode(parseInt('25b2', 16));
            nextButtonText = String.fromCharCode(parseInt('25bc', 16));
        }

        return {
            prevButtonText,
            nextButtonText
        }
    }

    createScroll(orientation, width, height, partOfParent) {
        let scrollBackground;

        const scrollBackgroundWidth = width - 3 * height;

        if (orientation === 'vertical') {
            scrollBackground = new CompositeComponent(height, 0, height, scrollBackgroundWidth, this);
        } else {
            scrollBackground = new CompositeComponent(0, height, scrollBackgroundWidth, height, this);
        }

        let scroll;

        if (orientation === 'vertical') {
            scroll = new Component(0, 2, height - 4, Math.floor(partOfParent * (scrollBackgroundWidth)), scrollBackground);
        } else {
            scroll = new Component(2, 0, Math.floor(partOfParent * (scrollBackgroundWidth)), height - 4, scrollBackground);
        }

        scroll.setBackgroundColor('#C1C1C1');

        this.scrollPosMax = scrollBackgroundWidth - Math.floor(partOfParent * (scrollBackgroundWidth));

        return scroll;
    }

    createScrollButtons(orientation, width, height) {
        let { prevButtonText, nextButtonText } = this.getScrollButtonsChar(orientation);

        let nextButton;
        const prevButton = new Button(0, 0, height, height, prevButtonText, this);

        if (orientation === 'vertical') {
            nextButton = new Button(width - 2 * height, 0, height, height, nextButtonText, this);
        } else {
            nextButton = new Button(0, width - 2 * height, height, height, nextButtonText, this);
        }

        prevButton.setBackgroundColor('#F1F1F1');
        nextButton.setBackgroundColor('#F1F1F1');

        prevButton.hoverProperties.color.backgroundColor = '#D2D2D2';
        nextButton.hoverProperties.color.backgroundColor = '#D2D2D2';

        return {
            prevButton,
            nextButton
        };
    }
}

export class Button extends Component {
    constructor(top = 0, left = 0, width = 0, height = 0, text = '', parentComponent = null) {
        super(top, left, width, height, parentComponent);

        const textHeight = 16;

        const textWidth = getTextWidthWithCanvas(text, 'monospace', textHeight)

        this.label = new Label(Math.floor(height / 2) - textHeight / 2, Math.floor(width / 2) - Math.floor(textWidth / 2), textWidth + 1, textHeight, text);
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
