export const genericSearch = async (Model, queryParams) => {
  const { name, categories, tags } = queryParams;

  let query = {};

  // If `name` is provided, use a regular expression for partial and case-insensitive match
  if (name) {
    query.name = { $regex: name, $options: "i" };
  }

  // If `categories` is provided, match the categories exactly
  if (categories) {
    query.categories = { $in: categories };
  }

  // If `tags` are provided, check for any of the tags
  if (tags) {
    const tagsArray = Array.isArray(tags) ? tags : tags.split(",");
    query.tags = { $in: tagsArray };
  }

  console.log("Constructed MongoDB Query:", query);

  // Perform the search using the constructed query
  const results = await Model.find(query);
  return results;
};
