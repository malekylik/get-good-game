export default class Character {
    constructor(name, maxHP, initialHP, damageValue, graphicComponent = null) {
        this.name = name;
        this.currentHP = initialHP;
        this.maxHP = maxHP;
        this.graphicComponent = graphicComponent;
        this.damageValue = damageValue;
    }

    getGraphicComponent() {
        return this.graphicComponent;
    }

    attack(character) {
        character.takeAttack(this.damageValue);
    }

    takeAttack(damage) {
        this.currentHP -= damage;

        if (this.currentHP < 0) {
            this.currentHP = 0;

            return true;
        }

        return false;
    }

    getName() {
        return this.name;
    }

    getCurrentHP() {
        return this.currentHP;
    }

    getMaxHP() {
        return this.maxHP;
    }

    isDead() {
        return this.currentHP > 0;
    }
}
