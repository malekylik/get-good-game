import Magic from './Magic';
import events from '../event/events/events';

export default class MagicArrow extends Magic {
    constructor(name, damage, magicGraphicComponent, attackAnimations, sound) {
        super(name, damage, magicGraphicComponent);
        this.attackAnimations = attackAnimations;

        this.moveIndex = 0;
        this.explosionIndex = 1;

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

    arrowMove(enemyLeft, characterWidth, characterLeft, canvas) {
        const moveAnimation = this.attackAnimations[this.moveIndex];

        let dif = enemyLeft - characterLeft + Math.floor(characterWidth / 4);

        moveAnimation.animations.setAnimation('move', 0.924, 1, (context, initialProperties, properties, elapseTime, component) => {
            component.backgroundImage.setFrame(elapseTime);
            component.setBoundingClientRect(undefined, characterLeft + dif * elapseTime);
        });

        return new Promise((resolve) => {
            moveAnimation.addEventListener(events.ANIMATION.ANIMATION_END, () => {
                canvas.removeScene(moveAnimation);
                resolve();
            });
        });
    }

    explode(canvas) {
        const explosionAnimation = this.attackAnimations[this.explosionIndex];

        explosionAnimation.animations.setAnimation('explode', 0.924, 1, (context, initialProperties, properties, elapseTime, component) => {
            component.backgroundImage.setFrame(elapseTime);
        });

        return new Promise((resolve) => {
            explosionAnimation.addEventListener(events.ANIMATION.ANIMATION_END, () => {
                canvas.removeScene(explosionAnimation);
                resolve();
            });
        });
    }

    async attack(character, enemy, canvas) {
        const moveAnimation = this.attackAnimations[this.moveIndex];
        const explosionAnimation = this.attackAnimations[this.explosionIndex];

        const { left: characterLeft, width: characterWidth } = character.getGraphicComponent().getBoundingClientRect();
        const { top: enemyTop, left: enemyLeft, height: enemyHeight } = enemy.getGraphicComponent().getBoundingClientRect();

        moveAnimation.setBoundingClientRect(enemyTop + Math.floor(enemyHeight / 2), characterLeft);

        canvas.addScene(moveAnimation);

        this.sound.play();

        await this.arrowMove(enemyLeft, characterWidth, characterLeft, canvas);

        explosionAnimation.setBoundingClientRect(enemyTop + Math.floor(enemyHeight / 2), enemyLeft + Math.floor(characterWidth / 4));

        canvas.addScene(explosionAnimation);

        await this.explode(canvas);        
    }
}
