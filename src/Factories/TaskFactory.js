import SolveExpressionTaskWindow from '../UI/ModalWindows/TaskModalWindow/SolveExpressionTaskWindow';
import TranslateTaskWindow from '../UI/ModalWindows/TaskModalWindow/TranslateTaskModalWindow';
import ListeningTaskModalWindow from '../UI/ModalWindows/TaskModalWindow/ListeningTaskModalWindow';
import ConvertFromDecToBinTaskModalWindow from '../UI/ModalWindows/TaskModalWindow/ConvertFromDecToBinTaskModalWindow';

const tasks = [
    SolveExpressionTaskWindow,
    TranslateTaskWindow,
    ListeningTaskModalWindow,
    ConvertFromDecToBinTaskModalWindow
];

export default class TaskFactory {
    constructor(uiImages) {
        this.uiImages = uiImages;
    }

    createTask(top, left, width, height) {
        const imageObj = {
            textFieldImage: this.uiImages[1],
            modalWindowImage: this.uiImages[2],
            okButtonImage: this.uiImages[3],
            microButtonImage: this.uiImages[4],
        };

        const taskConstructor = tasks[Math.round(Math.random() * (tasks.length - 1))];
        const task = new taskConstructor(top, left, width, height, imageObj);

        return task;
    }
}
