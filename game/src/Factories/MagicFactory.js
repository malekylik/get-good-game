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

        const images = this.assets.magicArrow.images;
        const sound = this.assets.magicArrow.sound;

        const img = images[0];
        let movingAnimationImg = images[1];
        const blowAnimationImg = images[3];

        if (forEnemy) {
            movingAnimationImg = images[2];
        }

        let { naturalWidth, naturalHeight } = movingAnimationImg;

        const magicMovingAnimation = new ImageComponent(movingAnimationImg, 0, 0, naturalWidth , naturalHeight, naturalWidth / 14, naturalHeight, 0, 0, naturalWidth / 14, naturalHeight);

        const movingAnimation = new Component(0, 0, naturalWidth / 14, naturalHeight);
        movingAnimation.setBackgroundImage(magicMovingAnimation);
        
        ({naturalWidth, naturalHeight } = blowAnimationImg);

        const magicBlowAnimation = new ImageComponent(blowAnimationImg, 0, 0, naturalWidth , naturalHeight, naturalWidth / 14, naturalHeight, 0, 0, naturalWidth / 14, naturalHeight);

        const animation = new Component(0, 0, naturalWidth / 14, naturalHeight);
        animation.setBackgroundImage(magicBlowAnimation);

        const graphicComponent = new MagicGraphicComponent(10, 10, 2, img);
        
        return new MagicArrow('Magic arrow', damage, graphicComponent, [movingAnimation, animation], sound);
    }

    createImplosionArrow(damage) {
        if (!this.assets.implosion) {
            return null;
        }

        const images = this.assets.implosion.images;
        const sound = this.assets.implosion.sound;

        const img = images[0];
        const blowAnimationImg = images[1];

        let { naturalWidth, naturalHeight } = blowAnimationImg;

        const magicBlowAnimation = new ImageComponent(blowAnimationImg, 0, 0, naturalWidth , naturalHeight, naturalWidth / 19, naturalHeight, 0, 0, naturalWidth / 19, naturalHeight);

        const animation = new Component(0, 0, naturalWidth / 19, naturalHeight);
        animation.setBackgroundImage(magicBlowAnimation);

        const graphicComponent = new MagicGraphicComponent(10, 10, 2, img);
        return new Implosion('Implosion', damage, graphicComponent, [animation], sound);
    }
} 
