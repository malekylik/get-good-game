import { getFileSize, getFileBlob, createFilePromise } from '../utils/file';

export default class LoadManager {
    constructor() {
        this.totalSize = 0;
        this.currentLoadedSize = 0;

        this.imageUrl = [];
        this.loadedImages = [];

        this.soundUrl = [];
        this.loadedSound = [];
    }

    addUrl(urlObject, nameObj) {
        const soundUrls = urlObject.sound;
        const imageUrls = urlObject.image;

        const soundName = nameObj.sound;
        const imageName = nameObj.image;

        if (imageUrls) {
            this.updateArray(this.imageUrl, imageUrls, imageName);
        }
        
        if (soundUrls) {
            this.updateArray(this.soundUrl, soundUrls, soundName);
        }
    }

    updateArray(arrayForUpdating, updatingArray, name) {
        let index = arrayForUpdating.findIndex(({ name: urlName }) => urlName === name);

        if (~index) {
            arrayForUpdating[index].urls = [...arrayForUpdating[index].urls, ...updatingArray]
        } else {
            arrayForUpdating.push({
                urls: [...updatingArray],
                name: name
            });
        }
    }

    async calculateTotalSize() {
        const promiseArr = [];

        let imageCount = 0;

        this.imageUrl.forEach(({ urls }) => {
            urls.forEach((url) => {
                promiseArr.push(getFileSize(url));
                imageCount += 1;
            })
        });

        this.soundUrl.forEach(({ urls }) => {
            urls.forEach((url) => {
                promiseArr.push(getFileSize(url));
            })
        });

        const assetsSize = await Promise.all(promiseArr);

        this.totalSize = assetsSize.reduce((prev, size) => prev + parseInt(size, 10), 0);
        this.imagesSize = assetsSize.slice(0, imageCount);
        this.soundSize = assetsSize.slice(imageCount);

        return this.totalSize;
    }

    async load(onprogressCallback) {
        const promiseArr = [];
        const loadProgress = {};

        const onprogress = (value, i) => {
            loadProgress[i] = value;

            let currentLoadedSize = 0;
            const keys = Object.keys(loadProgress);
            for (let i = 0; i < keys.length; i++) {
                currentLoadedSize += loadProgress[keys[i]];
            }

            this.currentLoadedSize = currentLoadedSize;
            const percent = Math.round(this.currentLoadedSize / this.totalSize * 100);

            if (onprogressCallback) {
                onprogressCallback(percent);
            }
        };

        let imageCount = 0;

        let id = 0;
        this.imageUrl.forEach(({ urls }) => {
            urls.forEach((url) => {
                promiseArr.push(getFileBlob(url, onprogress, id));
                id += 1;
                imageCount += 1;
            });
        });

        this.soundUrl.forEach(({ urls }) => {
            urls.forEach((url) => {
                promiseArr.push(getFileBlob(url, onprogress, id));
                id += 1;
            });
        });

        const blobs = await Promise.all(promiseArr);

        const imgPromise = blobs.slice(0, imageCount).map((blob) => {
            const img = new Image();
            img.src = blob;

            return createFilePromise(img);
        });

        const soundPromise = blobs.slice(imageCount).map((blob) => {
            const sound = new Audio();
            sound.src = blob;

            return sound;
        });

        const assetsPromise = [...imgPromise];
        let assets = await Promise.all(assetsPromise);

        const grouped = this.getGroupedLoadedAssets([...assets, ...soundPromise]);

        this.imageUrl = [];
        this.soundUrl = [];
        this.loaded = {...this.loadedImages, ...grouped };        

        return grouped;
    }

    getGroupedLoadedAssets(assets) {
        const grouped = {
            images: [],
            sound: []
        };

        let offset = 0;
        for (let i = 0; i < this.imageUrl.length; i++) {
            const length = this.imageUrl[i].urls.length;
            const name = this.imageUrl[i].name;

            grouped.images.push({
                images: assets.slice(offset, offset + length),
                name: name
            });

            offset += length;
        }

        for (let i = 0; i < this.soundUrl.length; i++) {
            const length = this.soundUrl[i].urls.length;
            const name = this.soundUrl[i].name;

            grouped.sound.push({
                sound: assets.slice(offset, offset + length),
                name: name
            });

            offset += length;
        }

        return grouped;
    }

    getImagesByName(name) {
        const index = this.loaded.images.findIndex(({ name: imagesName }) => imagesName === name);
        return (~index) ? this.loaded.images[index].images : null;
    }

    getSoundByName(name) {
        const index = this.loaded.sound.findIndex(({ name: soundName }) => soundName === name);
        return (~index) ? this.loaded.sound[index].sound : null;
    }
}
