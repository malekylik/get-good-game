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

        const tdComparison = document.createElement('td');
        tdComparison.innerText = 'Comparison';

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

        tableHeadRow.appendChild(tdComparison);

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
                    let numberLong = parseInt(e.results[keys[i]].time['$numberLong'], 10);

                    if (numberLong > e.timeLimit) {
                        numberLong = e.timeLimit;
                    }
                    puzzleInfo.innerText = numberLong;

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

            const checkBoxTd = document.createElement('td');
            const checkBox = document.createElement('input');
            checkBox.type = 'checkBox';

            checkBoxTd.appendChild(checkBox);
            tableBodyRow.appendChild(tdTotalTime);
            tableBodyRow.appendChild(checkBoxTd);

            tableRows.push(tableBodyRow);
        }

        tableRows.forEach((e) => {
            tableBody.appendChild(e);
        });
    };

    const createTooltip = (data = '', position = {}) => {
        lastToolTip = document.createElement('div');
        lastToolTip.classList.add('tooltip');
        lastToolTip.innerText = data;

        lastToolTip.style.top = 0 + 'px';
        lastToolTip.style.left = position.left;
        lastToolTip.style.visibility = 'hidden';
        
        document.body.appendChild(lastToolTip);

        const toolTipHeight = lastToolTip.getBoundingClientRect().height;

        if (position.top > toolTipHeight) {
            lastToolTip.style.top = document.body.scrollTop + position.top - 5 - lastToolTip.getBoundingClientRect().height + 'px';
        } else {
            lastToolTip.style.top = document.body.scrollTop + position.top + 5 + lastToolTip.getBoundingClientRect().height + 'px'
        }
       
        lastToolTip.style.visibility = 'visible';
    };

    const changeSession = (e) => {
        puzzlesInfo = getPuzzlesUnfo(sessionsJSON[e.target.dataset.name], usersInfo);

        while(tableHead.children.length !== 0) {
            tableHead.removeChild(tableHead.children[0])
        }

        while(tableBody.children.length !== 0) {
            tableBody.removeChild(tableBody.children[0])
        }

        drawHeader(puzzlesInfo);
        drawBody(usersInfo, puzzlesInfo);

    };

    let checkedRows = [];

    let lastToolTip = null;

    let radios = document.querySelectorAll('input[type=radio]');

    radios.forEach((e) => {
        e.addEventListener('click', changeSession);
    });

    let [user, sessions] = await Promise.all([fetch('/src/dumps/users.json'), fetch('/src/dumps/sessions.json')]);
    let [userJSON, sessionsJSON] = await Promise.all([user.json(), sessions.json()]);

    let usersInfo = getUserInfo(userJSON);
    let puzzlesInfo = getPuzzlesUnfo(sessionsJSON.rsschool, usersInfo);

    drawHeader(puzzlesInfo);
    drawBody(usersInfo, puzzlesInfo);

    tableBody.addEventListener('mouseover', (e) => {
        let td = e.target;

        while (td != null && td.localName != 'td') {
            td = td.parentElement;
        }

        if (td === null) {
            return;
        }

        const answer = td.dataset.answer;

        if (answer != undefined && lastToolTip === null) {
            createTooltip(answer, td.getBoundingClientRect());
        }
    });

    tableBody.addEventListener('mouseout', () => {
        if (lastToolTip !== null) {
            document.body.removeChild(lastToolTip);

            lastToolTip = null;
        }

        checkedRows = [];
    });

    tableBody.addEventListener('change', (e) => {
        let tr = e.target;

        while (tr != null && tr.localName != 'tr') {
            tr = tr.parentElement;
        }

        if (e.target.checked) {
            if (checkedRows.length < 10) {
                checkedRows.push(tr);
            }
        } else {
            checkedRows.splice(checkedRows.indexOf(tr), 1);
        }
    });
})();

