import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "./header";
import Main from "./main";

export default function FakeStackOverflow() {
  const [search, setSearch] = useState("");
  const [profile, setProfile] = useState(false);
  const [mainTitle, setMainTitle] = useState("All Questions");
  const { tagName, qid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle different routes
    switch (location.pathname) {
      case "/questions":
        setMainTitle("All Questions");
        setSearch("");
        break;
      case "/tags":
        setMainTitle("Tags");
        setSearch(""); // Optional: clear search when on tags page
        break;
      case "/activity":
        setMainTitle("Activity Dashboard");
        setSearch("");
        break;
      case "/":
        setMainTitle("All Questions");
        setSearch("");
        break;
      default:
        if (tagName) {
          setSearch(`[${tagName}]`);
          setMainTitle(tagName);
        }
        if (qid) {
          setMainTitle("Question Details");
        }
    }
  }, [location.pathname, tagName, qid]);
  const handleSetQuestionPage = (
    search = "",
    title = "All Questions",
    questionId = null
  ) => {
    setSearch(search);
    setMainTitle(title);
    setProfile(false);
    if (questionId) {
      navigate(`/question/${questionId}`);
    } else if (title !== "All Questions") {
      navigate(`/tag/${title}`);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <Header
        search={search}
        setQuesitonPage={handleSetQuestionPage}
        setProfile={setProfile}
      />
      <Main
        title={mainTitle}
        search={search}
        profile={profile}
        setProfile={setProfile}
        setQuesitonPage={handleSetQuestionPage}
        tagName={tagName}
        qid={qid}
        currentPath={location.pathname}
      />
    </>
  );
}
