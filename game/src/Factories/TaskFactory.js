import SolveExpressionTaskWindow from '../UI/ModalWindows/SolveExpressionTaskWindow';
import TranslateTaskWindow from '../UI/ModalWindows/TranslateTaskModalWindow';

const tasks = [
    SolveExpressionTaskWindow,
    TranslateTaskWindow,
];

export default class TaskFactory {
    createTask(top, left, width, height) {
        const taskConstructor = tasks[Math.round(Math.random() * (tasks.length - 1))];
        return new taskConstructor(top, left, width, height);
    }
}
