// implement your API here
const express = require("express");
const db = require("./data/db")

const server = express();

server.get("/", (req, res) => {
    res.status(200).json({"response":"Helllllooooooooo?!?!?!?!?!!!"});
});

server.get("/api/users", (req, res) => {
    db.find()
        .then(res => res.status(200).json(res))
        .catch(err => {
            console.log(err)
            res.status(500).json({"error":"Sorry, we had an interal error. Time to gut ourselves!"});
        });
})

const port = 2019;
server.listen(port, () => console.log(`\n=== We're up! Port ${port}. ===\n`));