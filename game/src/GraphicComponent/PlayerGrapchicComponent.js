import ImageComponent from '../UI/ImageComponent/ImageComponent';

import { Component } from '../UI/Component/Component';

export default class MonsterGraphicComponent extends Component {
    constructor(top, left, characterImg, parentComponent = null) {
        const { naturalWidth, naturalHeight } = characterImg;

        super(top, left, naturalWidth, naturalHeight, parentComponent);

        this.setBackgroundImage(new ImageComponent(characterImg, 0, 0, naturalWidth, naturalHeight, naturalWidth, naturalHeight, 0, 0, naturalWidth, naturalHeight));
    }
}