export default class Character {
    constructor(name, maxHP, initialHP, graphicComponent = null) {
        this.name = name;
        this.currentHP = initialHP;
        this.maxHP = maxHP;
        this.graphicComponent = graphicComponent;
        this.magics = [];
    }

    getGraphicComponent() {
        return this.graphicComponent;
    }

    attack(character, magicIndex) {
        character.takeAttack(this.magics[i].damage);
    }

    takeAttack(damage) {
        this.currentHP -= damage;

        if (this.currentHP < 0) {
            this.currentHP = 0;

            return true;
        }

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
}
