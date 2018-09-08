import MonsterGraphicComponent from '../GraphicComponent/MonsterGraphicComponent';
import Character from '../Character/Character';

const adjectives = [
    'Ужасный', 
    'Сопливый',
    'Адский',
    'Безбожный',
    'Безжалостный',
    'Буйный',
    'Дикий',
    'Дьявольский',
    'Жестокий',
    'Зверский',
    'Злобный',
    'Наглый',
    'Неистовый',
    'Неудержимый',
    'Сатанинский',
    'Сумасшедший',
];

const races = [
    'Огр',
    'Гном',
    'Гоблин',
    'Вампир',
    'Демон',
    'Зомби',
    'Оборотень',
    'Тролль',
];

const names = [
    'Том',
    'Макс',
    'Дима',
    'Денис',
    'Артем',
    'Вадим',
    'Вася',
    'Гена',
    'Женя',
    'Илья',
    'Кирилл',
    'Макар',
    'Никита',
    'Олег',
    'Паша',
    'Рома',
];

export default class MonsterFactory {
    constructor(headImgs, leftArmImgs, rightArmImgs, bodyImgs, legImgs) {
        this.headImgs = [...headImgs];
        this.leftArmImgs = [...leftArmImgs];
        this.rightArmImgs = [...rightArmImgs];
        this.bodyImgs = [...bodyImgs];
        this.legImgs = [...legImgs];
    }

    createMonster(canvasWidth, canvasHeight) {
        const rand = Math.random;
        const round = Math.round;

        const headIndex = round(rand() * (this.headImgs.length - 1));
        const leftArmIndex = round(rand() * (this.leftArmImgs.length - 1));
        const rightArmIndex = round(rand() * (this.rightArmImgs.length - 1));
        const bodyIndex = round(rand() * (this.bodyImgs.length - 1));
        const legIndex = round(rand() * (this.legImgs.length - 1));

        const marginTop = 150;
        const marginLeft = 100;

        const monsterGraphic = new MonsterGraphicComponent(0, 0, this.headImgs[headIndex], this.leftArmImgs[leftArmIndex], this.rightArmImgs[rightArmIndex], this.bodyImgs[bodyIndex], this.legImgs[legIndex]);
        const { width: monsterWidth,  height: monsterHeight } = monsterGraphic.getBoundingClientRect();
        monsterGraphic.setBoundingClientRect(Math.floor((canvasHeight - marginTop) / 2 - monsterHeight / 2), Math.floor(canvasWidth / 2 + marginLeft), monsterWidth, monsterHeight);

        const firstName = adjectives[round(rand() * (adjectives.length - 1))];
        const secondName = races[round(rand() * (races.length - 1))];
        const thirdName = names[round(rand() * (names.length - 1))];

        const monster = new Character(`${firstName} ${secondName} ${thirdName}`, 100, 100, monsterGraphic);

        return monster;
    }
}
