import Magic from './Magic';
import events from '../event/events/events';

export default class Implosion extends Magic {
    constructor(name, damage, magicGraphicComponent, attackAnimations, sound) {
        super(name, damage, magicGraphicComponent);
        this.attackAnimations = attackAnimations;

        this.sound = sound;
    }

    getGraphicComponent() {
        return this.graphicComponent;
    }

    getName() {
        return this.name;
    }

    getDamage() {
        return this.damage;
    }

    async attack(character, enemy, canvas) {
        const { top, left, width } = enemy.getGraphicComponent().getBoundingClientRect();

        this.attackAnimations[0].animations.setAnimation('asd', 0.924, 1, (context, initialProperties, properties, elapseTime, e) => {
            e.backgroundImage.setFrame(elapseTime);
        });

        const attackPromise = new Promise((resolve) => {
            this.attackAnimations[0].addEventListener(events.ANIMATION.ANIMATION_END, (e) => {
                canvas.removeScene(this.attackAnimations[0]);
                resolve();
            });
        });

        this.attackAnimations[0].setBoundingClientRect(top, Math.floor(left + width / 3));

        this.sound.play();
        canvas.addScene(this.attackAnimations[0]);

        await attackPromise;        
    }
}
