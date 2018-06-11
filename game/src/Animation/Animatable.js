import { merge } from 'lodash';

export default class Animatable {
    constructor(component) {
        this.animatedProperties = {};
        merge(this.animatedProperties, component.properties);

        this.animations = {

        };
    }

    setAnimation(name, time, animationFunc) {
        this.animations[name] = {
            animationFunc,
            time: time * 1000,
            elapseTime: 0,
        };
    }

    animate(context, component, elapseTime) {
        const keys = Object.keys(this.animations);

        for (let i = 0; i < keys.length; i++) {
            const a = this.animations[keys[i]];

            a.animationFunc(context, component.properties, this.animatedProperties, a.elapseTime / a.time, component);

            a.elapseTime += elapseTime;

            if (a.elapseTime > a.time) {
                a.elapseTime = 0;

                this.animatedProperties = {};
                if (component.hovered) {
                    merge(this.animatedProperties, component.hoverProperties);                    
                } else {
                    merge(this.animatedProperties, component.properties);
                }
            } 
        }
    }
}
