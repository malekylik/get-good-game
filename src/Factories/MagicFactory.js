import MagicArrow from '../Magic/MagicArrow';
import Implosion from '../Magic/Implosion';
import ImageComponent from '../UI/ImageComponent/ImageComponent';
import MagicGraphicComponent from '../GraphicComponent/MagicGraphicComponent';

import { Component } from '../UI/Component/Component';

export default class MagicFactory {
    constructor() {
        this.assets = {};
    }

    addMagicAssets(images, sound, name) {
        this.assets[name] = {
            images,
            sound
        };
    }

    createMagicArrow(damage, forEnemy = false) {
        if (!this.assets.magicArrow) {
            return null;
        }

        const top = 10;
        const left = 10;
        const scale = 2;

        const images = this.assets.magicArrow.images;

        const iconImage = images[0];
        const blowAnimationImg = images[3];
        let movingAnimationImg = images[1];

        if (forEnemy) {
            movingAnimationImg = images[2];
        }

        let { naturalWidth, naturalHeight } = movingAnimationImg;

        const animationFramesCount = 14;
        const magicMovingAnimation = new ImageComponent(movingAnimationImg, 0, 0, naturalWidth , naturalHeight, naturalWidth / animationFramesCount, naturalHeight, 0, 0, naturalWidth / animationFramesCount, naturalHeight);

        const movingAnimation = new Component(0, 0, naturalWidth / animationFramesCount, naturalHeight);
        movingAnimation.setBackgroundImage(magicMovingAnimation);
        
        ({naturalWidth, naturalHeight } = blowAnimationImg);

        const magicBlowAnimation = new ImageComponent(blowAnimationImg, 0, 0, naturalWidth , naturalHeight, naturalWidth / animationFramesCount, naturalHeight, 0, 0, naturalWidth / animationFramesCount, naturalHeight);

        const animation = new Component(0, 0, naturalWidth / animationFramesCount, naturalHeight);
        animation.setBackgroundImage(magicBlowAnimation);

        const graphicComponentInSelectingWindow = new MagicGraphicComponent(top, left, scale, iconImage);
        
        return new MagicArrow('Волшебная стрела', damage, graphicComponentInSelectingWindow, [movingAnimation, animation], this.assets.magicArrow.sound);
    }

    createImplosionArrow(damage) {
        if (!this.assets.implosion) {
            return null;
        }

        const top = 10;
        const left = 10;
        const scale = 2;

        const images = this.assets.implosion.images;

        const iconImage = images[0];
        const blowAnimationImg = images[1];

        let { naturalWidth, naturalHeight } = blowAnimationImg;

        const animationFramesCount = 19;
        const magicBlowAnimation = new ImageComponent(blowAnimationImg, 0, 0, naturalWidth , naturalHeight, naturalWidth / animationFramesCount, naturalHeight, 0, 0, naturalWidth / animationFramesCount, naturalHeight);

        const animation = new Component(0, 0, naturalWidth / animationFramesCount, naturalHeight);
        animation.setBackgroundImage(magicBlowAnimation);

        const graphicComponentInSelectingWindow = new MagicGraphicComponent(top, left, scale, iconImage);
        return new Implosion('Взрыв', damage, graphicComponentInSelectingWindow, [animation], this.assets.implosion.sound);
    }
} 
