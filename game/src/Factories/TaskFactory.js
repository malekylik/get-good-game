import SolveExpressionTaskWindow from '../UI/ModalWindows/SolveExpressionTaskWindow';
import TranslateTaskWindow from '../UI/ModalWindows/TranslateTaskModalWindow';
import ListeningTaskModalWindow from '../UI/ModalWindows/ListeningTaskModalWindow';

const tasks = [
    SolveExpressionTaskWindow,
    TranslateTaskWindow,
    ListeningTaskModalWindow
];

export default class TaskFactory {
    createTask(top, left, width, height) {
        const taskConstructor = tasks[Math.round(Math.random() * (tasks.length - 1))];
        return new taskConstructor(top, left, width, height);
    }
}
