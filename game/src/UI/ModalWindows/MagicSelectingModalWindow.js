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

        this.magics.forEach((magic) => {
            const graphicComponent = magic.getGraphicComponent();
            const { width, height } = graphicComponent.getBoundingClientRect();

            const magicName = magic.getName();
            const magicNameWidth = Math.ceil(getTextWidthWithCanvas(magicName, 'monospace', '16px'));

            graphicComponent.setBoundingClientRect(0, 0, width, height);
            const magicWithName = new CompositeComponent(5, this.totalWidth + 5, width, height + 3 + 16);
            
            const magicNameLabel = new Label(0, 0, magicNameWidth, 16, magicName);

            magicNameLabel.properties.cursor = 'auto';

            magicWithName.addComponent(graphicComponent, 'picture');
            magicWithName.addComponent(magicNameLabel, 'name');
            magicNameLabel.alignCenter();

            magicNameLabel.setBoundingClientRect(height + 3);
            magicNameLabel.setTextColor('#E8D478');

            this.addComponent(magicWithName, magic.getName());

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
                resolve(e.target.getParentComponent().getParentComponent().findMagicByGraphicComponent(e.target));
            });
        });
    }  
}
