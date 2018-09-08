import Label from "./Label";
import ProgressBar from "./ProgressBar";
import ImageComponent from "../ImageComponent/ImageComponent";

import { CompositeComponent } from "./Component";
import { getTextWidthWithCanvas } from "../../utils/textWidth";

export default class CharacterInfoWindow extends CompositeComponent {
    constructor(top = 0, left = 0, width = 0, height = 0, characterName = '', minHP, maxHP, initialHP, images = {}, parentComponent = null) {
        super(top, left, width, height, parentComponent);

        const labelTop = 15;
        const labelHeight = 16;
        const nameWidth = Math.ceil(getTextWidthWithCanvas(`${characterName}:`, 'monospace', labelHeight));

        const nameLabel = new Label(labelTop, 10, nameWidth + 1, labelHeight, `${characterName}:`);

        const gapBetweenLabelAndHealthBarHeight = 3;
        const leftAndRightMarginsForHealthBarWidth = 24;
        const healthBar = new ProgressBar(labelHeight + labelTop + gapBetweenLabelAndHealthBarHeight, 10, width - leftAndRightMarginsForHealthBarWidth, 25, minHP, maxHP, initialHP);

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
