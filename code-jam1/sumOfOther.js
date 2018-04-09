const sumOfOther = (mass) => {
    const answer = [];

    for (let i = 0; i < mass.length; i++) {
        let sumOfRest = 0;

        for (let j = i + 1; j < mass.length; j++) {
            sumOfRest += mass[j];
        }

        for (let j = i - 1; j >= 0; j--) {
            sumOfRest += mass[j];
        }

        answer.push(sumOfRest);
    }

    return answer;
};
