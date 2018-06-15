const navLinks = document.getElementsByClassName('nav-links')[0];
const screenShotButton = navLinks.children[0];
const developerButton = navLinks.children[1];

const screenGallery =  document.getElementsByClassName('screen-gallery')[0];

screenShotButton.addEventListener('click', () => {
    const { top: sectionTop } = document.getElementsByClassName('screen-section')[0].getBoundingClientRect();
    
    window.scroll({
        left: 0,
        top: sectionTop + document.body.scrollTop,
        behavior: "smooth"});
});

developerButton.addEventListener('click', () => {
    const { top: sectionTop } = document.getElementsByClassName('developer-section')[0].getBoundingClientRect();
    
    window.scroll({
        left: 0,
        top: sectionTop + document.body.scrollTop,
        behavior: "smooth"});
});

screenGallery.addEventListener('click', (e) => {
    const target = e.target;

    if (target.localName !== 'img' && target.localName !== 'a') {
        return;
    }

    let src;

    if (target.localName === 'img') {
        src = target.src;
    } else {
        src = target.children[0].src;
    }

    const screen = new Image();
    screen.src = src;

    screen.classList.add('screen-full');

    const screenFullWrapper = document.createElement('div');
    screenFullWrapper.classList.add('screen-full-wrapper');
    screenFullWrapper.style.top = document.body.scrollTop;

    const screenLink = document.createElement('a');
    screenLink.setAttribute('href', src);
    screenLink.classList.add('screen-link');

    document.body.style.overflow = 'hidden';

    screenLink.appendChild(screen);
    screenFullWrapper.appendChild(screenLink);

    document.body.appendChild(screenFullWrapper);

    screenFullWrapper.addEventListener('click', () => {
        document.body.removeChild(screenFullWrapper);
        document.body.style.overflow = 'auto';
    });
});
