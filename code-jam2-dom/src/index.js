class NotificationRenderComponent {
    constructor(notificationText) {
        this.element = this.createNotificationElement(notificationText);

        this.removeNotification = this.removeNotification.bind(this);

        this.exitButton.addEventListener('click', this.removeNotification);

        this.NOTIFICATION_TEXT_WIDTH = 330;
        this.RADIO_BUTTON_WIDTH = 21;
    }

    render() {
        document.body.appendChild(this.element);
    }

    removeNotification() {
        document.body.removeChild(this.element);
    }

    repaint(index) {
        this.galleryRadiosContainer.children[index].checked = true;

        this.notificationFirstParagraph.style.marginLeft = (-index * this.NOTIFICATION_TEXT_WIDTH) + 'px';

        index -= 1;

        if (index >= 0) {
            this.galleryRadiosContainer.children[0].style.marginLeft = (-index * this.RADIO_BUTTON_WIDTH) + 'px';
        }
    }

    createNotificationElement(notificationTexts) {
        const element = document.createElement('div');
        element.classList.add('notification');

        const exitButton = document.createElement('button');
        exitButton.classList.add('notification__exit-button');
        exitButton.innerText = 'X';

        const notificationTextsContainerWrapper = document.createElement('div');
        notificationTextsContainerWrapper.classList.add('notification__texts-container-wrapper');

        const notificationTextsContainer = document.createElement('div');
        notificationTextsContainer.classList.add('notification__texts-container');

        for (let i = 0; i < notificationTexts.length; i++) {
            const notificationP = document.createElement('p');
            notificationP.classList.add('notification__text');
            notificationP.classList.add('left-shift-animation');
            notificationP.innerText = notificationTexts[i];

            notificationTextsContainer.appendChild(notificationP)
        }

        const inputs = document.createElement('div');
        inputs.classList.add('notification__inputs');

        const checkBoxContainer = document.createElement('p');
        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.id = 'notification__disable-checkbox';

        const checkBoxLabel = document.createElement('label');
        checkBoxLabel.htmlFor = 'notification__disable-checkbox';
        checkBoxLabel.innerText = 'Disable Tips';

        const galleryControls = document.createElement('div');
        galleryControls.classList.add('notification__gallery-controls');
        
        const galleryPrev = document.createElement('input');
        galleryPrev.type = 'button';
        galleryPrev.value = '<';

        const galleryNext = document.createElement('input');
        galleryNext.type = 'button';
        galleryNext.value = '>';

        const galleryRadiosContainer = document.createElement('div');
        galleryRadiosContainer.classList.add('notification__gallery-radio-buttons');

        for (let i = 0; i < notificationTexts.length; i++) {
            const galleryRadio = document.createElement('input');
            galleryRadio.classList.add('left-shift-animation');
            galleryRadio.type = 'radio';
            galleryRadio.name = 'notification';
            galleryRadio.dataset.number = i;

            if (i === 0) {
                galleryRadio.checked = true;
            }

            galleryRadiosContainer.appendChild(galleryRadio)
        }

        checkBoxContainer.appendChild(checkBox);
        checkBoxContainer.appendChild(checkBoxLabel);

        galleryControls.appendChild(galleryPrev);
        galleryControls.appendChild(galleryRadiosContainer);
        galleryControls.appendChild(galleryNext);

        inputs.appendChild(checkBoxContainer);

        if (notificationTexts.length >= 1) {
            inputs.appendChild(galleryControls);
        }

        notificationTextsContainerWrapper.appendChild(notificationTextsContainer);

        element.appendChild(exitButton);
        element.appendChild(notificationTextsContainerWrapper);
        element.appendChild(inputs);

        this.checkBox = checkBox;
        this.exitButton = exitButton;
        this.galleryNext = galleryNext;
        this.galleryPrev = galleryPrev;

        this.galleryRadiosContainer = galleryRadiosContainer;
        this.galleryControls = galleryControls;
        this.notificationFirstParagraph = notificationTextsContainer.children[0];

        return element;
    }
}


class Notification {
    constructor(notifications = []) {
        this.notifications = notifications;
        this.currentNotificationIndex = 0;

        this.notificationRenderComponent = new NotificationRenderComponent(this.notifications);

        this.disabled = window.sessionStorage.getItem('disabled');

        if (this.disabled === null) {
            this.disabled = false;
        } else {
            this.disabled = this.disabled;
        }
        this.changeIndexHandler = this.changeIndexHandler.bind(this);

        this.notificationRenderComponent.galleryControls.addEventListener('click', this.changeIndexHandler);
        this.notificationRenderComponent.checkBox.addEventListener('change', this.disableHandler);
    }

    render() {
        if (this.disabled !== 'true') {
            this.notificationRenderComponent.render();
        }
    }

    disableHandler(e) {
        window.sessionStorage.setItem('disabled', e.target.checked);
    }

    changeIndexHandler(e) {
        const target = e.target,
        prevIndex = this.currentNotificationIndex;

        if (target === this.notificationRenderComponent.galleryPrev) {
            if (this.currentNotificationIndex > 0) {
                this.currentNotificationIndex -= 1;
            }
        } else if (target === this.notificationRenderComponent.galleryNext) {
            if (this.currentNotificationIndex < this.notifications.length - 1) {
                this.currentNotificationIndex += 1;
            }
        } else if (target.type === 'radio') {
            this.currentNotificationIndex = parseInt(target.dataset.number, 10);
        }

        if (prevIndex !== this.currentNotificationIndex) {
            this.notificationRenderComponent.repaint(this.currentNotificationIndex);
        }
    }
}

window.onload = () => {
    const firstP = 
    `Lorem ipsum dolor sit amet,
    consectetur adipiscing elit.
    Praesent ultricies eros in turpis aliquam,
    quis posuere mauris auctor. Sed aliquet enim magna,
    dictum sodales magna luctus nec.
    Sed in nulla sollicitudin,
    ullamcorper risus vel, ultrices dui.
    Sed lectus mauris, tincidunt ut magna ut,
    rutrum dignissim eros.`;
    
    const secondP = 
    `Fusce viverra placerat nulla,
    et maximus nunc consectetur et.
    Duis eget lectus vitae ante ornare sagittis sit amet sit amet nisi.
    Duis cursus nunc nec faucibus aliquet.
    Integer ut tortor at est scelerisque venenatis congue vel elit.
    Pellentesque habitant morbi tristique senectus
    et netus et malesuada fames ac turpis egestas.
    Morbi sed consequat tortor. `;

    const thirdP = `third`;

    const fourthP = 
    `Vivamus quis ultricies urna.
    Integer augue velit, ullamcorper ut est consectetur, iaculis porta mi.
    Duis luctus tempus vestibulum. Lorem ipsum dolor sit amet,
    consectetur adipiscing elit.
    In hendrerit eleifend tortor eu tempor.`;

    const fifthP = `fifth`;

    const notification = new Notification( [firstP, secondP, thirdP, fourthP, fifthP] );

    setTimeout(() => {
        notification.render();
    }, 5000);
}
