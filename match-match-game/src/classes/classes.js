const bottomCards = [
    './src/imgs/cards/2d.jpg',
    './src/imgs/cards/2h.jpg',
    './src/imgs/cards/2s.jpg',
    './src/imgs/cards/3c.jpg',
    './src/imgs/cards/4c.jpg',
    './src/imgs/cards/4s.jpg',
    './src/imgs/cards/6c.jpg',
    './src/imgs/cards/6d.jpg',
    './src/imgs/cards/6s.jpg',
    './src/imgs/cards/7d.jpg',
    './src/imgs/cards/7h.jpg',
    './src/imgs/cards/8c.jpg',
    './src/imgs/cards/8s.jpg',
    './src/imgs/cards/9d.jpg',
    './src/imgs/cards/9h.jpg',
    './src/imgs/cards/10c.jpg',
    './src/imgs/cards/10d.jpg',
    './src/imgs/cards/10h.jpg',
    './src/imgs/cards/10s.jpg',
    './src/imgs/cards/ac.jpg',
    './src/imgs/cards/as.jpg',
    './src/imgs/cards/jc.jpg',
    './src/imgs/cards/jd.jpg',
    './src/imgs/cards/jh.jpg',
    './src/imgs/cards/js.jpg',
    './src/imgs/cards/kd.jpg',
    './src/imgs/cards/qh.jpg',
];

const topCards = [
    './src/imgs/cards/back1.jpg',
    './src/imgs/cards/back2.jpg',
    './src/imgs/cards/back3.jpg',
];

const difficultyNumberOfCard = [
    5 * 2,
    6 * 3,
    8 * 3,
];

const createElement = (tag, style = '', value = '') => {
    const el = document.createElement(tag);

    el.classList.add(style);
    el.innerText = value;

    return el;
};

const createCards = (count) => {
    const temp = [];

    for (let i = 0; i < count; i++) {
        temp.push(
            {
                rand: Math.random(),
                value: i
            }
        );
    }

    temp.sort((l, r) => l.rand - r.rand);

    return temp;    
}

class Timer {
    constructor(graphicComponent = null ,initialTime = 0) {
        this.initialTime = initialTime;
        this.isRun = false;
        this.graphicComponent = graphicComponent;

        this.changeTime = this.changeTime.bind(this);

        this.isShowed = false;
    }

    changeTime() {
        this.time += 1;
    }

    start() {
        if (!this.isRun) {
            this.time = this.initialTime;
            this.isRun = true;
    
            this.intervalId = setInterval(this.changeTime, 1000);
    
            return this.getTime();
        }
    }

    terminate() {
        if (!this.isRun) {
            clearInterval(this.intervalId);
            this.isRun = false;
        }
    }

    render(container) {
        if (this.graphicComponent) {
            this.graphicComponent.render(this);
        }

        if (!this.isShowed) {
            container.appendChild(this.graphicComponent.element);
            this.isShowed = true;
        }
    }

    getTime() {
        const time = this.time;

        let sec = time % 60,
            minutes = Math.floor(time / 60),
            hours = Math.floor(time / 3600);
            
            if (sec < 10) {
                sec = `0${sec}`;
            }

            if (minutes < 10) {
                minutes = `0${minutes}`;
            }

            if (hours < 10) {
                hours = `0${hours}`;
            }
        
        return `${hours}:${minutes}:${sec}`; 
    }
}


class HTMLTimerGraphicComponent {
    constructor(element) {
        this.element = element;
    }

    render(timer) {
        if (!timer.isRun) {
            this.element.innerText = timer.start();
        } else {
            const time = timer.getTime();

            if (this.element.innerText !== time) {
                this.element.innerText = time;
            }
        }
    }
}

class HTMLCardGraphicComponent {
    constructor(card, top, bottom) {
        this.topSide = top;
        this.bottomSide = bottom;
        this.card = card;

        this.isTurning = false;

        this.removeAnimation = this.removeAnimation.bind(this);

        card.addEventListener('animationend', this.removeAnimation);
    }

    render() {
        if (!this.isTurning) {
            this.topSide.classList.add('card-side-top-turn');
            this.bottomSide.classList.add('card-side-bottom-turn');

            this.isTurning = true;
        }
    }

    removeAnimation(cardObj) {
        if (this.isTurning) {
            this.topSide.classList.toggle('card-side-top-turned');
            this.bottomSide.classList.toggle('card-side-bottom-turned');
    
            this.topSide.classList.remove('card-side-top-turn');
            this.bottomSide.classList.remove('card-side-bottom-turn');

            this.isTurning = false;
        } 
    }
}

class HTMLStartPageGraphicComponent {
    constructor() {
        this.container = document.getElementsByClassName('start-page')[0];

        this.firstNameInput = document.getElementById('first-name-input');
        this.lastNameInput = document.getElementById('last-name-input');
        this.emailInput = document.getElementById('email-input');

        this.difficultyRadios = [];

        this.difficultyRadios.push(
            document.getElementById('low-dif'),
            document.getElementById('med-dif'),
            document.getElementById('hight-dif')
        );

        this.skirtRadios = [];

        this.skirtRadios.push(
            document.getElementById('skirt1'),
            document.getElementById('skirt2'),
            document.getElementById('skirt3')
        );

        this.submitButton = document.getElementsByClassName('start-page__submit')[0];
    }

    render() {
        this.container.style.display = 'block';
    }

    remove() {
        this.container.style.display = 'none';
    }
}


class StartPage {
    constructor() {
       this.graphicComponent = new HTMLStartPageGraphicComponent();
    }

    render() {
        this.graphicComponent.render();
    }

    remove() {
        this.graphicComponent.remove();
    }

    getDifficulty() {
        const difficultyRadios = this.graphicComponent.difficultyRadios;
        let difficulty;

        for (let i = 0; i < difficultyRadios.length; i++) {
            if (difficultyRadios[i].checked) {
                difficulty = i;
                break;
            }
        }

        return difficultyNumberOfCard[difficulty];
    }

    getSkirt() {
        const skirtRadios = this.graphicComponent.skirtRadios;
        let skirt;

        for (let i = 0; i < skirtRadios.length; i++) {
            if (skirtRadios[i].checked) {
                skirt = i;
                break;
            }
        }

        return topCards[skirt];
    }
}

class Card {
    constructor(top, bottom, value, player) {
        const [card, cardTop, cardBottom] = this.createCartElement(top, bottom);

        this.card = card;

        this.graphicComponent = new HTMLCardGraphicComponent(card, cardTop, cardBottom, this);

        this.value = value;

        this.isSelected = false;
        this.matched = false;

        this.select = this.select.bind(this, player);
        card.addEventListener('click', this.select);
    }

    render(container) {
        container.appendChild(this.card);
    }

    createCartElement(top, bottom) {
        const cardTop = createElement('img', 'card-side-top');
        cardTop.src = top;

        const cardBottom = createElement('img', 'card-side-bottom');
        cardBottom.src = bottom;

        const card = createElement('figure', 'card');

        card.appendChild(cardBottom);
        card.appendChild(cardTop);

        return [card, cardTop, cardBottom];
    }

    select(player) {
        if(!this.isSelected && player.selectedCard.length < 2 
            && !this.graphicComponent.isTurning) {
            this.graphicComponent.render(this);

            this.isSelected = true;

            player.selectedCard.push(this);

            console.log(this.value);
        }
    }

    match() {
        this.matched = true;
    }

    turn() {
        setTimeout(() => {
            this.graphicComponent.render();
            this.isSelected = false;
        }, 1250);
    }
}

class Player {
    constructor() {
        this.selectedCard = [];
        this.name = 'ads';
    }

    addCard(card) {
        this.selectedCard.push(card);
    }

    isPresent(card) {
        return this.selectedCard.includes(card);
    }

    match() {
        let answer = [];

        if (this.selectedCard.length === 2) {
            const [firstCard, secondCard] = this.selectedCard;

            const isMatch = firstCard.value === secondCard.value;

            if (isMatch) {
                firstCard.match();
                secondCard.match();
                answer = this.selectedCard;
            } else {
                firstCard.turn();
                secondCard.turn();
            }

            this.selectedCard = [];

        }

        return answer;
    }
}

class Game {
    constructor() {
        this.timer = new Timer(new HTMLTimerGraphicComponent(createElement('div', 'timer', '00:00:00')));
        this.cards = [];
        this.matchedCards = [];

        this.player = new Player();
        this.startPage = new StartPage();
    
        this.start = this.start.bind(this);
        this.main = this.main.bind(this);

        this.startPage.graphicComponent.submitButton.addEventListener('click', this.start);
    }

    start(e) {
        e.preventDefault();

        this.count = this.startPage.getDifficulty();
        this.skirt = this.startPage.getSkirt();

        const randomSequence = createCards(this.count);

        for (let i = 0; i < this.count; i++) {
            const value = Math.floor(randomSequence[i].value / 2);
            this.cards.push(new Card(this.skirt, bottomCards[value], value, this.player));
        }

        this.startPage.remove();

        const header = document.getElementsByClassName('header')[0];

        const container = document.createElement('vid');
        container.classList.add('cards');
        document.body.appendChild(container);

        this.cards.forEach((e) => {e.render(container);});
        this.timer.render(header);

        this.main();
    }

    main() {
        requestAnimationFrame(this.main);
        

        this.update();

        this.render();
        // console.log(this.matchedCards);
    }

    render() {
        this.timer.render();
    }

    update() {
        const matched = this.player.match();

        if (matched.length > 0) {
            this.matchedCards = [...this.matchedCards, ...matched];
        }
    }
}
