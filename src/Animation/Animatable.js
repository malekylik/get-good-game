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
            animationTimePast: 0
        };
    }

    deleteAnimation(name) {
        delete this.animations[name];
    }

    animate(context, component, elapseTime) {
        const keys = Object.keys(this.animations);

        for (let i = 0; i < keys.length; i++) {
            const a = this.animations[keys[i]];

            a.animationFunc(context, component.properties, this.animatedProperties, a.elapseTime / a.time, component);

            a.elapseTime += elapseTime;

            if (a.elapseTime > a.time) {
                a.elapseTime = 0;
                a.animationTimePast += 1;

                this.animatedProperties = {};
                if (component.hovered) {
                    merge(this.animatedProperties, component.hoverProperties);                    
                } else {
                    merge(this.animatedProperties, component.properties);
                }

                if (a.animationTimePast >= a.timeCount) {
                    delete this.animations[keys[i]];

                    component.handlers.handle({
                        target: component,
                        type: events.ANIMATION.ANIMATION_END,
                        subtype: 'ANIMATION',
                        payload: {
                            animationName: keys[i]
                        }
                    });
                }
            } 
        }
    }
}
