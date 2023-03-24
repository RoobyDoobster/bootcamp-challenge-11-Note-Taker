const express = require('express');
const fs = require('fs');
const path = require('path');
const {v4: uuidv4 } = require('uuid');

const db = require('./db/db.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/notes", (req, res ) => {
    res.json(db);
})

app.post("/api/notes", (req, res ) => {
    let newNote = req.body;
    newNote.id = uuidv4();
    db.push(newNote);
    fs.writeFileSync("./db/db.json", JSON.stringify(db), (err) => {
        if(err) throw err;
    });
    res.send(db);
})

app.delete("api/nots/:id", (req, res ) => {
    db.forEach((note, i) => {
        if(note.id === req.params.id) {db.splice(i, 1)}
    })

    fs.writeFile("db/db.json", JSON.stringify(db), (err) => {
        if(err) throw err;
    })
    res.send(db);
})

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));
app.get('*', (req, res ) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.listen(PORT, () =>
{
    console.log(`listening at ${PORT}`);
})
