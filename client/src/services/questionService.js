import { REACT_APP_API_URL, api } from "./config";

const QUESTION_API_URL = `${REACT_APP_API_URL}/question`;

// To get Questions by Filter
const getQuestionsByFilter = async (order = "newest", search = "") => {
  const res = await api.get(
    `${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}`
  );

  return res.data;
};

// To get Questions by id
const getQuestionById = async (qid, uid) => {
  const res = await api.get(
    `${QUESTION_API_URL}/getQuestionById/${qid}/${uid}`
  );
  //   const res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}`);
  //   const res = await fetch(`${QUESTION_API_URL}/getQuestionById/${qid}`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ userId: uid }),
  //   });
  //   const data = await res.json();
  return res.data;
};

// To add Questions
const addQuestion = async (q) => {
  const res = await api.post(`${QUESTION_API_URL}/addQuestion`, q);

  return res.data;
};

export { getQuestionsByFilter, getQuestionById, addQuestion };
