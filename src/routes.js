import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();
let error = {};
export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body;
            if (title && description) {
                const task = {
                    id: randomUUID(),
                    title,
                    description,
                    completed_at: null,
                    created_at: new Date(),
                    updated_at: new Date(),
                }
    
                database.insert('tasks', task);
                return res.writeHead(201).end();
            }
            error = { message: "Problem with body request parameters."}
            return res.writeHead(400).end(JSON.stringify(error))

            }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
           const { title, description } = req.query;

           const tasks = database.select('tasks', (title || description) ? {
                title: title ?? "" ,
                description: description ?? "",
            } : false);

            return res.writeHead(201).end(JSON.stringify(tasks));
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            if (req.body.title || req.body.description) {
                const data = { ...req.body }
                const wasUpdated = database.update('tasks', id, data);
                
                if (wasUpdated) {
                    return res.writeHead(204).end();
                } else {
                    error = { message: "This Id wasn't exists in database."}
                    return res.writeHead(404).end(JSON.stringify(error));
                }
            } else {
                error = { message: "Problem with body request parameters."}
                return res.writeHead(400).end(JSON.stringify(error));
            }
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const wasDeleted = database.delete('tasks', id);
            if (wasDeleted) {
                return res.writeHead(204).end();
            } else {
                error = {message: "That Id doesn't exists in database"};
                return res.writeHead(404).end(JSON.stringify(error))
            }
            
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params
            const wasDeleted = database.update('tasks', id);
            if (wasDeleted) {
                return res.writeHead(204).end();
            } else {
                error = {message: "That Id doesn't exists in database"};
                return res.writeHead(404).end(JSON.stringify(error))
            }
            
        }
    },
];
