// implement your API here
const express = require("express");
const db = require("./data/db")

const server = express();
server.use(express.json());

server.get("/", (req, res) => {
    res.status(200).json({"response":"Helllllooooooooo?!?!?!?!?!!!"});
});

server.get("/api/users", (req, res) => {
    db.find()
        .then(users => res.status(200).json(users))
        .catch(err => {
            console.log(err)
            res.status(500).json({"error":"Sorry, we had an interal error. Time to gut ourselves!"});
        });
})

server.post("/api/users", (req, res) => {
    db.insert(req.body)
        .then(ret => {
            db.findById(ret.id)
                .then(user => res.status(201).json(user));
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({"error":"Sorry, we had an interal error. Time to gut ourselves!"});
        });
})

server.get("/api/users/:id", (req, res) => {
    db.findById(req.params.id)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => res.status(500).json({"error":"Sorry, we had an interal error. Time to gut ourselves!"}))
});

server.delete("/api/users/:id", (req, res) => {
    db.remove(req.params.id)
        .then(deleted => {
            res.status(200).json({"numberOfRemovedRecords":deleted});
        })
        .catch(err => res.status(500).json({"error":"Sorry, we had an interal error. Time to gut ourselves!"}));
});

server.put("/api/users/:id", async (req, res) => {
    try {
        const success = await db.update(req.params.id, req.body);
        if (!success) throw new Error("update unsuccessful");
        const updated = await db.findById(req.params.id);
        res.status(200).json(updated);
    } catch (e) {
        console.log(e)
        res.status(500).json({"error":"Sorry, we had an interal error. Time to gut ourselves!"});
    }
})

const port = 2019;
server.listen(port, () => console.log(`\n=== We're up! Port ${port}. ===\n`));