import Label from "./Label";
import { CompositeComponent } from "./Component";
import { getTextWidthWithCanvas } from "../../utils/textWidth";
import ProgressBar from "./ProgressBar";

export default class CharacterInfoWindow extends CompositeComponent {
    constructor(top = 0, left = 0, width = 0, height = 0, characterName = '', minHP, maxHP, initialHP, parentComponent = null) {
        super(top, left, width, height, parentComponent);

        const nameWidth = Math.ceil(getTextWidthWithCanvas(`${characterName}:`, 'monospace', 16)) + 1;

        const nameLabel = new Label(3, 3, nameWidth + 1, 16, `${characterName}:`);

        const healthBar = new ProgressBar(16 + 7, 3, width - 10, 25, minHP, maxHP, initialHP);

        this.nameLabelKey = 'namelabel';
        this.healthBarKey = 'healtbar';

        this.addComponent(nameLabel, this.nameLabelKey);
        this.addComponent(healthBar, this.healthBarKey);
    }
}
