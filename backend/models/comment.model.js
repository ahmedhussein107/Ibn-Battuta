import mongoose from "mongoose";
import { validateReference, validateReferences } from "./validatingUtils.js";

const commentSchema = new mongoose.Schema(
    {
        complaintID: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint" },
        body: String,
        authorType: { type: String, enum: ["Tourist", "Admin"], required: true },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "authorType",
            required: true,
        },
        replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    },
    { timestamps: true }
);

const validateAuthorTypeAndId = async (authorType, author, next) => {
  try {
    const validModels = ["Tourist", "Admin"];
    if (!validModels.includes(authorType)) {
      return next(new Error(`Invalid authorType of comments: ${authorType}`));
    }
    await validateReference(author, authorType, next);
    next();
  } catch (err) {
    return next(err);
  }
};

commentSchema.pre("save", async function (next) {
  try {
    const { authorType, author } = this;

    if (!authorType || !author) {
      return next(new Error("Both authorType and author are required."));
    }
    await validateAuthorTypeAndId(authorType, author, next);
    next();
  } catch (error) {
    next(error);
  }
});

const validateReferencesMiddleware = async function (next) {
  try {
    console.log("i am in middleware of updating comment");
    const update = this.getUpdate();
    const updatedAuthorType = update.authorType || update["$set.authorType"];
    const updatedAuthor = update.author || update["$set.author"];
    const updatedReplies = update.replies || update["$set.replies"];

    const authorType = updatedAuthorType;
    const author = updatedAuthor;
    const replies = updatedReplies;
    if (authorType && author) {
      await validateAuthorTypeAndId(authorType, author, next);
    }
    if (replies && replies.length > 0) {
      await validateReferences(replies, "Comment", next);
    }
    next();
  } catch (error) {
    next(error);
  }
};

commentSchema.pre("findOneAndUpdate", validateReferencesMiddleware);
commentSchema.pre("updateOne", validateReferencesMiddleware);
commentSchema.pre("findByIdAndUpdate", validateReferencesMiddleware);

export default mongoose.model("Comment", commentSchema);
