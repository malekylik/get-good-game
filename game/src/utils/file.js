export const getFileSize = (url) => {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("HEAD", url, true); 
 
        xhr.onreadystatechange = () => {
            if (xhr.readyState == xhr.DONE) {
                resolve(xhr.getResponseHeader("Content-Length"));
            }
        };
        xhr.send();
    });
};

export const getFileBlob = (url, onprogress, identifier) => {
    return new Promise((resolve) => {
        const xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open('GET', url, true);
        xmlHTTP.responseType = 'arraybuffer';

        let prevValue = -1;

        xmlHTTP.onload = (e) => {
            const blob = new Blob([xmlHTTP.response]);
            resolve(window.URL.createObjectURL(blob));
        };

        xmlHTTP.onprogress = (({ loaded }) => {
            if (loaded !== prevValue) {
                prevValue = loaded;

                onprogress(loaded, identifier);
            }
        });

        xmlHTTP.send();
    });
};

export const createFilePromise = (file) => {
    return new Promise((resolve) => {
        file.onload = (i) => {
            resolve(i.srcElement);
        } 
    })
};
