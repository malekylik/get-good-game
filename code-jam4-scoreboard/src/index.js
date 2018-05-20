(async () => {
    const getUserInfo = (input = []) => {
        const usersInfo = {};

        input.forEach(({ uid, displayName }) => {
            usersInfo[uid] = {
                name: displayName
            };
        });

        return usersInfo;
    };

    const getPuzzlesUnfo = (input = {}, usersInfo = []) => {
        const puzzlesInfo = [];

        input.rounds.forEach((e, i) => {
            puzzlesInfo.push({
                name: input.puzzles[i].name,
                timeLimit: input.puzzles[i].options.timeLimit["$numberLong"],
                results: e.solutions,
            });
        });

       return puzzlesInfo;

    };

    

    let userJSON = await (await fetch('/src/dumps/users.json')).json();
    let sessionsJSON = await (await fetch('/src/dumps/sessions.json')).json();

    const usersInfo = getUserInfo(userJSON);
    const puzzlesInfo = getPuzzlesUnfo(sessionsJSON.rsschool, usersInfo);
})();

