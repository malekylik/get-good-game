import MonsterGraphicComponent from '../GraphicComponent/MonsterGraphicComponent';
import Character from '../Character/Character';

const adjective = [
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

const race = [
    'Огр',
    'Гном',
    'Гоблин',
    'Вампир',
    'Демон',
    'Зомби',
    'Оборотень',
    'Тролль',
];

const name = [
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

    createMonster(top = 0, left = 0) {
        const rand = Math.random;
        const round = Math.round;

        const headIndex = round(rand() * (this.headImgs.length - 1));
        const leftArmIndex = round(rand() * (this.leftArmImgs.length - 1));
        const rightArmIndex = round(rand() * (this.rightArmImgs.length - 1));
        const bodyIndex = round(rand() * (this.bodyImgs.length - 1));
        const legIndex = round(rand() * (this.legImgs.length - 1));

        const monsterGraphic = new MonsterGraphicComponent(top, left, this.headImgs[headIndex], this.leftArmImgs[leftArmIndex], this.rightArmImgs[rightArmIndex], this.bodyImgs[bodyIndex], this.legImgs[legIndex]);
        const { width: monsterWidth,  height: monsterHeight } = monsterGraphic.getBoundingClientRect();
        monsterGraphic.setBoundingClientRect(Math.floor((window.innerHeight - 150) / 2 - monsterHeight / 2), Math.floor(window.innerWidth / 2 + 100), monsterWidth, monsterHeight);

        const firstName = adjective[round(rand() * (adjective.length - 1))];
        const secondName = race[round(rand() * (race.length - 1))];
        const thirdName = name[round(rand() * (name.length - 1))];

        const monster = new Character(`${firstName} ${secondName} ${thirdName}`, 100, 100, monsterGraphic);

        return monster;
    }
}
