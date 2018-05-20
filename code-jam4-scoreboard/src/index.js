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

    const drawHeader = (puzzlesInfo = []) => {
        const tableHeadRow = document.createElement('tr');

        const tdName = document.createElement('td');
        tdName.innerText = 'user name:';

        const tdPuzzlesName = [];

        puzzlesInfo.forEach(({ name }) => {
            const tdpuzzleName = document.createElement('td');
            tdpuzzleName.innerText = name;

            tdPuzzlesName.push(tdpuzzleName);
        });

        const tdTime = document.createElement('td');
        tdTime.innerText = 'total time:';

        tableHeadRow.appendChild(tdName);

        tdPuzzlesName.forEach((e) => {
            tableHeadRow.appendChild(e);
        });

        tableHeadRow.appendChild(tdTime);

        tableHead.appendChild(tableHeadRow);
    };

    const drawBody = (usersInfo = {}, puzzlesInfo = []) => {
        const keys = Object.keys(usersInfo);

        const tableRows = [];

        let count = 0;

        for (let i = 0; i < keys.length; i++) {
            count += 1;

            const tableBodyRow = document.createElement('tr');

            const tdName = document.createElement('td');
            tdName.innerText = `${count}: ${usersInfo[keys[i]].name}`;

            const tableBodyRowPuzzles = [];

            let totalAmount = 0;

            puzzlesInfo.forEach((e) => {
                const puzzleInfo = document.createElement('td');

                if (e.results[keys[i]] != undefined) {
                    puzzleInfo.innerText = e.results[keys[i]].time['$numberLong'];
                    puzzleInfo.dataset.answer = `${e.results[keys[i]].correct}: ${e.results[keys[i]].code}`;
                } else {
                    puzzleInfo.innerText = e.timeLimit;
                    puzzleInfo.dataset.answer = 'no answer';
                }


                totalAmount += parseInt(puzzleInfo.innerText, 10);

                tableBodyRowPuzzles.push(puzzleInfo);
            });

            const tdTotalTime = document.createElement('td');
            tdTotalTime.innerText = String(totalAmount);

            tableBodyRow.appendChild(tdName);

            tableBodyRowPuzzles.forEach((e) => {
                tableBodyRow.appendChild(e);
            });

            tableBodyRow.appendChild(tdTotalTime);

            tableRows.push(tableBodyRow);
        }

        tableRows.forEach((e) => {
            tableBody.appendChild(e);
        });
    };

    

    let userJSON = await (await fetch('/src/dumps/users.json')).json();
    let sessionsJSON = await (await fetch('/src/dumps/sessions.json')).json();

    const usersInfo = getUserInfo(userJSON);
    const puzzlesInfo = getPuzzlesUnfo(sessionsJSON.rsschool, usersInfo);

    console.log(usersInfo);
    console.log(puzzlesInfo);

    drawHeader(puzzlesInfo);

    drawBody(usersInfo, puzzlesInfo);
})();

