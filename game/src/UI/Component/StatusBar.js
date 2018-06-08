import { CompositeComponent } from "./Component";
import { getTextWidthWithCanvas } from "../../utils/textWidth";

export default class StatusBar extends CompositeComponent {
    constructor(top = 0, left = 0, width = 0, height = 0, parentComponent = null) {
        super(top, left, width, height, parentComponent);

        this.enemyInfoWindowKey = 'enemy';
        this.playerInfoWindowKey = 'player';
    }

    setEnemyInfoWindow(enemyInfoWindow) {
        const enemy = this.getChildComponent(this.enemyInfoWindowKey);

        if (enemy) {
            this.removeComponent(enemy);
        }

        this.addComponent(enemyInfoWindow, this.enemyInfoWindowKey);
    }

    setPlayerInfoWindow(playerInfoWindow) {
        const player = this.getChildComponent(this.playerInfoWindowKey);

        if (player) {
            this.removeComponent(player);
        }

        this.addComponent(playerInfoWindow, this.playerInfoWindowKey);
    }

    setEnemyInfo(name, value) {
        const enemy = this.getChildComponent(this.enemyInfoWindowKey);
        enemy.getChildComponent(enemy.healthBarKey).setValue(value);

        const label = enemy.getChildComponent(enemy.nameLabelKey);
        label.setText(name);

        const { top, left, height } = label.getClippedBoundingClientRect();
        const nameWidth = Math.ceil(getTextWidthWithCanvas(name, label.properties.textProperties.fontFamily, label.properties.textProperties.fontSize));

        label.setBoundingClientRect(top, left, nameWidth, height);
    }

    setPlayerInfo(name, value) {
        const player = this.getChildComponent(this.playerInfoWindowKey);
        player.getChildComponent(player.healthBarKey).setValue(value);

        const label = player.getChildComponent(player.nameLabelKey);
        label.setText(name);

        const { top, left, height } = label.getClippedBoundingClientRect();
        const nameWidth = Math.ceil(getTextWidthWithCanvas(name, label.properties.textProperties.fontFamily, label.properties.textProperties.fontSize));

        label.setBoundingClientRect(top, left, nameWidth, height);
    }
}
