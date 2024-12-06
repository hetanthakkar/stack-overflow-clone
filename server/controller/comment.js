// Import required modules and models
const express = require("express");
const router = express.Router();
const Comment = require("../models/comments");
const Question = require("../models/questions");
const Answer = require("../models/answers");
const { createActivityLog } = require("./activityLog");
// Upvote a comment
router.put("/:id/vote", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    const userId = req.body.userId;
    const voteType = req.body.voteType; // 'upvote' or 'downvote'

    // Remove user from existing votes first
    comment.upvotes = comment.upvotes.filter(
      (id) => id.toString() !== userId.toString()
    );
    comment.downvotes = comment.downvotes.filter(
      (id) => id.toString() !== userId.toString()
    );

    // Add new vote based on voteType
    if (voteType === "upvote") {
      await createActivityLog(userId, "Upvoted", "Comment", comment._id);
      comment.upvotes.push(userId);
    } else if (voteType === "downvote") {
      await createActivityLog(userId, "Downvoted", "Comment", comment._id);
      comment.downvotes.push(userId);
    } else {
      return res.status(400).json({ msg: "Invalid vote type" });
    }

    await comment.save();
    res.json({ msg: `Comment ${voteType}d successfully` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// Fetch comments by question ID
// Fetch comments by question ID
router.get("/question/:questionId", async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) return res.status(404).json({ msg: "Question not found" });

    const commentIds = question.comments;
    const comments = await Comment.find({ _id: { $in: commentIds } });

    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/answer/:answerId", async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId);
    if (!answer) return res.status(404).json({ msg: "Answer not found" });

    const commentIds = answer.comments;
    const comments = await Comment.find({ _id: { $in: commentIds } });

    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
