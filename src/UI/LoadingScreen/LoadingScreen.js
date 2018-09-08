import ImageComponent from '../ImageComponent/ImageComponent';
import ProgressBar from '../Component/ProgressBar';

import { CompositeComponent } from '../Component/Component';

export default class LoadingScreen extends CompositeComponent {
    constructor(top = 0, left = 0, width = 0, height = 0, progressBarBackground, parentComponent = null) {
        super(top, left, width, height, parentComponent);
        const { naturalWidth: progressBarBackgroundWidth, naturalHeight: progressBarBackgroundHeight } = progressBarBackground;
        const progressBarBackgroundComponent = new ImageComponent(progressBarBackground, 0, 0, progressBarBackgroundWidth, progressBarBackgroundHeight, progressBarBackgroundWidth, progressBarBackgroundHeight, 0, 0, progressBarBackgroundWidth, progressBarBackgroundHeight);

        const loadingProgressBarBackgroundComponent = new CompositeComponent(0, 0, progressBarBackgroundWidth, progressBarBackgroundHeight, this);
        loadingProgressBarBackgroundComponent.alignCenter();
        loadingProgressBarBackgroundComponent.setBackgroundImage(progressBarBackgroundComponent);

        this.setBackgroundColor('#000000');

        const loadingProgressBar = new ProgressBar(0, 0, 114, 16, 0, 100, 0);
        loadingProgressBarBackgroundComponent.addComponent(loadingProgressBar);
        loadingProgressBar.alignCenter();

        loadingProgressBar.setBackgroundColor('rgba(0, 0, 0, 0)');
        loadingProgressBar.getTextComponent().setTextColor('#ffffff');

        this.loadingProgressBar = loadingProgressBar;
    }

    getLoadingProgressBar() {
        return this.loadingProgressBar;
    }
}
