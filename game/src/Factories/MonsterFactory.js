import MonsterGraphicComponent from '../GraphicComponent/MonsterGraphicComponent';

export default class MonsterFactory {
    constructor(headImgs, leftArmImgs, rightArmImgs, bodyImgs, legImgs) {
        this.headImgs = [...headImgs];
        this.leftArmImgs = [...leftArmImgs];
        this.rightArmImgs = [...rightArmImgs];
        this.bodyImgs = [...bodyImgs];
        this.legImgs = [...legImgs];
    }

    createMonster(top = 0, left = 0) {
        const rand = Math.random;
        const round = Math.round;

        const headIndex = round(rand() * (this.headImgs.length - 1));
        const leftArmIndex = round(rand() * (this.leftArmImgs.length - 1));
        const rightArmIndex = round(rand() * (this.rightArmImgs.length - 1));
        const bodyIndex = round(rand() * (this.bodyImgs.length - 1));
        const legIndex = round(rand() * (this.legImgs.length - 1));

        return new MonsterGraphicComponent(top, left, this.headImgs[headIndex], this.leftArmImgs[leftArmIndex], this.rightArmImgs[rightArmIndex], this.bodyImgs[bodyIndex], this.legImgs[legIndex]);
    }
}
