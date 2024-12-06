import { useEffect, useState } from "react";
import { AlertCircle, Save, X } from "lucide-react"; // Import X icon
import { validateHyperlink } from "../../../tool";
import { addQuestion } from "../../../services/questionService";
import { getLocalUser } from "../../../validation/helper";
import { useNavigate } from "react-router-dom";

const NewQuestion = ({ handleQuestions }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tag, setTag] = useState("");
  const [usrn, setUsrn] = useState("");

  const [titleErr, setTitleErr] = useState("");
  const [textErr, setTextErr] = useState("");
  const [tagErr, setTagErr] = useState("");
  const [usrnErr, setUsrnErr] = useState("");

  const navigate = useNavigate(); // To navigate back to the questions page

  useEffect(() => {
    const fetchData = async () => {
      let user = await getLocalUser();
      setUsrn(user?.username);
    };
    fetchData().catch((e) => console.log(e));
  }, []);

  const postQuestion = async (e) => {
    e.preventDefault();
    let isValid = true;

    // Validation logic
    if (!title) {
      setTitleErr("Title cannot be empty");
      isValid = false;
    } else if (title.length > 100) {
      setTitleErr("Title cannot be more than 100 characters");
      isValid = false;
    } else {
      setTitleErr("");
    }

    if (!text) {
      setTextErr("Question text cannot be empty");
      isValid = false;
    } else if (!validateHyperlink(text)) {
      setTextErr("Invalid hyperlink format.");
      isValid = false;
    } else {
      setTextErr("");
    }

    let tags = tag.split(" ").filter((tag) => tag.trim() !== "");
    if (tags.length === 0) {
      setTagErr("Should have at least 1 tag");
      isValid = false;
    } else if (tags.length > 5) {
      setTagErr("Cannot have more than 5 tags");
      isValid = false;
    } else if (tags.some((tag) => tag.length > 20)) {
      setTagErr("Tag length cannot be more than 20 characters");
      isValid = false;
    } else {
      setTagErr("");
    }

    if (!usrn) {
      setUsrnErr("Username cannot be empty");
      isValid = false;
    } else {
      setUsrnErr("");
    }

    if (!isValid) return;

    // Question object
    const question = {
      title: title,
      text: text,
      tags: tags,
      asked_by: usrn,
      ask_date_time: new Date(),
    };

    const res = await addQuestion(question);
    if (res && res._id) {
      handleQuestions();
    }
  };

  const closeForm = () => {
    navigate("/questions"); // Navigate back to the list of questions
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-8 relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={closeForm}
        >
          <X size={24} />
        </button>

        <div className="flex items-center mb-6 text-gray-800">
          <AlertCircle className="text-blue-500 mr-3" />
          <h2 className="text-2xl font-bold">Ask a Question</h2>
        </div>

        <form onSubmit={postQuestion}>
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-gray-700 font-medium mb-2"
            >
              Question Title*
              <span className="text-gray-500 font-normal">
                {" "}
                (Limit 100 characters or less)
              </span>
            </label>
            <input
              type="text"
              id="title"
              className={`w-full border rounded-md px-4 py-3 ${
                titleErr ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring focus:ring-blue-500`}
              placeholder="Enter your question title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {titleErr && (
              <p className="text-red-500 text-sm mt-1">{titleErr}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="text"
              className="block text-gray-700 font-medium mb-2"
            >
              Question Text*
              <span className="text-gray-500 font-normal"> (Add details)</span>
            </label>
            <textarea
              id="text"
              rows={5}
              className={`w-full border rounded-md px-4 py-3 ${
                textErr ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring focus:ring-blue-500`}
              placeholder="Provide more details about your question"
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            {textErr && <p className="text-red-500 text-sm mt-1">{textErr}</p>}
          </div>

          <div className="mb-6">
            <label
              htmlFor="tags"
              className="block text-gray-700 font-medium mb-2"
            >
              Tags*
              <span className="text-gray-500 font-normal">
                {" "}
                (Add keywords separated by whitespace)
              </span>
            </label>
            <input
              type="text"
              id="tags"
              className={`w-full border rounded-md px-4 py-3 ${
                tagErr ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring focus:ring-blue-500`}
              placeholder="Enter your tags"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
            {tagErr && <p className="text-red-500 text-sm mt-1">{tagErr}</p>}
          </div>

          <div className="mb-6">
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium mb-2"
            >
              Username*
            </label>
            <input
              type="text"
              id="username"
              className={`w-full border rounded-md px-4 py-3 ${
                usrnErr ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring focus:ring-blue-500`}
              placeholder="Enter your username"
              value={usrn}
              disabled
            />
            {usrnErr && <p className="text-red-500 text-sm mt-1">{usrnErr}</p>}
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition-colors"
            >
              <Save className="mr-2" />
              Post Question
            </button>
            <p className="text-gray-500 text-sm">
              * indicates mandatory fields
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewQuestion;
