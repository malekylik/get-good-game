import ImageComponent from "../ImageComponent/ImageComponent";

import { Component, CompositeComponent } from "./Component";
import { getTextWidthWithCanvas } from "../../utils/textWidth";

export default class StatusBar extends CompositeComponent {
    constructor(top = 0, left = 0, width = 0, height = 0, images = {}, parentComponent = null) {
        super(top, left, width, height, parentComponent);

        this.enemyInfoWindowKey = 'enemy';
        this.playerInfoWindowKey = 'player';

        const back = images.back;
        const leftImg = images.left;
        const right = images.right;
    
        const { naturalWidth: backWidth, naturalHeight: backHeight } = back;
        const { naturalWidth: leftWidth, naturalHeight: leftHeight } = leftImg;
        const { naturalWidth: rightWidth, naturalHeight: rightHeight } = right;

        const backImgComponent = new ImageComponent(back, 0, 0, backWidth, backHeight, backWidth, backHeight, 0, 0, backWidth, backHeight);
        const leftImgComponent = new ImageComponent(leftImg, 0, 0, leftWidth, leftHeight, leftWidth, leftHeight, 0, 0, leftWidth, leftHeight);
        const rightImgComponent = new ImageComponent(right, 0, 0, rightWidth, rightHeight, rightWidth, rightHeight, 0, 0, rightWidth, rightHeight);
     
        let totalWidth = 0;

        while (totalWidth < width) {
            const component = new Component(0, totalWidth, backWidth, backHeight);

            component.setBackgroundImage(backImgComponent);
            this.addComponent(component);

            totalWidth += backWidth;
        }

        const leftComponent = new Component(0, 0, leftWidth, leftHeight);

        leftComponent.setBackgroundImage(leftImgComponent);
        this.addComponent(leftComponent);

        const rightComponent = new Component(0, width - rightWidth, rightWidth, rightHeight);

        rightComponent.setBackgroundImage(rightImgComponent);
        this.addComponent(rightComponent);
    }

    getPlayerInfoWindow() {
        return this.getChildComponent(this.playerInfoWindowKey);
    }

    getEnemyInfoWindow() {
        return this.getChildComponent(this.enemyInfoWindowKey);
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

        const { top, left, height } = label.getBoundingClientRect();
        const nameWidth = Math.ceil(getTextWidthWithCanvas(name, label.properties.textProperties.fontFamily, label.properties.textProperties.fontSize));

        label.setBoundingClientRect(top, left, nameWidth, height);
    }

    setPlayerInfo(name, value) {
        const player = this.getChildComponent(this.playerInfoWindowKey);
        player.getChildComponent(player.healthBarKey).setValue(value);

        const label = player.getChildComponent(player.nameLabelKey);
        label.setText(name);

        const { top, left, height } = label.getBoundingClientRect();
        const nameWidth = Math.ceil(getTextWidthWithCanvas(name, label.properties.textProperties.fontFamily, label.properties.textProperties.fontSize));

        label.setBoundingClientRect(top, left, nameWidth, height);
    }
}
