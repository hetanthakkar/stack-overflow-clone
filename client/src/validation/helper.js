import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";

/**
 * Authenticate user
 * @param {*} username
 * @returns
 */
export async function authenticate(username) {
  try {
    return await axios.post("/api/authenticate", { username });
  } catch (error) {
    console.log("error is");
    return { error: "Username does not exist" };
  }
}

/**
 * Get user
 * @param {*} param0
 * @returns
 */
export async function getUser(username) {
  try {
    // Get the token from localStorage
    const userData = JSON.parse(localStorage.getItem("user")); // Parse the stored JSON string
    const token = userData?.token; // Safely retrieve the token

    // Check if the token exists
    if (!token) {
      throw new Error("No token found in localStorage");
    }

    // Make the API request with the Authorization header
    const { data } = await axios.get(`/api/user/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
      },
    });

    return { data };
  } catch (error) {
    console.error("Error in getUser:", error);
    return { error: "Password does not match or token is invalid" };
  }
}
/**
 * Register User function
 */
export async function registerUser(credentials) {
  try {
    const { data } = await axios.post("/api/register", credentials);
    if (data.msg == "User Registered Successfully") {
      login(credentials.username, credentials.password);
    }
    return data.msg;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

export async function getLocalUser() {
  try {
    const user = localStorage.getItem("user");
    return JSON.parse(user);
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

/**
 * Login
 * @param {*} param0
 * @returns
 */
export async function login(username, password) {
  try {
    if (username) {
      console.log("Heu");
      const response = await axios.post("/api/login", { username, password });
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
      // return Promise.resolve({ data });
    }
  } catch (error) {
    return Promise.reject({ error: "Password doesn't Match...!" });
  }
}
export async function logout(username) {
  const response = await axios.post("/api/logout", { username });
  console.log("response is", response);
  localStorage.removeItem("user");
}
/**Update User Profile */
export async function updateUser(response) {
  try {
    const user = await localStorage.getItem("user");
    console.log("object", JSON.parse(user).token);

    const data = await axios.put("/api/updateUser", response, {
      headers: { Authorization: `Bearer ${JSON.parse(user).token}` },
    });
    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't Update Profile" });
  }
}

/**
 * generate OTP
 */
export async function generateOTP(username) {
  try {
    const {
      data: { code },
      status,
    } = await axios.get("api/generateOTP", { params: { username } });
    if (status === 201) {
      let {
        data: { email },
      } = await getUser({ username });
      let text = `Your Password Recovery OTP is ${code}. Verify and Recover your Password...!`;
      await axios.post("api/registerMail", {
        username,
        userEmail: email,
        text,
        subject: "Password Recovery OTP",
      });
    }
    return Promise.resolve(code);
  } catch (error) {
    return Promise.reject({ error });
  }
}

/**
 * VerifyOTP
 */
export async function verifyOTP({ username, code }) {
  try {
    const { data, status } = await axios.get("/api/verifyOTP", {
      params: { username, code },
    });
    return { data, status };
  } catch (error) {
    return Promise.reject({ error: "Username does not exist" });
  }
}

/**
 * Reset Password
 */
export async function resetPassword({ username, password }) {
  try {
    const { data, status } = await axios.put("/api/resetPassword", {
      username,
      password,
    });
    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({ error });
  }
}
/**
 * Upvote a question
 * @param {string} qid - Question ID
 * @returns {Promise<AxiosResponse>}
 */
export async function upvoteQuestion(qid) {
  try {
    const response = await axios.put(`/question/${qid}/vote`);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Downvote a question
 * @param {string} qid - Question ID
 * @returns {Promise<AxiosResponse>}
 */
export async function downvoteQuestion(qid) {
  try {
    const response = await axios.put(`/api/question/${qid}/downvote`);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Upvote an answer
 * @param {string} aid - Answer ID
 * @returns {Promise<AxiosResponse>}
 */
export async function upvoteAnswer(aid) {
  try {
    const response = await axios.put(`/api/answers/${aid}/upvote`);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Downvote an answer
 * @param {string} aid - Answer ID
 * @returns {Promise<AxiosResponse>}
 */
export async function downvoteAnswer(aid) {
  try {
    const response = await axios.put(`/api/answers/${aid}/downvote`);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Upvote a comment
 * @param {string} cid - Comment ID
 * @returns {Promise<AxiosResponse>}
 */
export async function upvoteComment(cid) {
  try {
    const response = await axios.put(`/api/comments/${cid}/upvote`);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Downvote a comment
 * @param {string} cid - Comment ID
 * @returns {Promise<AxiosResponse>}
 */
export async function downvoteComment(cid) {
  try {
    const response = await axios.put(`/api/comments/${cid}/downvote`);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Add a comment to an answer
 * @param {string} aid - Answer ID
 * @param {string} text - Comment text
 * @param {string} posted_by - Posted by
 * @returns {Promise<AxiosResponse>}
 */
export async function addCommentToAnswer(aid, text, posted_by) {
  try {
    const response = await axios.post(`/api/answers/${aid}/comments`, {
      text,
      posted_by,
    });
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Delete a comment from an answer
 * @param {string} aid - Answer ID
 * @param {string} cid - Comment ID
 * @returns {Promise<AxiosResponse>}
 */
export async function deleteCommentFromAnswer(aid, cid) {
  try {
    const response = await axios.delete(`/answer/${aid}/comments/${cid}`);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Add a comment to a question
 * @param {string} qid - Question ID
 * @param {string} text - Comment text
 * @param {string} posted_by - Posted by
 * @returns {Promise<AxiosResponse>}
 */
export async function addCommentToQuestion(qid, text, posted_by) {
  try {
    const response = await axios.post(`/api/question/${qid}/comments`, {
      text,
      posted_by,
    });
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Delete a comment from a question
 * @param {string} qid - Question ID
 * @param {string} cid - Comment ID
 * @returns {Promise<AxiosResponse>}
 */
export async function deleteCommentFromQuestion(qid, cid) {
  try {
    const response = await axios.delete(`/question/${qid}/comments/${cid}`);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function deleteQuestion(qid, cid) {
  try {
    const response = await axios.delete(`/question/${qid}`);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function deleteAnswer(qid, id) {
  try {
    const response = await axios.delete(`/answer/${qid}/${id}`);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}
