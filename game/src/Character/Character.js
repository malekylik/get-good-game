export default class Character {
    constructor(name, maxHP, initialHP, graphicComponent = null) {
        this.name = name;
        this.currentHP = initialHP;
        this.maxHP = maxHP;
        this.graphicComponent = graphicComponent;
        this.magics = [];

        this.hpChangeListeners = [];
    }

    getGraphicComponent() {
        return this.graphicComponent;
    }

    attack(character, magic) {
        if (magic) {
            character.takeAttack(magic.damage);
        } else {
            character.takeAttack(50);
        }
    }

    takeAttack(damage) {
        this.currentHP -= damage;

        if (this.currentHP < 0) {
            this.currentHP = 0;

            return true;
        }

        this.hpChangeListeners.forEach((listener) => {
            listener(this.currentHP);
        });

        return false;
    }

    addMagic(magic) {
        this.magics.push(magic);
    }

    getMagic() {
        return this.magics;
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

    isAlive() {
        return this.currentHP > 0;
    }

    addHPChangeListener(listener) {
        this.hpChangeListeners.push(listener);
    }
}
