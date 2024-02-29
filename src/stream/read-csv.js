import fs from 'node:fs'
import { parse } from 'csv-parse'


const __dirname = new URL('.', import.meta.url).pathname.slice(3);
let parser = fs
    .createReadStream(`${__dirname}/task_teste.csv`)
    .pipe(parse({
        from_line:2,
    }));

for await (const record of parser) {
    let [title, description] = record.toString().split(",");
    let body = {
        title,
        description,
    };
    await fetch('http://localhost:35300/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            },
        body: JSON.stringify(body),
        duplex: 'half'
    });
}
