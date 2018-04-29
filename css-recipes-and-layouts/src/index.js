let activeTab;

const create320NavElements = () => {
    const navButton320 = document.createElement('button');
    navButton320.classList.add('header__nav-option');
    
    const navButton320Icon = document.createElement('i');
    navButton320Icon.classList.add('fas');
    navButton320Icon.classList.add('fa-bars');
    navButton320.appendChild(navButton320Icon);
    
    const navUl320 = document.createElement('ul');
    navUl320.classList.add('header__menu-buttons');
    
    const navLi1 = document.createElement('li');
    navLi1.innerText = '?';
    
    const navLi2 = document.createElement('li');
    navLi2.innerText = '!';
    
    const navLi3 = document.createElement('li');
    const navLi3Icon = document.createElement('i');
    navLi3Icon.classList.add('fas');
    navLi3Icon.classList.add('fa-tag');
    navLi3Icon.classList.add('tag_reverse');
    navLi3.appendChild(navLi3Icon);
    
    navUl320.appendChild(navLi1);
    navUl320.appendChild(navLi2);
    navUl320.appendChild(navLi3);

    return [navUl320, navButton320];
};

const create768NavElements = () => {
    const navButtonLeft = document.createElement('button');
    navButtonLeft.innerText = '?';
    navButtonLeft.classList.add('header__nav-button');
    
    const navButtonRight = document.createElement('button');
    navButtonRight.innerText = '!';
    navButtonRight.classList.add('header__nav-button');

    const tabs = document.createElement('ul');
    tabs.classList.add('header__nav-tabs');

    const tab1 = document.createElement('li');
    const tabA1 = document.createElement('a');
    tabA1.innerText = 'JAVASCRIPT';
    tab1.appendChild(tabA1);

    const tab2 = document.createElement('li');
    const tabA2 = document.createElement('a');
    tabA2.innerText = 'CSS';
    tab2.appendChild(tabA2);

    const tab3 = document.createElement('li');
    const tabA3 = document.createElement('a');
    tabA3.innerText = 'LATES';
    tab3.appendChild(tabA3);

    const tab4 = document.createElement('li');
    const tabA4 = document.createElement('a');
    tabA4.innerText = 'HTML';
    tab4.classList.add('header__nav-tab_active');
    activeTab = tab4;
    tab4.appendChild(tabA4);

    const tab5 = document.createElement('li');
    const tabA5 = document.createElement('a');
    tabA5.innerText = 'DESIGH';
    tab5.appendChild(tabA5);

    tabs.appendChild(tab1);
    tabs.appendChild(tab2);
    tabs.appendChild(tab3);
    tabs.appendChild(tab4);
    tabs.appendChild(tab5);

    return [navButtonLeft, tabs, navButtonRight];
};

const tabPressHandler = (e) => {
    let target = e.target;

    while (target !== null && target.localName !== 'li') {
        target = target.parentNode;
    }

    if (target === null || target.localName !== 'li') {
        return;
    }

    activeTab.classList.remove('header__nav-tab_active');
    target.classList.add('header__nav-tab_active');
    activeTab = target;
};

const nav320 = create320NavElements();
const nav768 = create768NavElements();

const nav = document.getElementsByClassName('header__nav')[0];
nav.addEventListener('click', tabPressHandler);

let devices = -1;
const onResize = () => {
    const contentWidth = document.body.clientWidth;

    if (contentWidth < 768 && devices !== 'phone') {
        while(nav.children.length !== 0) {
            nav.removeChild(nav.children[0]);
        }

        nav320.forEach((e) => {
            nav.appendChild(e);
        })

        devices = 'phone';
    }

    if (contentWidth >= 768 && contentWidth < 1024 && devices !== 'tablet') {
        while(nav.children.length !== 0) {
            nav.removeChild(nav.children[0]);
        }

        nav768.forEach((e) => {
            nav.appendChild(e);
        })

        devices = 'tablet';
    }
};



window.addEventListener('resize', onResize);

onResize();
