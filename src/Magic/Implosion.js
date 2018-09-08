import Magic from './Magic';
import events from '../event/events/events';

export default class Implosion extends Magic {
    constructor(name, damage, magicGraphicComponent, attackAnimations, sound) {
        super(name, damage, magicGraphicComponent);
        this.attackAnimations = attackAnimations;
        
        this.implosionIndex = 0;

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
        const { top: enemyTop, left: enemyLeft, width: enemyWidth } = enemy.getGraphicComponent().getBoundingClientRect();
        const implosionAnimation = this.attackAnimations[this.implosionIndex];

        implosionAnimation.animations.setAnimation('implosion', 0.924, 1, (context, initialProperties, properties, elapseTime, e) => {
            e.backgroundImage.setFrame(elapseTime);
        });

        implosionAnimation.setBoundingClientRect(enemyTop, Math.floor(enemyLeft + enemyWidth / 3));

        this.sound.play();
        canvas.addScene(implosionAnimation);

        await new Promise((resolve) => {
            implosionAnimation.addEventListener(events.ANIMATION.ANIMATION_END, (e) => {
                canvas.removeScene(implosionAnimation);
                resolve();
            });
        });        
    }
}
