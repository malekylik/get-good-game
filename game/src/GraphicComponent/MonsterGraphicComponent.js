import ImageComponent from '../UI/ImageComponent/ImageComponent';

import { Component, CompositeComponent } from '../UI/Component/Component';

export default class MonsterGraphicComponent extends CompositeComponent {
    constructor(top, left, headImage, leftArmImage, rightImage, bodyImage, legImage, parentComponent = null) {
        const { naturalWidth: headNaturalWidth, naturalHeight: headNaturalHeight } = headImage;
        const { naturalWidth: bodyNaturalWidth, naturalHeight: bodyNaturalHeight } = bodyImage;
        const { naturalWidth: leftNaturalWidth, naturalHeight: leftNaturalHeight } = leftArmImage;
        const { naturalWidth: rightNaturalWidth, naturalHeight: rightNaturalHeight } = rightImage;
        const { naturalWidth: legNaturalWidth, naturalHeight: legNaturalHeight } = legImage;

        const width = leftNaturalWidth + bodyNaturalWidth + rightNaturalWidth;
        const height = headNaturalHeight + bodyNaturalHeight + legNaturalHeight - 30;

        super(top, left, width, height, parentComponent);

        const bodyComponent = new Component(height - legNaturalHeight - bodyNaturalHeight, width / 2 - bodyNaturalWidth / 2, bodyNaturalWidth, bodyNaturalHeight);
        bodyComponent.setBackgroundImage(new ImageComponent(bodyImage, 0, 0, bodyNaturalWidth, bodyNaturalHeight, bodyNaturalWidth, bodyNaturalHeight, 0, 0, bodyNaturalWidth, bodyNaturalHeight))  

        const headComponent = new Component(height - legNaturalHeight - bodyNaturalHeight - headNaturalHeight + 30, width / 2 - headNaturalWidth / 2 - 15, headNaturalWidth, headNaturalHeight);
        headComponent.setBackgroundImage(new ImageComponent(headImage, 0, 0, headNaturalWidth, headNaturalHeight, headNaturalWidth, headNaturalHeight, 0, 0, headNaturalWidth, headNaturalHeight));

        const legComponent = new Component(height - legNaturalHeight, width / 2 - legNaturalWidth / 2 - 13, legNaturalWidth, legNaturalHeight);
        legComponent.setBackgroundImage(new ImageComponent(legImage, 0, 0, legNaturalWidth, legNaturalHeight, legNaturalWidth, legNaturalHeight, 0, 0, legNaturalWidth, legNaturalHeight));
        
        const leftArmComponent = new Component(height - legNaturalHeight - bodyNaturalHeight + 45, width / 2 - 15, leftNaturalWidth, leftNaturalHeight);
        leftArmComponent.setBackgroundImage(new ImageComponent(leftArmImage, 0, 0, leftNaturalWidth, leftNaturalHeight, leftNaturalWidth, leftNaturalHeight, 0, 0, leftNaturalWidth, leftNaturalHeight));

        const rightArmComponent = new Component(height - legNaturalHeight - bodyNaturalHeight + 40, width / 2 - 89, rightNaturalWidth, rightNaturalHeight);
        rightArmComponent.setBackgroundImage(new ImageComponent(rightImage, 0, 0, rightNaturalWidth, rightNaturalHeight, rightNaturalWidth, rightNaturalHeight, 0, 0, rightNaturalWidth, rightNaturalHeight));

        this.addComponent(bodyComponent, 'body');
        this.addComponent(headComponent, 'head');
        this.addComponent(legComponent, 'leg');
        this.addComponent(leftArmComponent, 'leftarm');
        this.addComponent(rightArmComponent, 'rightarm');
    }
}
