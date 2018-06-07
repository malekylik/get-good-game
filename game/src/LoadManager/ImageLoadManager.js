import { getImageSize, getImageBlob, createImgPromise } from '../utils/image';

export default class ImageLoadManager {
    constructor() {
        this.totalSize = 0;
        this.currentLoadedSize = 0;

        this.imageUrl = [];
        this.loadedImages = [];
    }

    addUrl(imageUrl, name) {
        const index = this.imageUrl.findIndex(({ name: urlName }) => urlName === name);

        if (Array.isArray(imageUrl)) {
            if (~index) {
                this.imageUrl[index].urls = [...this.imageUrl[index].urls, ...imageUrl]
            } else {
                this.imageUrl.push({
                    urls: [...imageUrl],
                    name
                });
            }
        } else {
            if (~index) {
                this.imageUrl[index].urls.push(imageUrl);
            } else {
                this.imageUrl.push({
                    urls: [imageUrl],
                    name
                });
            }
        }
    }

    async calculateTotalSize() {
        const promiseArr = [];

        this.imageUrl.forEach(({ urls }) => {
            urls.forEach((url) => {
                promiseArr.push(getImageSize(url));
            })
        });

        const imagesSize = await Promise.all(promiseArr);

        this.totalSize = imagesSize.reduce((prev, size) => prev + parseInt(size, 10), 0);
        this.imagesSize = imagesSize;

        return this.totalSize;
    }

    async loadImages(onprogressCallback) {
        const promiseArr = [];
        const imagesProgress = {};

        const onprogress = (value, i) => {
            imagesProgress[i] = value;

            let currentLoadedSize = 0;
            const keys = Object.keys(imagesProgress);
            for (let i = 0; i < keys.length; i++) {
                currentLoadedSize += imagesProgress[keys[i]];
            }

            this.currentLoadedSize = currentLoadedSize;
            const percent = Math.round(this.currentLoadedSize / this.totalSize * 100);

            console.log(percent);

            if (onprogressCallback) {
                onprogressCallback(percent);
            }
        };

        let id = 0;
        this.imageUrl.forEach(({ urls }) => {
            urls.forEach((url) => {
                promiseArr.push(getImageBlob(url, onprogress, id));
                id += 1;
            });
        });

        const blobs = await Promise.all(promiseArr);

        const images = await Promise.all(blobs.map((blob) => {
            const img = new Image();
            img.src = blob;

            return createImgPromise(img);
        }));

        const groupedImages = [];

        let k = 0;
        for (let i = 0; i < this.imageUrl.length; i++) {
            const length = this.imageUrl[i].urls.length;
            const name = this.imageUrl[i].name;

            groupedImages.push({
                images: images.slice(k, k + length),
                name: name
            });

            k += length;
        }

        this.imageUrl = [];
        this.loadedImages = [...this.loadedImages, ...groupedImages];        

        return groupedImages;
    }

    getImagesByName(name) {
        const index = this.loadedImages.findIndex(({ name: imagesName }) => imagesName === name);
        return (~index) ? this.loadedImages[index].images : null;
    }
}
