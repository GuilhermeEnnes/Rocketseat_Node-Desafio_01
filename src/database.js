import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
    #database = {};

    constructor() {
        fs.readFile(databasePath, 'utf8').then(data => {
            this.#database = JSON.parse(data);
        })
            .catch(() => {
                this.#persist();
            })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database));
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data);
        } else {
            this.#database[table] = [data];
        }
        this.#persist();

    }

    select(table, search) {
        let data = this.#database[table] ?? []

        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return value ? row[key].toLowerCase().includes(value.toLowerCase()) : false
                })
            })
        }

        return data;
    }


    update(table, id, data=false) {
        const rowIndex = this.#database[table].findIndex((row) => row.id === id)

        if (rowIndex > -1) {
            const oldData = this.#database[table][rowIndex];
            const updatedData = { id };
            
            if (data) {
                updatedData.title = data.title ?? oldData.title;
                updatedData.description = data.description ?? oldData.description;
                updatedData.completed_at = oldData.completed_at;
            } else {
                updatedData.title = oldData.title;
                updatedData.description = oldData.description;
                updatedData.completed_at = (oldData.completed_at === null) ? "completed" : null;
            }
            
            updatedData.created_at = oldData.created_at;
            updatedData.updated_at = new Date();
            this.#database[table][rowIndex] = updatedData;
            this.#persist();

            return true;
        } else {
            return false;
        }
    }
    
    delete(table, id) {
        const rowIndex = this.#database[table].findIndex((row) => row.id === id);

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1);
            this.#persist();

            return true;
        } else {
            return false;
        }
    }
}
