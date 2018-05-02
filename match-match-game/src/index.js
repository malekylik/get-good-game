

const timerEl = createElement('div', 'timer', '00:00:00');
document.body.appendChild(timerEl);

const game = new Game(timerEl);

game.start();
