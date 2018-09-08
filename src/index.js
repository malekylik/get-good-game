import Game from './Game/Game';

const tab = 9;
const space = 32;
const leftArrow = 37;
const upArrow = 38;
const rightArrow = 39;
const downArrow = 40;

window.onload = () => {
    window.addEventListener("keydown", function(e) {
        if([tab, space, leftArrow, upArrow, rightArrow, downArrow].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);

    const game = new Game();
 };
 