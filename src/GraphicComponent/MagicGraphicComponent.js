import ImageComponent from "../UI/ImageComponent/ImageComponent";
import { Component } from "../UI/Component/Component";

export default class MagicGraphicComponent extends Component {
    constructor(top, left, scale, magicImg, parentComponent = null) {
        const { naturalWidth, naturalHeight } = magicImg;
        const scaledWidth = naturalWidth * scale;
        const scaledHeight = naturalHeight * scale;

        super(top, left, scaledWidth, scaledHeight, parentComponent);

        if (magicImg instanceof Image) {
            this.setBackgroundImage(new ImageComponent(magicImg, 0, 0, naturalWidth, naturalHeight, scaledWidth, scaledHeight, 0, 0, naturalWidth, naturalHeight));
        }

        this.properties.cursor = 'pointer';
    } 
}
