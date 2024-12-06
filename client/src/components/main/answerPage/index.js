import { useEffect, useState } from "react";
import { getMetaData } from "../../../tool";
import Answer from "./answer";
import AnswerHeader from "./header";
import "./index.css";
import QuestionBody from "./questionBody";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import {
  addCommentToAnswer,
  addCommentToQuestion,
  deleteCommentFromAnswer,
  deleteCommentFromQuestion,
  downvoteAnswer,
  downvoteQuestion,
  getLocalUser,
  upvoteAnswer,
  upvoteQuestion,
  deleteAnswer,
  deleteQuestion,
} from "../../../validation/helper";
import { getQuestionById } from "../../../services/questionService";

const AnswerPage = ({ qid, handleNewQuestion, handleNewAnswer }) => {
  const [question, setQuestion] = useState({});
  const [answerComments, setAnswerComments] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [selectedComments, setSelectedComments] = useState([]);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [isAnswerDialogOpen, setIsAnswerDialogOpen] = useState(false);
  const [questionComment, setQuestionComment] = useState("");
  const [answerComment, setAnswerComment] = useState("");
  const [user, setUser] = useState({});
  const [questionComments, setQuestionComments] = useState([]);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(null);

  const handleDeleteQuestionComment = async (questionId, commentId) => {
    try {
      await deleteCommentFromQuestion(questionId, commentId);
      // Update the questionComments state after successful deletion
      setQuestionComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment from question:", error);
    }
  };

  const handleDeleteAnswerComment = async (answerId, commentId) => {
    try {
      await deleteCommentFromAnswer(answerId, commentId);
      // Update the answerComments state after successful deletion
      setAnswerComments((prevAnswerComments) => {
        const updatedAnswerComments = { ...prevAnswerComments };
        if (updatedAnswerComments[answerId]) {
          updatedAnswerComments[answerId] = prevAnswerComments[answerId].filter(
            (comment) => comment._id !== commentId
          );
        }
        return updatedAnswerComments;
      });
    } catch (error) {
      console.error("Error deleting comment from answer:", error);
    }
  };

  const fetchAnswerComments = async (answerId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/comment/answer/${answerId}`
      );
      if (res.ok) {
        const comments = await res.json();
        console.log("Comments are", comments, answerId);
        setAnswerComments((prevState) => ({
          ...prevState,
          [answerId]: comments,
        }));
      } else {
        console.error(`Failed to fetch comments for answer ${answerId}`);
      }
    } catch (error) {
      console.error(`Error fetching comments for answer ${answerId}:`, error);
    }
  };

  const openQuestionDialog = () => {
    setIsQuestionDialogOpen(true);
  };
  const handleSelectAnswer = (index) => {
    if (selectedAnswers.includes(index)) {
      setSelectedAnswers(selectedAnswers.filter((i) => i !== index));
    } else {
      setSelectedAnswers([...selectedAnswers, index]);
    }
  };

  const handleDeleteSelectedAnswers = () => {
    const updatedAnswers = question.answers.filter(
      (_, idx) => !selectedAnswers.includes(idx)
    );
    setQuestion({ ...question, answers: updatedAnswers });
    setSelectedAnswers([]);
  };

  const closeQuestionDialog = () => {
    setIsQuestionDialogOpen(false);
    setQuestionComment("");
  };

  const openAnswerDialog = (index) => {
    setCurrentAnswerIndex(index);
    setIsAnswerDialogOpen(true);
  };

  const closeAnswerDialog = () => {
    setIsAnswerDialogOpen(false);
    setAnswerComment("");
  };

  const handleQuestionCommentChange = (event) => {
    setQuestionComment(event.target.value);
  };

  const handleAnswerCommentChange = (event) => {
    setAnswerComment(event.target.value);
  };

  const submitQuestionComment = async () => {
    if (questionComment.trim() !== "") {
      const commentData = {
        text: questionComment,
        posted_by: user?.userId,
      };
      console.log(JSON.stringify(commentData), "Body", qid);
      try {
        const response = await fetch(
          `http://localhost:8000/question/${qid}/comments/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(commentData),
          }
        );
        let temp = await response.json();
        console.log("this is response", temp._id);
        if (response.ok) {
          // Update the questionComments state with the new comment
          setQuestionComments([...questionComments, temp]);
          setQuestionComment("");
          closeQuestionDialog();
        } else {
          console.error("Failed to add comment to question");
        }
      } catch (error) {
        console.error("Error adding comment to question:", error);
      }
    }
  };

  const submitAnswerComment = async () => {
    if (answerComment.trim() !== "") {
      const commentData = {
        text: answerComment,
        posted_by: user?.userId, // Replace with the appropriate user ID
      };
      console.log("currr", question.answers, currentAnswerIndex);
      try {
        const response = await fetch(
          `http://localhost:8000/answer/${question.answers[currentAnswerIndex]._id}/comments/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(commentData),
          }
        );

        if (response.ok) {
          // Update the answer comments state with the new comment
          const updatedAnswers = [...question.answers];
          updatedAnswers[currentAnswerIndex] = {
            ...updatedAnswers[currentAnswerIndex],
            comments: [
              ...(updatedAnswers[currentAnswerIndex].comments || []),
              {
                id: Date.now(),
                text: answerComment,
                author: "You",
                date: new Date().toLocaleString(),
                upvotes: 0,
                downvotes: 0,
              },
            ],
          };
          setQuestion({ ...question, answers: updatedAnswers });
          setAnswerComment("");
          setShouldRefetch(!shouldRefetch);
          closeAnswerDialog();
        } else {
          console.error("Failed to add comment to answer");
        }
      } catch (error) {
        console.error("Error adding comment to answer:", error);
      }
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      let user = await getLocalUser();

      let res = await getQuestionById(qid, user?.userId);
      console.log("response", res);
      if (res.answers) {
        res.answers.forEach((answer) => {
          if (!answer.comments) {
            answer.comments = [];
          }
          fetchAnswerComments(answer._id);
        });
      }
      setQuestion(res || {});
      setShouldRefetch(false); // Reset shouldRefetch after fetching the updated data
    };
    fetchData().catch((e) => console.log(e));
  }, [qid, shouldRefetch]);

  useEffect(() => {
    const fetchData = async () => {
      let user = await getLocalUser();
      setUser(user);
    };
    fetchData().catch((e) => console.log(e));
  }, [qid, shouldRefetch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/comment/question/${qid}`
        );
        if (res.ok) {
          const comments = await res.json();
          console.log("comments are ", comments);
          setQuestionComments(comments);
        } else {
          console.error("Failed to fetch comments for question");
        }
      } catch (error) {
        console.error("Error fetching comments for question:", error);
      }
    };
    fetchData().catch((e) => console.log(e));
  }, [qid, shouldRefetch]);

  const handleUpvote = async (type, id) => {
    console.log("hey there");
    const voteType = "upvote";
    let user = await getLocalUser();
    const userId = user?.userId; // Replace with the appropriate user ID
    console.log("ujer is", user);
    try {
      let endpoint = "";
      let updatedData = null;

      if (type === "question") {
        endpoint = `http://localhost:8000/question/${qid}/vote`;
        updatedData = { userId, voteType };
        // await upvoteQuestion(qid);
        setQuestion({ ...question, upvotes: question.upvotes + 1 });
      } else if (type === "answer") {
        console.log("ASNWER");

        endpoint = `http://localhost:8000/answer/${question.answers[id]._id}/vote`;
        updatedData = { userId, voteType };
        // await upvoteAnswer(question.answers[id]._id);
        const updatedAnswers = [...question.answers];
        updatedAnswers[id] = {
          ...updatedAnswers[id],
          upvotes: updatedAnswers[id].upvotes + 1,
        };
        setQuestion({ ...question, answers: updatedAnswers });
      } else if (type === "comment") {
        // console.log("alksdn", id);
        endpoint = `http://localhost:8000/comment/${id}/vote`;
        updatedData = { userId, voteType };
        const updatedAnswers = [...question.answers];
        const answerIndex = updatedAnswers.findIndex((answer) =>
          answer.comments.some((comment) => comment._id === id)
        );

        if (answerIndex !== -1) {
          const updatedComments = updatedAnswers[answerIndex].comments.map(
            (comment) =>
              comment._id === id
                ? { ...comment, upvotes: comment.upvotes + 1 }
                : comment
          );
          updatedAnswers[answerIndex] = {
            ...updatedAnswers[answerIndex],
            comments: updatedComments,
          };
          setQuestion({ ...question, answers: updatedAnswers });
        }

        // const updatedAnswers = [...question.answers];
        // let mainAnswer = updatedAnswers.filter((answer) => {
        //   console.log(answer);
        //   return answer.comments.some((comment) => comment === id);
        // });
        // console.log("Updated answers", mainAnswer, mainAnswer.comments);
        // const answerComments = mainAnswer.map((answer) =>
        //   answer.comment === id
        //     ? { ...answer.comment, upvotes: answer.comment.upvotes + 1 }
        //     : answer.comment
        // );
        // updatedAnswers[id].comments = answerComments;
        // setQuestion({ ...question, answers: updatedAnswers });
      }

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      setShouldRefetch(!shouldRefetch);

      if (!response.ok) {
        console.error(`Failed to upvote ${type}`);
      }
    } catch (error) {
      console.error(`Error upvoting ${type}:`, error);
    }
  };

  const handleDownvote = async (type, id) => {
    let user = await getLocalUser();
    const userId = user?.userId; // R
    // const userId = "661cf610a113defed1ce022b"; // Replace with the appropriate user ID
    const voteType = "downvote";

    try {
      let endpoint = "";
      let updatedData = null;

      if (type === "question") {
        endpoint = `http://localhost:8000/question/${qid}/vote`;
        updatedData = { userId, voteType };
        // await downvoteQuestion(qid);
        setQuestion({ ...question, downvotes: question.downvotes + 1 });
      } else if (type === "answer") {
        endpoint = `http://localhost:8000/answer/${question.answers[id]._id}/vote`;
        updatedData = { userId, voteType };
        // await downvoteAnswer(question.answers[id]._id);
        const updatedAnswers = [...question.answers];
        updatedAnswers[id] = {
          ...updatedAnswers[id],
          downvotes: updatedAnswers[id].downvotes + 1,
        };
        setQuestion({ ...question, answers: updatedAnswers });
      } else if (type === "comment") {
        endpoint = `http://localhost:8000/comment/${id}/vote`;
        updatedData = { userId, voteType };
        const updatedAnswers = [...question.answers];
        const answerIndex = updatedAnswers.findIndex((answer) =>
          answer.comments.some((comment) => comment._id === id)
        );

        if (answerIndex !== -1) {
          const updatedComments = updatedAnswers[answerIndex].comments.map(
            (comment) =>
              comment._id === id
                ? { ...comment, downvotes: comment.downvotes + 1 }
                : comment
          );
          updatedAnswers[answerIndex] = {
            ...updatedAnswers[answerIndex],
            comments: updatedComments,
          };
          setQuestion({ ...question, answers: updatedAnswers });
        }
        // const updatedAnswers = [...question.answers];
        // const answerComments = updatedAnswers[id].comments.map((comment) =>
        //   comment.id === id
        //     ? { ...comment, downvotes: comment.downvotes + 1 }
        //     : comment
        // );
        // updatedAnswers[id].comments = answerComments;
        // setQuestion({ ...question, answers: updatedAnswers });
      }

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      setShouldRefetch(!shouldRefetch);

      if (!response.ok) {
        console.error(`Failed to downvote ${type}`);
      }
    } catch (error) {
      console.error(`Error downvoting ${type}:`, error);
    }
  };

  // const handleDeleteAnswer = (index) => {
  //   const updatedAnswers = question.answers.filter((_, idx) => idx !== index);
  //   setQuestion({ ...question, answers: updatedAnswers });
  // };
  const handleDeleteAnswer = async (answerIndex) => {
    try {
      // const answerId = question.answers[answerIndex]._id;
      const questionId = qid; // Assuming qid is the question ID

      await deleteAnswer(questionId, answerIndex);

      // Update the state by removing the deleted answer
      const updatedAnswers = question.answers.filter(
        (_, idx) => idx !== answerIndex
      );
      setQuestion({ ...question, answers: updatedAnswers });
      setSelectedAnswers([]);
      setShouldRefetch(!shouldRefetch);
    } catch (error) {
      console.error("Error deleting answer:", error);
    }
  };

  const handleDeleteComment = async (answerIndex, commentId) => {
    await deleteCommentFromAnswer(question.answers[answerIndex].id, commentId);
    const updatedAnswers = [...question.answers];
    updatedAnswers[answerIndex].comments = updatedAnswers[
      answerIndex
    ].comments.filter((c) => c.id !== commentId);
    setQuestion({ ...question, answers: updatedAnswers });
    setSelectedComments(selectedComments.filter((id) => id !== commentId));
  };
  const handleSelectComment = (commentId) => {
    if (selectedComments.includes(commentId)) {
      setSelectedComments(selectedComments.filter((id) => id !== commentId));
    } else {
      setSelectedComments([...selectedComments, commentId]);
    }
  };

  const handleDeleteSelectedComments = () => {
    const updatedAnswers = question.answers.map((ans) => ({
      ...ans,
      comments: ans.comments.filter((c) => !selectedComments.includes(c.id)),
    }));
    setQuestion({ ...question, answers: updatedAnswers });
    setSelectedComments([]);
  };

  return (
    <>
      <AnswerHeader
        ansCount={question && question.answers && question.answers.length}
        title={question && question.title}
        handleNewQuestion={handleNewQuestion}
      />
      <div>
        <QuestionBody
          upvotes={question && question?.upvotes?.length}
          downvotes={question && question?.downvotes?.length}
          views={
            question && question?.views?.length ? question?.views?.length : 0
          }
          text={question && question.text}
          askby={question && question.asked_by}
          handleUpvote={handleUpvote}
          handleDownvote={handleDownvote}
          meta={question && getMetaData(new Date(question.ask_date_time))}
        />

        <div>
          <div className="CommentForQuestion" onClick={openQuestionDialog}>
            Add Comment to Question
          </div>
          {questionComments.length > 0 && (
            <div className="comments-section">
              <h2 className="comment-title"> Comments: </h2>
              {questionComments.map((c, id) => (
                <div>
                  <div key={c.id} className="comment comment-indented divi">
                    <p className="comment-author">{c.author}</p>
                    <p className="comment-date">{c.date}</p>
                    <div className="comment-votes-1">
                      <button
                        id="upvote-question-comments"
                        onClick={() => handleUpvote("comment", c?._id)}
                      >
                        <FontAwesomeIcon icon={faThumbsUp} />
                        {c.upvotes?.length}
                      </button>
                      <button
                        id="downvote-question-comments"
                        onClick={() => handleDownvote("comment", c?._id)}
                      >
                        <FontAwesomeIcon icon={faThumbsDown} />
                        {c.downvotes?.length}
                      </button>
                    </div>
                    <div id="question-comment" className="comment-text">
                      {c.text}
                    </div>
                    {user?.isModerator && (
                      <button
                        id="delete-question-comment"
                        onClick={async () => {
                          console.log("id is", c?._id);
                          await deleteCommentFromQuestion(qid, c?._id);
                          await setShouldRefetch(!shouldRefetch);
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {isQuestionDialogOpen && (
        <div className="comment_dialog">
          <div className="comment_dialog_content">
            <textarea
              className="comment_textarea"
              value={questionComment}
              onChange={handleQuestionCommentChange}
              placeholder="Enter your comment here..."
            ></textarea>
            <div className="comment_dialog_buttons">
              <button className="cancel_button" onClick={closeQuestionDialog}>
                Cancel
              </button>
              <button className="submit_button" onClick={submitQuestionComment}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="answers-separator">
        Answers ({question.answers ? question.answers.length : 0})
      </div>
      <div className="answers-container">
        {question &&
          question.answers &&
          question.answers.map((a, idx) => (
            <div key={idx} className="answer-container">
              <div className="answersForQuestion">
                <div className="comment-votes-1">
                  <button
                    id="upvote-answer"
                    onClick={() => handleUpvote("answer", idx)}
                  >
                    {a?.upvotes?.length || 0}
                    <FontAwesomeIcon icon={faThumbsUp} />
                  </button>
                  <button
                    id="downvote-answer"
                    onClick={() => handleDownvote("answer", idx)}
                  >
                    {a?.downvotes?.length || 0}
                    <FontAwesomeIcon icon={faThumbsDown} />
                  </button>
                </div>
                <Answer
                  isModerator={user?.isModerator}
                  className="CommentAnswer"
                  text={a.text}
                  ansBy={a.ans_by}
                  meta={getMetaData(new Date(a.ans_date_time))}
                  onDelete={() => handleDeleteAnswer(a?._id)}
                  onSelect={() => handleSelectAnswer(idx)}
                  isSelected={selectedAnswers.includes(idx)}
                />
              </div>

              <div className="comments-section">
                <button
                  className="ansButton"
                  onClick={() => openAnswerDialog(idx)}
                >
                  Reply
                </button>
                {answerComments[a._id] && answerComments[a._id].length > 0 && (
                  <>
                    {answerComments[a._id].map((c, index) => {
                      return (
                        <div className="main_div">
                          <div className="comment-votes-1">
                            <button
                              id="upvote-answer-comment"
                              onClick={() => handleUpvote("comment", c?._id)}
                            >
                              {c?.upvotes?.length || 0}{" "}
                              <FontAwesomeIcon icon={faThumbsUp} />
                            </button>
                            <button
                              id="downvote-answer-comment"
                              onClick={() => handleDownvote("comment", c?._id)}
                            >
                              {c?.downvotes?.length || 0}{" "}
                              <FontAwesomeIcon icon={faThumbsDown} />
                            </button>
                          </div>
                          <div key={c.id} className="answer-container">
                            <div className="comment-header">
                              <p className="comment-author">{c.author}</p>
                              <p className="comment-date">{c.date}</p>
                            </div>
                            <p id="answer-comment" className="comment-text">
                              {c.text}
                            </p>
                          </div>
                          {user?.isModerator && (
                            <button
                              id="delete-answer-comment"
                              onClick={() =>
                                handleDeleteAnswerComment(a?._id, c?._id)
                              }
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          ))}
        <button
          className="bluebtn ansButton"
          onClick={() => {
            handleNewAnswer();
          }}
        >
          Answer Question
        </button>
      </div>
      {isAnswerDialogOpen && (
        <div className="comment_dialog">
          <div className="comment_dialog_content">
            <textarea
              className="comment_textarea"
              value={answerComment}
              onChange={handleAnswerCommentChange}
              placeholder="Enter your comment here..."
            ></textarea>
            <div className="comment_dialog_buttons">
              <button className="cancel_button" onClick={closeAnswerDialog}>
                Cancel
              </button>
              <button className="submit_button" onClick={submitAnswerComment}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AnswerPage;
