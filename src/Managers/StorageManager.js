export default class StorageManager {
    constructor() {
        this.keys = [];
        this.records = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            if (key.match(/malekylik-game/)) {
                this.keys.push(key);
            }
        }

        this.parseRecords();        
    }

    saveResult(name, monsterKilled) {
        this.records.push({
            name,
            monsterKilled
        });

        this.records.sort((l, r) => l.time - r.time);

        for (let i = 0; i < this.records.length && i < 10; i++) {
            const { name, monsterKilled } = this.records[i];

            const record = `name=${name};monsterKilled=${monsterKilled};`;
            localStorage.setItem('malekylik-game=' + i, record);
        }

        if (this.records.length > 10) {
            this.records = this.records.slice(0, 10);
        }
    }

    parseRecords() {
        for (let i = 0; i < this.keys.length; i++) {
            const record = localStorage.getItem(this.keys[i]).split(';');

            const name = record[0].split('=')[1];
            const monsterKilled = record[1].split('=')[1];

            const recordObject = {
                name,
                monsterKilled,
            }

            this.records.push(recordObject);
        }
    }

    getSortedRecords() {
        this.records.sort((l, r) => r.monsterKilled - l.monsterKilled);
        return this.records;
    }
}
