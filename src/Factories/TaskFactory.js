import countryMap from '../dictionaries/countryMap';
import nameTaskMap from '../dictionaries/nameTaskMap';
import SolveExpressionTaskWindow from '../UI/ModalWindows/TaskModalWindow/SolveExpressionTaskWindow';
import TranslateTaskWindow from '../UI/ModalWindows/TaskModalWindow/TranslateTaskModalWindow';
import ListeningTaskModalWindow from '../UI/ModalWindows/TaskModalWindow/ListeningTaskModalWindow';
import ConvertFromDecToBinTaskModalWindow from '../UI/ModalWindows/TaskModalWindow/ConvertFromDecToBinTaskModalWindow';
import SetPointAtChartTaskModalWindow from '../UI/ModalWindows/TaskModalWindow/SetPointAtChartTaskModalWindow';
import NameTaskModalWindow from '../UI/ModalWindows/TaskModalWindow/NameTaskModalWindow';
import CompareTwoNumbersTaskModalWindow from '../UI/ModalWindows/TaskModalWindow/CompareTwoNumbersTaskModalWindow';
import ContinueNumberSequenceTaskModalWindow from '../UI/ModalWindows/TaskModalWindow/ContinueNumberSequenceTaskModalWindow';
import NumberCompositionTaskModalWindow from '../UI/ModalWindows/TaskModalWindow/NumberCompositionTaskModalWindow';
import ChoseRightOperationTaskModalWindow from '../UI/ModalWindows/TaskModalWindow/ChoseRightOperationTaskModalWindow';
import NameColorTaskModalWindow from '../UI/ModalWindows/TaskModalWindow/NameColorTaskModalWindow';
import CalculateTriangleAreaTaskModalWindow from '../UI/ModalWindows/TaskModalWindow/CalculateTriangleAreaTaskModalWindow';
import CountryCapitalTaskModalWindow from '../UI/ModalWindows/TaskModalWindow/CountryCapitalTaskModalWindow';
import InsertMissedLetterTaskModalWindow from '../UI/ModalWindows/TaskModalWindow/InsertMissedLetterTaskModalWindow';
import NameCountryByFlagImageTaskModalWindow from '../UI/ModalWindows/TaskModalWindow/NameCountryByFlagImageTaskModalWindow';

const tasks = [
    TranslateTaskWindow,                    // 1
    SolveExpressionTaskWindow,              // 2
    SetPointAtChartTaskModalWindow,         // 3
    ConvertFromDecToBinTaskModalWindow,     // 4
    NameTaskModalWindow,                    // 5
    NameCountryByFlagImageTaskModalWindow,  // 6
    NumberCompositionTaskModalWindow,       // 7
    CompareTwoNumbersTaskModalWindow,       // 8
    ContinueNumberSequenceTaskModalWindow,  // 9
    ChoseRightOperationTaskModalWindow,     // 10
    NameColorTaskModalWindow,               // 11
    CalculateTriangleAreaTaskModalWindow,   // 12
    ListeningTaskModalWindow,               // 13
    CountryCapitalTaskModalWindow,          // 14
    InsertMissedLetterTaskModalWindow,      // 15
];

export default class TaskFactory {
    constructor(uiImages, taskImages) {
        this.uiImages = uiImages;
        this.nameTaskImages = taskImages.slice(0, nameTaskMap.length);
        this.nameCountryByFlagTaskImages = taskImages.slice(nameTaskMap.length, nameTaskMap.length + countryMap.length);
    }

    createTask(top, left, width, height, parentComponent) {
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
            const index = Math.round(Math.random() * (this.nameTaskImages.length - 1));

            additionalResources.additional.name = {
                taskNames: nameTaskMap[index].names
            };

            additionalResources.images.nameImage = this.nameTaskImages[index];
        }

        if (taskConstructor === NameCountryByFlagImageTaskModalWindow) {
            const index = Math.round(Math.random() * (this.nameCountryByFlagTaskImages.length - 1));

            additionalResources.additional.nameCountryByFlag = {
                answer: countryMap[index].country.toLocaleLowerCase()
            };

            additionalResources.images.nameCountryByFlagImage = this.nameCountryByFlagTaskImages[index];
        }

        return new taskConstructor(top, left, width, height, additionalResources, parentComponent);
    }
}
