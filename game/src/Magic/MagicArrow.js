import Magic from './Magic';
import events from '../event/events/events';

export default class MagicArrow extends Magic {
    constructor(name, damage, magicGraphicComponent, attackAnimations) {
        super(name, damage, magicGraphicComponent);
        this.attackAnimations = attackAnimations;

        this.sound = new Audio('/assets/sound/magic/magicArrow/MAGICARW.mp3');
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
        const { left: characterLeft, width: characterWidth } = character.getGraphicComponent().getBoundingClientRect();
        const { top, left, height } = enemy.getGraphicComponent().getBoundingClientRect();

        let dif = left - characterLeft - characterWidth;

        this.attackAnimations[0].animations.setAnimation('asd', 0.924, 1, (context, initialProperties, properties, elapseTime, e) => {
            e.backgroundImage.setFrame(elapseTime);
            e.setBoundingClientRect(undefined, characterLeft + characterWidth + dif * elapseTime);
        });

        const movingPromise = new Promise((resolve) => {
            this.attackAnimations[0].addEventListener(events.ANIMATION.ANIMATION_END, (e) => {
                canvas.removeScene(this.attackAnimations[0]);
                resolve();
            });
        });

        this.attackAnimations[0].setBoundingClientRect(top + Math.floor(height / 2), characterLeft);

        canvas.addScene(this.attackAnimations[0]);

        this.sound.play();

        await movingPromise;

        this.attackAnimations[1].animations.setAnimation('asd', 0.924, 1, (context, initialProperties, properties, elapseTime, e) => {
            e.backgroundImage.setFrame(elapseTime);
        });

        const attackPromise = new Promise((resolve) => {
            this.attackAnimations[1].addEventListener(events.ANIMATION.ANIMATION_END, (e) => {
                canvas.removeScene(this.attackAnimations[1]);
                resolve();
            });
        });

        this.attackAnimations[1].setBoundingClientRect(top + Math.floor(height / 2), left);

        canvas.addScene(this.attackAnimations[1]);

        await attackPromise;        
    }
}
