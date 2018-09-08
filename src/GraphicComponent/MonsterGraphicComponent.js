import ImageComponent from '../UI/ImageComponent/ImageComponent';

import { Component, CompositeComponent } from '../UI/Component/Component';

export default class MonsterGraphicComponent extends CompositeComponent {
    constructor(top, left, headImage, leftArmImage, rightImage, bodyImage, legImage, parentComponent = null) {
        const { naturalHeight: headNaturalHeight } = headImage;
        const { naturalWidth: bodyNaturalWidth, naturalHeight: bodyNaturalHeight } = bodyImage;
        const { naturalWidth: leftNaturalWidth } = leftArmImage;
        const { naturalWidth: rightNaturalWidth } = rightImage;
        const { naturalHeight: legNaturalHeight } = legImage;

        const heightCorrection = 30;
        const width = leftNaturalWidth + bodyNaturalWidth + rightNaturalWidth;
        const height = headNaturalHeight + bodyNaturalHeight + legNaturalHeight - heightCorrection;

        super(top, left, width, height, parentComponent);

        const { 
            headComponent,
            bodyComponent,
            leftArmComponent,
            rightArmComponent,
            legComponent
        } = this.initMonsterParts(headImage, bodyImage, leftArmImage, rightImage, legImage);

        this.addComponent(bodyComponent, 'body');
        this.addComponent(headComponent, 'head');
        this.addComponent(legComponent, 'leg');
        this.addComponent(leftArmComponent, 'leftarm');
        this.addComponent(rightArmComponent, 'rightarm');

        this.initAnimationToHead(headComponent);
    }

    initMonsterParts(headImage, bodyImage, leftArmImage, rightImage, legImage) {
        const { naturalWidth: headNaturalWidth, naturalHeight: headNaturalHeight } = headImage;
        const { naturalWidth: bodyNaturalWidth, naturalHeight: bodyNaturalHeight } = bodyImage;
        const { naturalWidth: leftNaturalWidth, naturalHeight: leftNaturalHeight } = leftArmImage;
        const { naturalWidth: rightNaturalWidth, naturalHeight: rightNaturalHeight } = rightImage;
        const { naturalWidth: legNaturalWidth, naturalHeight: legNaturalHeight } = legImage;

        const { width, height } = this.getBoundingClientRect();

        const bodyComponent = new Component(height - legNaturalHeight - bodyNaturalHeight, width / 2 - bodyNaturalWidth / 2, bodyNaturalWidth, bodyNaturalHeight);
        bodyComponent.setBackgroundImage(new ImageComponent(bodyImage, 0, 0, bodyNaturalWidth, bodyNaturalHeight, bodyNaturalWidth, bodyNaturalHeight, 0, 0, bodyNaturalWidth, bodyNaturalHeight))  

        const headTopOffset = 30;
        const headLeftOffset = 15;
        const headComponent = new Component(height - legNaturalHeight - bodyNaturalHeight - headNaturalHeight + headTopOffset, width / 2 - headNaturalWidth / 2 - headLeftOffset, headNaturalWidth, headNaturalHeight);
        headComponent.setBackgroundImage(new ImageComponent(headImage, 0, 0, headNaturalWidth, headNaturalHeight, headNaturalWidth, headNaturalHeight, 0, 0, headNaturalWidth, headNaturalHeight));

        const legLeftOffset = 13;
        const legComponent = new Component(height - legNaturalHeight, width / 2 - legNaturalWidth / 2 - legLeftOffset, legNaturalWidth, legNaturalHeight);
        legComponent.setBackgroundImage(new ImageComponent(legImage, 0, 0, legNaturalWidth, legNaturalHeight, legNaturalWidth, legNaturalHeight, 0, 0, legNaturalWidth, legNaturalHeight));
        
        const leftArmTopOffset = 45;
        const leftArmLeftOffset = 15;
        const leftArmComponent = new Component(height - legNaturalHeight - bodyNaturalHeight + leftArmTopOffset, width / 2 - leftArmLeftOffset, leftNaturalWidth, leftNaturalHeight);
        leftArmComponent.setBackgroundImage(new ImageComponent(leftArmImage, 0, 0, leftNaturalWidth, leftNaturalHeight, leftNaturalWidth, leftNaturalHeight, 0, 0, leftNaturalWidth, leftNaturalHeight));

        const rightArmTopOffset = 40;
        const rightArmLeftOffset = 89;
        const rightArmComponent = new Component(height - legNaturalHeight - bodyNaturalHeight + rightArmTopOffset, width / 2 - rightArmLeftOffset, rightNaturalWidth, rightNaturalHeight);
        rightArmComponent.setBackgroundImage(new ImageComponent(rightImage, 0, 0, rightNaturalWidth, rightNaturalHeight, rightNaturalWidth, rightNaturalHeight, 0, 0, rightNaturalWidth, rightNaturalHeight));

        return {
            headComponent,
            bodyComponent,
            leftArmComponent,
            rightArmComponent,
            legComponent
        };
    }

    initAnimationToHead(headComponent) {
        const timeInSecond = 2;
        const toMilliSecondScale = 1000;

        const fullPathLength = 60;
        const halfPathLength = Math.floor(fullPathLength / 2);

        const downSpeed = -(halfPathLength  / (timeInSecond * toMilliSecondScale * 0.25)); 
        const upSpeed = fullPathLength  / (timeInSecond * toMilliSecondScale * 0.5); 
        const toInitialPosSpeed = -(halfPathLength  / (timeInSecond * toMilliSecondScale * 0.25)); 

        headComponent.animations.setAnimation('headMoving', timeInSecond, 'infinite', (context, initialProperties, properties, elapseTime, component) => {
            let speed;

            if (elapseTime <= 0.25) {
                speed = downSpeed;
            } else if (elapseTime > 0.25 && elapseTime <= 0.75) {
                speed = upSpeed;
            } else if (elapseTime > 0.75) {
                speed = toInitialPosSpeed;
            }

            properties.boundingClientRect.top += speed;
        });
    }
}
