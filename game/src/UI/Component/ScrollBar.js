import Button from './Button';
import events from '../../event/events/events';

import { Component, CompositeComponent } from './Component';

export default class ScrollBar extends CompositeComponent {
    constructor(orientation, childWidth, parentComponent) {
        const height = 17;

        let parentWidth = window.innerWidth;
        let parentHeight = window.innerHeight;

        if (parentComponent) {
            ({ width: parentWidth, height: parentHeight } = parentComponent.getClippedBoundingClientRect());
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

        prevButton.setBackgroundColor('#D2D2D2');
        nextButton.setBackgroundColor('#D2D2D2');

        let scrollBackground;

        const scrollBackgroundWidth = width - 3 * height;

        if (orientation === 'vertical') {
            scrollBackground = new CompositeComponent(height, 0, height, scrollBackgroundWidth, this);
        } else {
            scrollBackground = new CompositeComponent(0, height, scrollBackgroundWidth, height, this);
        }

        scrollBackground.setBackgroundColor('#ff0000');

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
