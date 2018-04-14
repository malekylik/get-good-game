class NotificationRenderComponent {
    constructor(notificationText) {
        this.element = this.createNotificationElement(notificationText);
    }

    render() {
        document.body.appendChild(this.element);
    }

    createNotificationElement(notificationText) {
        const element = document.createElement('div');
        element.classList.add('notification');

        const exitButton = document.createElement('button');
        exitButton.classList.add('notification__exit-button');
        exitButton.innerText = 'X';

        const notificationP = document.createElement('p');
        notificationP.classList.add('notification__text');
        notificationP.innerText = notificationText;

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

        for (let i = 0; i < 4; i++) {
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
        element.appendChild(notificationP);
        element.appendChild(inputs);

        return element;
    }
}


class Notification {
    constructor(notifications = ['']) {
        this.notifications = notifications;

        this.notificationRenderComponent = new NotificationRenderComponent(this.notifications[0]);
    }

    render() {
        this.notificationRenderComponent.render();
    }
}

const notification = new Notification( ['ad'] );

notification.render();
