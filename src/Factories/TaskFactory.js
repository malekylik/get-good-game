import nameTaskMap from '../dictionary/nameTaskMap';
import SolveExpressionTaskWindow from '../UI/ModalWindows/TaskModalWindow/SolveExpressionTaskWindow';
import TranslateTaskWindow from '../UI/ModalWindows/TaskModalWindow/TranslateTaskModalWindow';
import ListeningTaskModalWindow from '../UI/ModalWindows/TaskModalWindow/ListeningTaskModalWindow';
import ConvertFromDecToBinTaskModalWindow from '../UI/ModalWindows/TaskModalWindow/ConvertFromDecToBinTaskModalWindow';
import SetPointAtChartTaskModalWindow from '../UI/ModalWindows/TaskModalWindow/SetPointAtChartTaskModalWindow';
import NameTaskModalWindow from '../UI/ModalWindows/TaskModalWindow/NameTaskModalWindow';
import CompareTwoNumbersTaskModalWindow from '../UI/ModalWindows/TaskModalWindow/CompareTwoNumbersTaskModalWindow';

const tasks = [
    TranslateTaskWindow,
    SolveExpressionTaskWindow,
    SetPointAtChartTaskModalWindow,
    ConvertFromDecToBinTaskModalWindow,
    NameTaskModalWindow,
    CompareTwoNumbersTaskModalWindow,
    ListeningTaskModalWindow,
];

export default class TaskFactory {
    constructor(uiImages, taskImages) {
        this.uiImages = uiImages;
        this.taskImages = taskImages;
    }

    createTask(top, left, width, height) {
        const additionalResources = {
            images: {
                textFieldImage: this.uiImages[1],
                modalWindowImage: this.uiImages[2],
                okButtonImage: this.uiImages[3],
                microButtonImage: this.uiImages[4],
            },
            additional: {

            }
        };

        const taskConstructor = tasks[Math.round(Math.random() * (tasks.length - 1))];

        if (taskConstructor === NameTaskModalWindow) {
            const index = Math.round(Math.random() * (this.taskImages.length - 1));

            additionalResources.additional.name = {
                taskNames: nameTaskMap[index].names
            };

            additionalResources.images.nameImage = this.taskImages[index];
        }

        const task = new taskConstructor(top, left, width, height, additionalResources);

        return task;
    }
}
