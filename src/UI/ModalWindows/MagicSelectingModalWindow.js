import events from '../../event/events/events';
import ImageComponent from '../ImageComponent/ImageComponent';
import Label from '../Component/Label';

import { CompositeComponent } from '../Component/Component';
import { getTextWidthWithCanvas } from '../../utils/textWidth';

export default class MagicSelectingModalWindow extends CompositeComponent {
    constructor(top = 0, left = 0, width = 0, height = 0, magics = [], images = {}, parentComponent = null) {
        super(top, left, width, height, parentComponent);

        this.magics = [...magics];
        this.totalWidth = 0;

        const back = images.back;
        const { naturalWidth: backWidth, naturalHeight: backHeight } = back;

        const backImageComponent = new ImageComponent(back, 0, 0, backWidth, backHeight, backWidth, backHeight, 0, 0, backWidth, backHeight);
        this.setBackgroundImage(backImageComponent);

        this.fillWithMagics();
    }

    fillWithMagics() {
        const horizontalWidth = 5;
        const verticalWidth = 3;
        const textHeight = 16;

        this.magics.forEach((magic) => {
            const graphicComponent = magic.getGraphicComponent();
            const { width, height } = graphicComponent.getBoundingClientRect();

            const magicName = magic.getName();
            const magicNameWidth = Math.ceil(getTextWidthWithCanvas(magicName, 'monospace', textHeight));

            graphicComponent.drawBorder = true;
            graphicComponent.setBoundingClientRect(0, 0, width, height);

            const magicWithName = new CompositeComponent(horizontalWidth, this.totalWidth + horizontalWidth, width, height + verticalWidth + textHeight);
            const magicNameLabel = new Label(0, 0, magicNameWidth, textHeight, magicName);

            magicNameLabel.properties.cursor = 'auto';

            magicWithName.addComponent(graphicComponent, 'picture');
            magicWithName.addComponent(magicNameLabel, 'name');
            magicNameLabel.alignCenter();

            magicNameLabel.setBoundingClientRect(height + verticalWidth);
            magicNameLabel.setTextColor('#E8D478');
            magic.getGraphicComponent().tabable = true;

            this.addComponent(magicWithName, magic.getName());

            this.totalWidth += horizontalWidth + width;
        });
    }
    
    addMagicSelectingEventListener(name, eventCallback) {
        this.getChildComponent(this.buttonKey)
        this.magics.forEach((magic) => {
            magic.getGraphicComponent().addEventListener(name, eventCallback);
        });
    }

    findMagicByGraphicComponent(graphicComponent) {
        const magic = this.magics.find((magic) => {
            const magicGraphicComponent = magic.getGraphicComponent();
            
            return graphicComponent === magicGraphicComponent;
        });

        return magic ? magic : null;
    }

    getMagic(index) {
        return this.magics[index] || null;
    }

    selectMagic() {
          return new Promise((resolve) => {
            this.addMagicSelectingEventListener(events.MOUSE.MOUSE_UP, (e) => {
                resolve(e.target.getParentComponent().getParentComponent().findMagicByGraphicComponent(e.target));
            });

            this.addEventListener(events.KEYBOARD.KEY_PRESS, (e) => {
                if (e.payload.key === 'Enter') {
                    resolve(e.target.getParentComponent().getParentComponent().findMagicByGraphicComponent(e.target));
                }
            });
        });
    }  
}
