export const genericSearch = async (Model, queryParams) => {
    const { name, categories, tags } = queryParams;

    let query = {};

    // If `name` is provided, use a regular expression for partial and case-insensitive match
    if (name) {
        query.name = { $regex: name, $options: "i" };
    }

    // If `categories` is provided, match the categories exactly
    if (categories) {
        const categoriesArray = Array.isArray(tags) ? tags : tags.split(",");
        query.categories = { $in: categoriesArray };
    }

    // If `tags` are provided, check for any of the tags
    if (tags) {
        const tagsArray = Array.isArray(tags) ? tags : tags.split(",");
        query.tags = { $in: tagsArray };
    }

    // debugging
    console.log("Constructed MongoDB Query:", query);

    // Perform the search using the constructed query
    const results = await Model.find(query);
    return results;
};

// Utility function to handle range, exact match, and date filtering
export const buildFilter = (filters) => {
    const query = {};

    for (const key in filters) {
        const value = filters[key];
        // Handle LIKE queries (e.g., name=~John)
        if (typeof value === "string" && value.startsWith("~")) {
            query[key] = { $regex: value.substring(1), $options: "i" }; // Case-insensitive regex
        }
        // Check for range-like values (e.g., price=50-200, rating=4-5)
        else if (typeof value === "string" && value.includes("~")) {
            // Special handling for dates in the format "YYYY-MM-DD~YYYY-MM-DD"
            const [startDate, endDate] = value.split("~");
            query[key] = {};
            if (startDate) query[key].$gte = new Date(startDate);
            if (endDate) query[key].$lte = new Date(endDate);
        }
        // Check for other range values (e.g., numbers like price=50-200)
        else if (typeof value === "string" && value.includes("-")) {
            const [min, max] = value.split("-").map(Number);
            query[key] = {};
            if (min) query[key].$gte = min;
            if (max) query[key].$lte = max;
        }
        // Check for array values (e.g., tags=tag1|tag2|tag3)
        else if (value.includes("|")) {
            const values = value.split("|");
            console.log("Array value", values);
            query[key] = { $in: values };
        }
        // Handle exact match
        else {
            query[key] = value;
        }
    }

    return query;
};
