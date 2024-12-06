const express = require("express");
const Question = require("../models/questions");

const {
  addTag,
  getQuestionsByOrder,
  filterQuestionsBySearch,
} = require("../utils/question");
const comments = require("../models/comments");
const { default: mongoose } = require("mongoose");
const { createActivityLog } = require("./activityLog");
const UserModel = require("../models/schema/User.js");

const router = express.Router();

const getQuestionsByFilter = async (req, res) => {
  try {
    const order = req.query.order || "newest";
    const search = req.query.search || "";
    let questions = await getQuestionsByOrder(order);
    questions = filterQuestionsBySearch(questions, search);
    res.status(200);
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
const getQuestionById = async (req, res) => {
  try {
    const questionId = req.params.id;
    const userId = req.params.userId;

    // Fetch the question first to ensure it exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }

    // Ensure views is an array if it doesn't exist
    if (!Array.isArray(question.views)) {
      question.views = [];
    }

    // Add userId to views and increment viewCount
    if (!question.views.includes(userId)) {
      question.views.push(userId);
      question.viewCount += 1;
      await question.save();
    }

    // Populate the necessary fields
    const populatedQuestion = await Question.findById(questionId)
      .populate("answers")
      .populate("tags")
      .populate("comments");

    res.status(200).json(populatedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
// const getQuestionByIdWithoutViews = async (req, res) => {
//   try {
//     const question = await Question.findById(req.params.qid);
//     if (!question) {
//       return res.status(404).json({ msg: "Question not found" });
//     }
//     res.status(200).json(question);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Internal server error" });
//   }
// };
const addQuestion = async (req, res) => {
  try {
    let tags = await Promise.all(
      req.body.tags.map(async (tag) => {
        return await addTag(tag);
      })
    );

    let question = await Question.create({
      title: req.body.title,
      text: req.body.text,
      asked_by: req.body.asked_by,
      ask_date_time: req.body.ask_date_time,
      tags: tags,
      views: [], // Initialize as an empty array
      viewCount: 0, // Initialize view count to 0
      answers: [], // Initialize as an empty array
      upvotes: [], // Initialize as an empty array
      downvotes: [], // Initialize as an empty array
      comments: [], // Initialize as an empty array
    });
    let user = await UserModel.findOne({ username: req.body.asked_by });
    await createActivityLog(
      user._id,
      "Posted Question",
      "Question",
      question?._id
    );

    console.log("QUESTION is", question);
    res.status(201).json(question);
  } catch (error) {
    console.error("Error adding question:", error);
    res
      .status(500)
      .json({ msg: "Error creating question", error: error.message });
  }
};
router.get("/getQuestion", (req, res) => {
  getQuestionsByFilter(req, res).then((data) => {
    return data;
  });
});

router.get("/getQuestionById/:id/:userId", (req, res) =>
  getQuestionById(req, res).then((data) => {
    return data;
  })
);

// router.get("/getQuestionById/:id", (req, res) =>
//   getQuestionByIdWithoutViews(req, res).then((data) => {
//     return data;
//   })
// );

router.post("/addQuestion", (req, res) =>
  addQuestion(req, res).then((data) => {
    return data;
  })
);

router.put("/:id/vote", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ msg: "Question not found" });

    const userId = req.body.userId; // Assuming you have middleware to get the current user

    // Check if the user has already upvoted
    if (question.upvotes.includes(userId)) {
      // Remove the upvote
      question.upvotes = question.upvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    // Check if the user has already downvoted
    if (question.downvotes.includes(userId)) {
      // Remove the downvote
      question.downvotes = question.downvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    const voteType = req.body.voteType; // 'upvote' or 'downvote'
    if (voteType === "upvote") {
      await createActivityLog(userId, "Upvoted", "Question", question._id);
      question.upvotes.push(userId);
    } else if (voteType === "downvote") {
      await createActivityLog(userId, "Downvoted", "Question", question._id);
      question.downvotes.push(userId);
    } else {
      return res.status(400).json({ msg: "Invalid vote type" });
    }

    await question.save();

    res.json({ msg: `Question ${voteType}d successfully` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/:id/comments", async (req, res) => {
  try {
    console.log("it came here");
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ msg: "Question not found" });

    const { text, posted_by } = req.body;

    const newComment = new comments({
      text,
      posted_by,
      posted_date_time: Date.now(),
    });
    console.log("posted by", posted_by);
    const comment = await newComment.save();
    question.comments.push(comment._id);
    await question.save();
    await createActivityLog(
      posted_by,
      "Posted Comment",
      "Question",
      question?._id,
      newComment._id
    );
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.delete("/:questionId/comments/:commentId", async (req, res) => {
  try {
    console.log("id is", req.params.questionId, req.params.commentId);
    const question = await Question.findById(req.params.questionId);
    if (!question) return res.status(404).json({ msg: "question not found" });

    const comment = await comments.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    // Check if the comment belongs to the answer
    if (!question.comments.includes(comment._id)) {
      return res
        .status(400)
        .json({ msg: "Comment does not belong to this answer" });
    }

    // Remove the comment from the answer
    question.comments = question.comments.filter(
      (id) => id.toString() !== comment._id.toString()
    );
    await question.save();

    // Remove the comment from the database
    await comments.findOneAndDelete({ _id: req.params.commentId });

    res.json({ msg: "Comment removed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findById(questionId);
    console.log("Question id is", questionId);
    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }
    const deletedQuestion = await Question.deleteOne({ _id: questionId });

    // Delete the question
    // await question.remove();

    res.json({ msg: "Question deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

const getQuestionByIdWithoutViews = async (req, res) => {
  console.log(req.params);
  try {
    const questionId = req.params.id;
    const userId = req.params.userId; // Assuming you have middleware to get the current user ID
    console.log("user id", questionId, userId);
    let question = await Question.findOneAndUpdate(
      {
        _id: questionId,
        views: { $ne: userId }, // Check if the user ID is not already present in the views array
      },
      {
        $push: { views: userId }, // Add the user ID to the views array
        $inc: { viewCount: 1 }, // Increment the viewCount field
      },
      { new: true }
    );
    console.log("Came here", question);

    if (!question) {
      // If the user ID is already present in the views array, fetch the question without updating
      question = await Question.findById(questionId);
    }

    question = await question.populate("answers");
    res.status(200);
    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

router.get("/getQuestionById/:qid", getQuestionByIdWithoutViews);

module.exports = router;
