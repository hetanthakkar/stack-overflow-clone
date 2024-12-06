const express = require("express");
const Answer = require("../models/answers");
const Question = require("../models/questions");
const comments = require("../models/comments");
const Comment = require("../models/comments");
const UserModel = require("../models/schema/User.js");
const { createActivityLog } = require("./activityLog");

const router = express.Router();

router.post("/addAnswer", async (req, res) => {
  try {
    const answer = await Answer.create(req.body.ans);
    const qid = req.body.qid;
    const updatedQuestion = await Question.findByIdAndUpdate(
      qid,
      { $push: { answers: { $each: [answer._id], $position: 0 } } },
      { new: true }
    );

    let user = await UserModel.findOne({ username: req.body.ans.ans_by });

    await createActivityLog(user?._id, "Posted Answer", "Question", qid);
    res.json(answer);
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ error: "An error occurred" });
  }
});

// Upvote an answer
// Vote (upvote/downvote) an answer
router.put("/:id/vote", async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    console.log("request is", req.params);
    if (!answer) return res.status(404).json({ msg: "Answer not found" });
    const { userId } = req.body;

    // const userId = user?.userId;

    // Check if the user has already upvoted
    if (answer.upvotes.includes(userId)) {
      // Remove the upvote
      answer.upvotes = answer.upvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    // Check if the user has already downvoted
    if (answer.downvotes.includes(userId)) {
      // Remove the downvote
      answer.downvotes = answer.downvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    const voteType = req.body.voteType; // 'upvote' or 'downvote'
    if (voteType === "upvote") {
      await createActivityLog(userId, "Upvoted", "Answer", answer._id);
      answer.upvotes.push(userId);
    } else if (voteType === "downvote") {
      await createActivityLog(userId, "Downvoted", "Answer", answer._id);
      answer.downvotes.push(userId);
    } else {
      return res.status(400).json({ msg: "Invalid vote type" });
    }

    await answer.save();

    res.json({ msg: `Answer ${voteType}d successfully` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/:id/comments", async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ msg: "Answer not found" });

    const { text, posted_by } = req.body;

    const newComment = new comments({
      text,
      posted_by,
      posted_date_time: Date.now(),
    });

    const comment = await newComment.save();
    console.log("answers", answer);
    answer.comments.push(comment._id);
    await answer.save();

    await createActivityLog(
      posted_by,
      "Posted Comment",
      "Answer",
      answer?._id,
      newComment._id
    );
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:answerId/comments/:commentId", async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId);
    if (!answer) return res.status(404).json({ msg: "Answer not found" });

    const comment = await Comment.findById(req.params.commentId);
    console.log("comment", comment);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    // Check if the comment belongs to the answer
    if (!answer.comments.includes(comment._id)) {
      return res
        .status(400)
        .json({ msg: "Comment does not belong to this answer" });
    }

    // Remove the comment from the answer
    answer.comments = answer.comments.filter(
      (id) => id.toString() !== comment._id.toString()
    );
    await answer.save();

    // Remove the comment from the database
    await Comment.findOneAndDelete({ _id: req.params.commentId });

    res.json({ msg: "Comment removed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:qid/:id", async (req, res) => {
  try {
    // Find the answer by ID
    const answer = await Answer.findById(req.params.id);

    // If the answer doesn't exist, return a 404 error
    if (!answer) {
      return res.status(404).json({ msg: "Answer not found" });
    }

    // Find the question that the answer belongs to
    const question = await Question.findOne({ _id: req.params.qid });

    // If the question doesn't exist, return a 404 error
    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }

    // Remove the answer from the question's answers array
    question.answers = question.answers.filter(
      (answerId) => answerId.toString() !== req.params.id
    );

    // Save the updated question
    await question.save();

    // Remove the answer from the database
    await Answer.findOneAndDelete({ _id: req.params.id });

    res.json({ msg: "Answer removed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
