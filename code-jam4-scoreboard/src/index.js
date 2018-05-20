
(async () => {
    let userJSON = await (await fetch('/src/dumps/users.json')).json();

    console.log(userJSON);
})();

