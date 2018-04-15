class NotificationRenderComponent {
    constructor(notificationText) {
        this.element = this.createNotificationElement(notificationText);

        this.removeNotification = this.removeNotification.bind(this);

        this.exitButton.addEventListener('click', this.removeNotification);
    }

    render() {
        document.body.appendChild(this.element);
    }

    removeNotification() {
        document.body.removeChild(this.element);
    }

    createNotificationElement(notificationTexts) {
        const element = document.createElement('div');
        element.classList.add('notification');

        const exitButton = document.createElement('button');
        exitButton.classList.add('notification__exit-button');
        exitButton.innerText = 'X';

        const notificationTextsContainer = document.createElement('div');
        notificationTextsContainer.classList.add('notification__texts-container');


        for (let i = 0; i < notificationTexts.length; i++) {
            const notificationP = document.createElement('p');
            notificationP.classList.add('notification__text');
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
        inputs.classList.add('notification__gallery-controls');
        
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
            galleryRadio.type = 'radio';
            galleryRadio.name = 'notification';

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
        inputs.appendChild(galleryControls);

        element.appendChild(exitButton);
        element.appendChild(notificationTextsContainer);
        element.appendChild(inputs);

        this.checkBox = checkBox;
        this.exitButton = exitButton;

        return element;
    }
}


class Notification {
    constructor(notifications = ['']) {
        this.notifications = notifications;

        this.notificationRenderComponent = new NotificationRenderComponent(this.notifications);

        this.disabled = window.sessionStorage.getItem('disabled');

        if (this.disabled === null) {
            this.disabled = false;
        } else {
            this.disabled = this.disabled;
        }

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
}

window.onload = () => {

    const notification = new Notification( ['m ', 'sdf', 'sdaf', 'sdf'] );

    setTimeout(() => {
        notification.render();
    }, 5000);
}
