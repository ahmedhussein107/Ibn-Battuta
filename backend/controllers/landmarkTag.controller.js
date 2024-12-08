import LandmarkTag from "../models/landmarkTag.model";

export const createLandmarkTag = async (req, res) => {
	try {
		console.log(req.body);
		const landmarkTag = await LandmarkTag.create(req.body);
		res.json(landmarkTag);
	} catch (e) {
		res.status(400).json({ e: e.message });
	}
};

export const getLandmarkTags = async (req, res) => {
	try {
		const landmarkTag = await LandmarkTag.find();
		res.json(landmarkTag);
	} catch (e) {
		res.status(400).json({ e: e.message });
	}
};

export const getLandmarkTag = async (req, res) => {
	try {
		const landmarkTag = await LandmarkTag.findById(req.params.id);
		res.json(landmarkTag);
	} catch (e) {
		res.status(400).json({ e: e.message });
	}
};

export const updateLandmarkTag = async (req, res) => {
	try {
		const tagId = req.params.id; // Extract the tag ID from the request params

		// Delete the tag by its ID
		const result = await LandmarkTag.findByIdAndDelete(tagId);

		// Check if any document was deleted
		if (result) {
			// Create a new tag with the updated data
			try {
				// If the tag ID does not exist in the database, create a new tag
				const updatedTag = await LandmarkTag.create(req.body);

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

export const deleteLandmarkTag = async (req, res) => {
	try {
		const tagId = req.params.id; // Extract the tag ID from the request params

		// Delete the tag by its ID
		const result = await LandmarkTag.deleteOne({ _id: tagId });

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
