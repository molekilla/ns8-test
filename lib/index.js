"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
const port = 3000;
const db = {};
let events = [];
const Joi = require('@hapi/joi');
const UserSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    phone: Joi.string()
        .pattern(new RegExp('^\d{3}-\d{3}-\d{4}')),
});
const EventSchema = Joi.object({
    event: Joi.string().empty('').defaultValue('NONE').required(),
});
app.post('/users', (req, res) => {
    const validation = UserSchema.validate(req.body);
    if (validation.error) {
        res.send(validation.error);
        return;
    }
    if (db[req.body.email]) {
        res.send('Email already taken');
        return;
    }
    // add to cache
    db[req.body.email] = req.body;
    return res.status(201);
});
app.post('/events', (req, res) => {
    const validation = EventSchema.validate(req.body);
    if (validation.error) {
        res.send(validation.error);
        return;
    }
    const { type } = req.body;
    events = [{
            type,
            created: new Date().getTime()
        }];
    return res.status(201);
});
app.get('/events', (req, res) => {
    if (req.query === 'all') {
        return res.send(events);
    }
    else if (req.query === 'user') {
        const filter = events.filter(i => req.query.filter === i.user);
        return res.send(filter);
    }
    else if (req.query === 'date') {
        const filter = events.filter(i => req.query.filter > i.created);
        return res.send(filter);
    }
    return res.status(201);
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
//# sourceMappingURL=index.js.map