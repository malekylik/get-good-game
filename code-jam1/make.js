const make = (...args) => {
    return function innerFunc(...innerArgs) {
        if (typeof innerArgs[0] === 'function') {
            let answer = args[0];

            const calculate = innerArgs[0];

            for (let i = 1; i < args.length; i++) {
                answer = calculate(answer, args[i]);
            }

            return answer;
        }

        args = [...args, ...innerArgs];
        return innerFunc;
    };
};
