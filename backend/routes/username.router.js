import express from "express"
import Username from "../models/username.model.js";

const usernameRouter = express.Router();

usernameRouter.post("/createUsername", async (req, res) => {
    try {
      console.log(req.body);
      const username = await Username.create(req.body);
      res.json(username);
    } catch (e) {
        res.status(400).json({e: e.message});
    }
});


usernameRouter.get("/allUsernames", async (req, res) => {
try {
    const usernames = await Username.find();
    res.json(usernames);
} catch (e) {
    res.status(400).json({e: e.message});
}
});

usernameRouter.put("/updateUsername", async (req, res) => {
    const {username} = req.body
    try {
        const usernames = await Username.updateOne({}, {username});
        res.json(usernames);
    } catch (e) {
        res.status(400).json({e: e.message});
    }
    });


    usernameRouter.delete("/deleteUsername", async (req, res) => {
        const {username} = req.body
        try {
            const usernames = await Username.deleteOne({username});
            res.json(usernames);
        } catch (e) {
            res.status(400).json({e: e.message});
        }
        });

export default usernameRouter;
