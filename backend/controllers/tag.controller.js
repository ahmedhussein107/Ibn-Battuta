import Tag from "../models/tag.model.js";

export const createTag = async (req, res) => {
  try {
    console.log(req.body);
    const tag = await Tag.create(req.body);
    res.json(tag);
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};

export const getTag = async (req, res) => {
  try {
    const tag = await Tag.find();
    res.json(tag);
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};

export const getTagByID = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    res.json(tag);
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};

export const updateTag = async (req, res) => {
  try {
    const tagId = req.params.id; // Extract the tag ID from the request params

    // Delete the tag by its ID
    const result = await Tag.findByIdAndDelete(tagId);

    // Check if any document was deleted
    if (result) {
      // Create a new tag with the updated data
      try {
        // If the tag ID does not exist in the database, create a new tag
        const updatedTag = await Tag.create(req.body);

        // Return the updated tag
        res.json(updatedTag);
      } catch (error) {
        // If the tag ID already exists in the database, update the existing tag
        const updatedTag = await Tag.create({ _id: tagId });
        res.status(500).json({ message: "Updated tag already exists" });
      }
    } else {
      res.status(404).json({ message: "Tag not found" });
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const tagId = req.params.id; // Extract the tag ID from the request params

    // Delete the tag by its ID
    const result = await Tag.deleteOne({ _id: tagId });

    // Check if any document was deleted
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Tag deleted successfully" });
    } else {
      res.status(404).json({ message: "Tag not found" });
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
