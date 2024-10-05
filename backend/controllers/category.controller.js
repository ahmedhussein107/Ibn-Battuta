import Category from "../models/category.model.js";

export const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = req.params.id; // Extract the tag ID from the request params

    // Delete the tag by its ID
    const result = await Category.findByIdAndDelete(category);

    // Check if any document was deleted
    if (result) {
      // Create a new tag with the updated data
      try {
        // If the tag ID does not exist in the database, create a new tag
        const updatedCategory = await Category.create(req.body);

        // Return the updated tag
        res.json(updatedCategory);
      } catch (error) {
        // If the tag ID already exists in the database, update the existing tag
        const updatedCategory = await Category.create({ _id: category });
        res.status(500).json({ message: "Updated category already exists" });
      }
    } else {
      res.status(404).json({ message: "category not found" });
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = req.params.id; // Extract the tag ID from the request params

    // Delete the tag by its ID
    const result = await Category.findByIdAndDelete(category);

    // Check if any document was deleted
    if (result) {
      res.status(200).json({ message: "Category deleted successfully" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
