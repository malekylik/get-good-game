import Label from "./Label";
import ProgressBar from "./ProgressBar";
import ImageComponent from "../ImageComponent/ImageComponent";

import { CompositeComponent } from "./Component";
import { getTextWidthWithCanvas } from "../../utils/textWidth";

export default class CharacterInfoWindow extends CompositeComponent {
    constructor(top = 0, left = 0, width = 0, height = 0, characterName = '', minHP, maxHP, initialHP, images = {}, parentComponent = null) {
        super(top, left, width, height, parentComponent);

        const nameWidth = Math.ceil(getTextWidthWithCanvas(`${characterName}:`, 'monospace', 16)) + 1;

        const nameLabel = new Label(15, 10, nameWidth + 1, 16, `${characterName}:`);

        const healthBar = new ProgressBar(16 + 15 + 3, 10, width - 24, 25, minHP, maxHP, initialHP);

        this.nameLabelKey = 'namelabel';
        this.healthBarKey = 'healtbar';

        nameLabel.setTextColor('#ffffff');

        const { naturalWidth: imgWidth, naturalHeight: imgHeight } = images.back;

        const backImageComponent = new ImageComponent(images.back, 0, 0, imgWidth, imgHeight, imgWidth, imgHeight, 0, 0, imgWidth, imgHeight);

        this.addComponent(nameLabel, this.nameLabelKey);
        this.addComponent(healthBar, this.healthBarKey);

        this.setBackgroundImage(backImageComponent);
    }

    getHealthBar() {
        return this.getChildComponent(this.healthBarKey);
    }
}
