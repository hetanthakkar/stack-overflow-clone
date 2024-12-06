import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Username from "../components/LoginComponents/Username";
import Password from "../components/LoginComponents/Password";
import Register from "../components/LoginComponents/Register";
import Profile from "../components/LoginComponents/Profile";
import PageNotFound from "../components/LoginComponents/PageNotFound";
import FakeStackOverflow from "../components/fakestackoverflow";
import PrivateRoute from "./PrivateRoute";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={<PrivateRoute Component={FakeStackOverflow} />}
        />
        <Route
          path="/questions"
          element={<PrivateRoute Component={FakeStackOverflow} />}
        />
        <Route
          path="/tags"
          element={<PrivateRoute Component={FakeStackOverflow} />}
        />
        <Route
          path="/tag/:tagName"
          element={<PrivateRoute Component={FakeStackOverflow} />}
        />
        <Route
          path="/activity"
          element={<PrivateRoute Component={FakeStackOverflow} />}
        />
        <Route
          path="/question/:qid"
          element={<PrivateRoute Component={FakeStackOverflow} />}
        />
        <Route path="/login" element={<Username />} />
        <Route path="/username" element={<Username />} />
        <Route path="/password" element={<Password />} />
        <Route path="/profile" element={<PrivateRoute Component={Profile} />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
