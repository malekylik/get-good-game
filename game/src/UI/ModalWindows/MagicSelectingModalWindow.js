import events from '../../event/events/events';
import ImageComponent from '../ImageComponent/ImageComponent';

import { CompositeComponent } from '../Component/Component';

export default class MagicSelectingModalWindow extends CompositeComponent {
    constructor(top = 0, left = 0, width = 0, height = 0, magics = [], images = {}, parentComponent = null) {
        super(top, left, width, height, parentComponent);

        this.magics = [...magics];
        this.totalWidth = 0;

        const back = images.back;
        const { naturalWidth: backWidth, naturalHeight: backHeight } = back;

        const backImageComponent = new ImageComponent(back, 0, 0, backWidth, backHeight, backWidth, backHeight, 0, 0, backWidth, backHeight);
        this.setBackgroundImage(backImageComponent);

        this.magics.forEach((magic) => {
            const graphicComponent = magic.getGraphicComponent();
            const { width, height } = graphicComponent.getBoundingClientRect();

            graphicComponent.setBoundingClientRect(5, this.totalWidth + 5, width, height);

            this.addComponent(graphicComponent, magic.getName());

            this.totalWidth += 5 + width;
        });
    }

    
    addMagicSelectingEventListener(name, event) {
        this.getChildComponent(this.buttonKey)
        this.magics.forEach((magic) => {
            magic.getGraphicComponent().addEventListener(name, event);
        });
    }

    findMagicByGraphicComponent(graphicComponent) {
        const magic = this.magics.find((magic) => {
            const magicGraphicComponent = magic.getGraphicComponent();
            
            return graphicComponent === magicGraphicComponent;
        });

        return magic ? magic : null;
    }

    selectMagic() {
        return new Promise((resolve) => {
            this.addMagicSelectingEventListener(events.MOUSE.MOUSE_DOWN, (e) => {
                resolve(e.target.getParentComponent().findMagicByGraphicComponent(e.target));
            });
        });
    }  
}
