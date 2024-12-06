import "./index.css";
import QuestionHeader from "./header";
import Question from "./question";
import { getQuestionsByFilter } from "../../../services/questionService";
import { useEffect, useState } from "react";
import { getLocalUser } from "../../../validation/helper";
import { Trash2, Plus } from "lucide-react";

const QuestionPage = ({
  title_text = "All Questions",
  order,
  search,
  setQuestionOrder,
  clickTag,
  handleAnswer,
  handleNewQuestion,
}) => {
  const [qlist, setQlist] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let user = await getLocalUser();
      setUser(user);
      let res = await getQuestionsByFilter(order, search);
      setQlist(res || []);
    };
    fetchData().catch((e) => console.log(e));
  }, [order, search]);

  const handleDeleteQuestion = (id) => {
    setQlist(qlist.filter((q) => q._id !== id));
    setSelectedQuestions(selectedQuestions.filter((qId) => qId !== id));
  };

  const handleSelectQuestion = (id) => {
    if (selectedQuestions.includes(id)) {
      setSelectedQuestions(selectedQuestions.filter((qId) => qId !== id));
    } else {
      setSelectedQuestions([...selectedQuestions, id]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const promises = selectedQuestions.map(async (qid) => {
        await fetch(`http://localhost:8000/question/${qid}`, {
          method: "DELETE",
        });
      });
      await Promise.all(promises);
      const updatedQlist = qlist.filter(
        (q) => !selectedQuestions.includes(q._id)
      );
      setQlist(updatedQlist);
      setSelectedQuestions([]);
    } catch (error) {
      console.error("Error deleting selected questions:", error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <QuestionHeader
        title_text={title_text}
        qcnt={qlist.length}
        setQuestionOrder={setQuestionOrder}
        handleNewQuestion={handleNewQuestion}
      />

      <div className="space-y-4">
        {user?.isModerator && selectedQuestions.length > 0 && (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleDeleteSelected}
              className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              <Trash2 className="mr-2 h-5 w-5" />
              Delete Selected
            </button>
          </div>
        )}

        {qlist.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            {title_text === "Search Results"
              ? "No Questions Found"
              : "No questions available"}
          </div>
        ) : (
          <div className="space-y-4">
            {qlist.map((q, idx) => (
              <Question
                q={q}
                key={idx}
                clickTag={clickTag}
                handleAnswer={handleAnswer}
                onDelete={handleDeleteQuestion}
                onSelect={handleSelectQuestion}
                isSelected={selectedQuestions.includes(q._id)}
                isModerator={user?.isModerator}
              />
            ))}
          </div>
        )}
      </div>

      {user?.isModerator && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={handleNewQuestion}
            className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionPage;
