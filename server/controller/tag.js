const express = require("express");
const Tag = require("../models/tags");
const Question = require("../models/questions");

const router = express.Router();

router.get('/getTagsWithQuestionNumber', async (req, res) => {
    try {
        const tags = await Tag.find();
        const questions = await Question.find().populate('tags');
        
        const tagDetails = tags.map(tag => {
            const questionCount = questions.reduce((count, q) => {
                return count + q.tags.filter(t => t.name === tag.name).length;
            }, 0);
            return { name: tag.name, qcnt: questionCount };
        });
        res.json(tagDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router;
