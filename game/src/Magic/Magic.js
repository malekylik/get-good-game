export default class Magic {
    constructor(name, damage, magicGraphicComponent) {
        this.name = name;
        this.damage = damage;
        
        this.graphicComponent = magicGraphicComponent
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
}
