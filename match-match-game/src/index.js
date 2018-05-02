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
    
            return this.formatedTime;
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

    get formatedTime() {
        return this.formatTime(this.time); 
    }

    formatTime(time) {
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

        return `${hours}:${minutes}:${sec}`
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
            const time = timer.formatedTime;

            if (this.element.innerText !== time) {
                this.element.innerText = time;
            }
        }
    }
}

class HTMLCardGraphicComponent {
    constructor(card, top, bottom, cardObj) {
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

        this.form = document.getElementsByClassName('start-page__form')[0];
    }

    render() {
        this.container.style.display = 'block';
    }

    remove() {
        this.container.style.display = 'none';
    }
}

class HTMLResultPageGraphicComponent {
    constructor() {
        this.container = document.getElementsByClassName('result-page')[0];

        this.nameField = document.getElementsByClassName('result-page__name')[0];
        this.lastNameField = document.getElementsByClassName('result-page__last-name')[0];
        this.difficultyField = document.getElementsByClassName('result-page__difficulty')[0];
        this.timeField = document.getElementsByClassName('result-page__time')[0];
    }

    render() {
        this.container.style.display = 'block';
    }

    remove() {
        this.container.style.display = 'none';
    }

    set name(name) {
        this.nameField.innerText = name;
    }

    set lastName(lastName) {
        this.lastNameField.innerText = lastName;
    }

    set difficulty(difficulty) {
        this.difficultyField.innerText = difficulty;
    }

    set time(time) {
        this.timeField.innerText = time;
    }
}

class HTMLTopPageGraphicComponent{
    constructor() {
        this.element = document.getElementsByClassName('top')[0];

        this.button = document.getElementsByClassName('header__top-button')[0];

        this.table = document.getElementsByClassName('top__table')[0];

        const tbody = this.table.tBodies[0];
        for (let i = 0; i < 10; i++) {
            const row = document.createElement('tr');

            for (let j = 0; j < 6; j++) {
                const td = document.createElement('td');

                if (j === 0) {
                    td.innerText = i + 1;
                }
    
                row.appendChild(td);
            }

            tbody.appendChild(row);
        }
    }

    render() {
        this.element.style.top = this.calculateTop();
        this.element.style.display = 'inline-block';
    }

    toggle() {
        this.element.style.top = this.calculateTop();
        this.element.style.display = 'inline-block' === this.element.style.display ? 'none': 'inline-block';
    }

    remove() {
        this.element.style.display = 'none';
    }

    calculateTop() {
        return this.button.getBoundingClientRect().bottom + 5 + 'px';
    }

    setRecords(records) {
        const tbody = this.table.tBodies[0];

        for (let i = 0; i < records.length &&  i < 10; i++) {
            const row = tbody.rows[i + 1];

            if (i < records.length) {
                const { name, lastName, email, time, difficulty } = records[i];

                row.cells[1].innerText = email;  
                row.cells[2].innerText = name;  
                row.cells[3].innerText = lastName;  
                row.cells[4].innerText = difficulty;  
                row.cells[5].innerText = time;  
            } else {
                row.cells[1].innerText = '';  
                row.cells[2].innerText = '';  
                row.cells[3].innerText = '';  
                row.cells[4].innerText = '';  
                row.cells[5].innerText = '';  
            }            

        }
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

    get difficulty() {
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

    get skirt() {
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

    get name() {
        return this.graphicComponent.firstNameInput.value;
    }

    get lastName() {
        return this.graphicComponent.lastNameInput.value;
    }

    get email() {
        return this.graphicComponent.emailInput.value;
    }
}

class StorageManager {
    constructor() {
        this.keys = [];
        this.records = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            if (key.match(/match-match-game/)) {
                this.keys.push(key);
            }
        }

        this.parseRecords();        
    }

    saveResult(name, lastName, email, difficulty, time) {
        this.records.push({
            name,
            lastName,
            email,
            difficulty,
            time
        });

        this.records.sort((l, r) => l.time - r.time);

        for (let i = 0; i < this.records.length && i < 10; i++) {
            const { name, lastName, email, difficulty, time } = this.records[i];

            const record = `name=${name};lastName=${lastName};email=${email};difficulty=${difficulty};time=${time};`;
            localStorage.setItem('match-match-game=' + i, record);
        }
    }

    parseRecords() {
        for (let i = 0; i < this.keys.length; i++) {
            const record = localStorage.getItem(this.keys[i]).split(';');

            const name = record[0].split('=')[1],
            lastName = record[1].split('=')[1],
            email = record[2].split('=')[1],
            difficulty = record[3].split('=')[1],
            time = record[4].split('=')[1];

            const recordObject = {
                name,
                lastName,
                email,
                difficulty,
                time,
            }

            this.records.push(recordObject);
        }
    }

    get sortedRecords() {
        this.records.sort((l, r) => l.time - r.time);
        return this.records;
    }
}

class TopPage {
    constructor(storageManager, timeFormatF) {
        this.graphicComponent = new HTMLTopPageGraphicComponent();
        this.timeFormatF = timeFormatF;

        this.toggle = this.toggle.bind(this, storageManager);
        this.graphicComponent.button.addEventListener('click', this.toggle);
    }

    render() {
        this.container.style.display = 'block';
    }

    remove() {
        this.container.style.display = 'none';
    }

    toggle(storageManager) {
        this.setRecords(storageManager.sortedRecords);

        this.graphicComponent.toggle();
    }

    setRecords(records) {
        const formatedRecords = records.map(e => {
            return {
                name: e.name,
                lastName: e.lastName,
                email: e.email,
                difficulty: e.difficulty,
                time: this.timeFormatF(e.time)
            };
        });

        this.graphicComponent.setRecords(formatedRecords);
    }
}

class ResultPage {
    constructor() {
        this.graphicComponent = new HTMLResultPageGraphicComponent();
    }

    set name(name) {
        this.graphicComponent.name = name;
    }

    set lastName(lastName) {
        this.graphicComponent.lastName = lastName;
    }

    set difficulty(difficulty) {
        this.graphicComponent.difficulty = difficulty;
    }

    set time(time) {
        this.graphicComponent.time = time;
    }

    render() {
        this.graphicComponent.render();
    }

    remove() {
        this.graphicComponent.remove();
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
        }
    }

    match() {
        this.matched = true;
        this.graphicComponent.topSide.style.cursor = 'default';
        this.graphicComponent.bottomSide.style.cursor = 'default';
       
        setTimeout(() => {
            this.graphicComponent.card.classList.add('card-disappear-animation');
        }, 1250);
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
        this.running = true;

        this.player = new Player();
        this.startPage = new StartPage();
        this.resultPage = new ResultPage();
        this.storageManager = new StorageManager();
        this.topPage = new TopPage(this.storageManager, this.timer.formatTime);
    
        this.start = this.start.bind(this);
        this.main = this.main.bind(this);

        this.startPage.graphicComponent.form.addEventListener('submit', this.start);

        this.startPage.render();
    }

    start(e) {
        e.preventDefault();

        this.count = this.startPage.difficulty;
        this.skirt = this.startPage.skirt;

        this.player.name = this.startPage.name;
        this.player.lastName = this.startPage.lastName;
        this.player.email = this.startPage.email;

        const randomSequence = createCards(this.count);

        for (let i = 0; i < this.count; i++) {
            const value = Math.floor(randomSequence[i].value / 2);
            this.cards.push(new Card(this.skirt, bottomCards[value], value, this.player));
        }

        this.resultPage.name = this.player.name;
        this.resultPage.lastName = this.player.lastName;
        this.resultPage.difficulty = this.count;

        this.startPage.remove();

        const header = document.getElementsByClassName('header')[0];

        const container = document.createElement('div');
        container.classList.add('cards');
        document.body.appendChild(container);

        this.cards.forEach((e) => {e.render(container);});
        this.timer.render(header);

        this.main();
    }

    main() {
        if (this.running) {
            requestAnimationFrame(this.main);
        } else {
            this.end();
        }
        

        this.update();

        this.render();
    }

    end() {
        this.timer.terminate();

        const { name, lastName, email } = this.player,
        difficulty = this.count,
        time = this.timer.time,
        formatedTime = this.timer.formatedTime;

        this.storageManager.saveResult(name, lastName, email, difficulty, time);

        this.resultPage.time = formatedTime;

        this.resultPage.render();
    }

    render() {
        this.timer.render();
    }

    update() {
        const matched = this.player.match();

        if (matched.length > 0) {
            this.matchedCards = [...this.matchedCards, ...matched];
        }

        if (this.matchedCards.length === this.count) {
            this.running = false;
        }
    }
}


const game = new Game();
