export const calculateImageSize = (taskImageWidth, taskImageHeight, maxTaskImageWidth, maxTaskImageHeight) => {
    let taskImageWidthProp = taskImageWidth;
    let taskImageHeightProp = taskImageHeight;
    let ration;

    if ((taskImageWidthProp / maxTaskImageWidth) > (taskImageHeightProp / maxTaskImageHeight)) {
        if (taskImageWidthProp > maxTaskImageWidth) {
            taskImageWidthProp = maxTaskImageWidth;
        }

        ration = taskImageWidthProp / taskImageWidth;

        taskImageHeightProp = Math.round(taskImageHeight * ration);

        if (taskImageHeightProp > maxTaskImageHeight) {
            taskImageHeightProp = maxTaskImageHeight;
        }
    } else {
        if (taskImageHeightProp > maxTaskImageHeight) {
            taskImageHeightProp = maxTaskImageHeight;
        }

        ration = taskImageHeightProp / taskImageHeight;

        taskImageWidthProp = Math.round(taskImageWidth * ration);

        if (taskImageWidthProp > maxTaskImageWidth) {
            taskImageWidthProp = maxTaskImageWidth;
        }
    }

    return {
        taskImageWidthProp,
        taskImageHeightProp
    };
}
