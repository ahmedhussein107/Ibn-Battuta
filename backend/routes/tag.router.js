import express from "express";

import {
    createTag,
    getTag,
    updateTag,
    deleteTag,
    getTagByID,
} from "../controllers/tag.controller.js";

const tagRouter = express.Router();

tagRouter.post("/createTag", createTag);

tagRouter.get("/allTags", getTag);

tagRouter.put("/updateTag/:id", updateTag);

tagRouter.delete("/deleteTag/:id", deleteTag);

tagRouter.get("/getTagByID/:id", getTagByID);

export default tagRouter;
