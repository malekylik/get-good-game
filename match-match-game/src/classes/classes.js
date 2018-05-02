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
    constructor(timerEl) {
        this.timer = new Timer(new HTMLTimerGraphicComponent(timerEl));
        this.cards = [];
        this.matchedCards = [];

        const count = 10;

        this.player = new Player();

        const randomSequence = createCards(count);
        
        for (let i = 0; i < count; i++) {
            this.cards.push(new Card('playing-cards-by-david-kapah-ace-of-hearts.jpg', 'playing-cards-by-david-kapah-ace-of-spades.jpg', Math.floor(randomSequence[i].value / 2), this.player));
        }

        const container = document.getElementsByClassName('cards')[0];
        const header = document.getElementsByClassName('header')[0];

        this.cards.forEach((e) => {e.render(container);});
        this.timer.render(header);
    
        this.start = this.start.bind(this);
    }

    start() {
        requestAnimationFrame(this.start);
        

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
