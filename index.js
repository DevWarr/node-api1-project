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
            res.status(500).json({"error":"Sorry, we had an interal error. No Users for you. Time to gut ourselves!"});
        });
})

server.post("/api/users", (req, res) => {

    if (!req.body.name || !req.body.bio) {
        res.status(400).json({"errorMessage":"Please provide both a 'name' and a 'bio'. Plzz"});
        return;
    }

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
            if (!user) {
                res.status(404).json({"errorMessage":"Did you give us a valid id?"});
                return;
            }
            res.status(200).json(user);
        })
        .catch(err => res.status(500).json({"error":"Sorry, we had an interal error. No User info this time. Time to gut ourselves!"}))
});

server.delete("/api/users/:id", (req, res) => {

    db.remove(req.params.id)
        .then(deleted => {
            if (!deleted) {
                res.status(404).json({"errorMessage":"Did you give us a valid id?"});
                return;
            }
            res.status(200).json({"numberOfRemovedRecords":deleted});
        })
        .catch(err => res.status(500).json({"error":"Sorry, we had an interal error. The user is not deleted. Time to gut ourselves!"}));
});

server.put("/api/users/:id", async (req, res) => {

    if (!req.body.name && !req.body.bio) {
        res.status(400).json({"errorMessage":"Please provide etiher a 'name' and a 'bio' to update. Plzz"});
        return;
    };
    
    const updatedUser = {};
    if (!!req.body.name) {
        updatedUser.name = req.body.name;
    };
    if (!!req.body.bio) {
        updatedUser.bio = req.body.bio;
    };

    try {
        const success = await db.update(req.params.id, updatedUser);
        if (!success) {
            res.status(404).json({"errorMessage":"Did you give us a valid id?"});
            return;
        }
        const updated = await db.findById(req.params.id);
        res.status(200).json(updated);
    } catch (e) {
        console.log(e)
        res.status(500).json({"error":"Sorry, we had an interal error. Time to gut ourselves!"});
    }
})

const port = 2019;
server.listen(port, () => console.log(`\n=== We're up! Port ${port}. ===\n`));