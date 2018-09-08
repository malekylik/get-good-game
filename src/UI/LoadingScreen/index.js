import Canvas from '../../Canvas/Canvas';
import LoadingScreen from './LoadingScreen';
import LoadManager from '../../Managers/LoadManager';

import { createFilePromise } from '../../utils/file';

window.onload = async () => {
    const createLoadingScreen = async () => {
        const { width: canvasWidth, height: canvasHeight } = canvas.getSize();
        const progressBarBackground = new Image();
        progressBarBackground.src = './assets/images/ui/bardata.jpg';
        await createFilePromise(progressBarBackground);

        const loadingScreen = new LoadingScreen(0, 0, canvasWidth, canvasHeight, progressBarBackground);

        return loadingScreen;
    };

    const loadManager = new LoadManager();
    const canvas = new Canvas(800, 600);
    let loadingScreen;
    let loadingProgressBar;

    loadManager.addUrl({
                sound: ['./assets/sound/CHEST.mp3'],
            }, {
                sound: 'sample'
            });

    createLoadingScreen().then(async (_loadingScreen) => {
        loadingScreen = _loadingScreen;
        loadingProgressBar = loadingScreen.getLoadingProgressBar();

        canvas.addScene(loadingScreen);

        await loadManager.calculateTotalSize();
        await loadManager.load((loadedPercentage) => loadingProgressBar.setValue(loadedPercentage));

        const audio = document.createElement('audio');
        audio.setAttribute('controls', true);

        const source = document.createElement('source'); 
        source.setAttribute('src', loadManager.getSoundByName('sample')[0].src);
        source.setAttribute('type', 'audio/mpeg');

        audio.appendChild(source);
        document.body.appendChild(audio);

        audio.addEventListener('timeupdate', (e) => {
            loadingProgressBar.setValue(Math.round(e.target.currentTime / audio.duration * 100));
        });

        loadingProgressBar.setValue(0)
    });

    let prevTime = 0;
    const main = (time) => {
        requestAnimationFrame(main);

        if (time !== undefined) {
            if (prevTime === undefined) {
                prevTime = time;
            }

            render(time - prevTime)

            prevTime = time;
        }
    }

    const render = (timeStamp) => {
        canvas.draw(timeStamp);
    }

    main(0);
};
