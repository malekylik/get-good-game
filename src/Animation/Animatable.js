import events from '../event/events/events';

import { merge } from 'lodash';

export default class Animatable {
    constructor(component) {
        this.animatedProperties = {};
        merge(this.animatedProperties, component.properties);

        this.animations = {

        };
    }

    setAnimation(name, time, timeCount, animationFunc) {
        this.animations[name] = {
            animationFunc,
            timeCount,
            time: time * 1000,
            elapseTime: 0,
            animationTimesPast: 0
        };
    }

    deleteAnimation(name) {
        delete this.animations[name];
    }

    resetAnimatedProperties(component) {
        this.animatedProperties = {};
        if (component.hovered) {
            merge(this.animatedProperties, component.hoverProperties);                    
        } else {
            merge(this.animatedProperties, component.properties);
        }
    }

    incrementAnimationTimesPast(animationName, animation, component) {
        if (animation.elapseTime > animation.time) {
            animation.elapseTime = 0;

            this.resetAnimatedProperties(component);

            if (animation.timeCount !== 'infinite') {
                animation.animationTimesPast += 1;

                if (animation.animationTimesPast >= animation.timeCount) {
                    delete this.animations[animationName];

                    component.handlers.handle({
                        target: component,
                        type: events.ANIMATION.ANIMATION_END,
                        subtype: 'ANIMATION',
                        payload: {
                            animationName: animationName
                        }
                    });
                }
            }
        } 
    }

    animate(context, component, elapseTime) {
        const animationNames = Object.keys(this.animations);

        animationNames.forEach((animationName) => {
            const animation = this.animations[animationName];

            animation.animationFunc(context, component.properties, this.animatedProperties, animation.elapseTime / animation.time, component);

            animation.elapseTime += elapseTime;

            this.incrementAnimationTimesPast(animationName, animation, component);
        });
    }
}
