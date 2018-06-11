import SolveExpressionTaskWindow from '../UI/ModalWindows/TaskModalWindow/SolveExpressionTaskWindow';
import TranslateTaskWindow from '../UI/ModalWindows/TaskModalWindow/TranslateTaskModalWindow';
import ListeningTaskModalWindow from '../UI/ModalWindows/TaskModalWindow/ListeningTaskModalWindow';

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
