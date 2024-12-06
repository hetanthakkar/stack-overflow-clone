import React, { useState, useEffect } from "react";
import "./index.css";
import SideBarNav from "./sideBarNav";
import QuestionPage from "./questionPage";
import TagPage from "./tagPage";
import AnswerPage from "./answerPage";
import NewQuestion from "./newQuestion";
import NewAnswer from "./newAnswer";
import UserProfile from "./profilePage";
import ActivityDashboard from "./activityDashboard";
import { useNavigate } from "react-router-dom";

const Main = ({
  search = "",
  title,
  setQuesitonPage,
  profile,
  setProfile,
  tagName,
  qid,
  currentPath,
}) => {
  const [page, setPage] = useState("home");
  const [questionOrder, setQuestionOrder] = useState("newest");
  const navigate = useNavigate();
  useEffect(() => {
    if (qid) {
      setPage("answer");
    } else if (profile) {
      setPage("profile");
    } else if (currentPath === "/tags") {
      setPage("tag");
    } else if (currentPath === "/activity") {
      setPage("activityDashboard");
    } else {
      setPage("home");
    }
  }, [profile, qid, currentPath]);

  const navigateToPage = (newPage, resetProfile = true) => {
    if (resetProfile) setProfile(false);
    switch (newPage) {
      case "home":
        console.log("AYA AVYO");
        setQuesitonPage("", "All Questions");
        break;
      case "tag":
        // Navigate to tags page without setting a specific tag
        navigate("/tags");
        setPage("tag");
        break;
      default:
        setPage(newPage);
    }
  };
  const handleQuestionNavigation = (questionId) => {
    setQuesitonPage("", "Question Details", questionId);
    setPage("answer");
  };

  const handleAnswerNavigation = (qid) => {
    handleQuestionNavigation(qid);
    setPage("answer");
  };

  const handleQuestions = () => {
    navigateToPage("home");
  };

  const handleTags = () => {
    navigateToPage("tag");
  };

  const renderQuestionPage = () => (
    <QuestionPage
      title_text={title}
      order={questionOrder}
      search={search}
      setQuestionOrder={setQuestionOrder}
      clickTag={(tagName) => {
        setQuesitonPage(`[${tagName}]`, tagName);
        navigateToPage("home");
      }}
      handleAnswer={handleQuestionNavigation}
      handleNewQuestion={() => navigateToPage("newQuestion")}
    />
  );

  const getPageContent = () => {
    const pageMap = {
      home: renderQuestionPage,
      tag: () => (
        <TagPage
          clickTag={(tagName) => {
            setQuesitonPage(`[${tagName}]`, tagName);
          }}
          handleNewQuestion={() => navigateToPage("newQuestion")}
        />
      ),
      profile: () => <UserProfile />,
      answer: () => (
        <AnswerPage
          qid={qid}
          handleNewQuestion={() => navigateToPage("newQuestion")}
          handleNewAnswer={() => navigateToPage("newAnswer")}
        />
      ),
      newQuestion: () => {
        console.log("HEY MR");
        return (
          <NewQuestion
            handleQuestions={() => {
              setPage("home");
              navigateToPage("home");
            }}
          />
        );
      },
      newAnswer: () => (
        <NewAnswer qid={qid} handleAnswer={handleAnswerNavigation} />
      ),
      activityDashboard: () => <ActivityDashboard />,
    };

    return (pageMap[page] || renderQuestionPage)();
  };

  const selectedPage =
    {
      home: "q",
      tag: "t",
      profile: "p",
      activityDashboard: "a",
    }[page] || "q";

  const handleActivity = async () => {
    await navigate("/activity");
    await setPage("activityDashboard");
  };
  return (
    <div id="main" className="main">
      <SideBarNav
        selected={selectedPage}
        handleQuestions={handleQuestions}
        handleTags={handleTags}
        handleActivity={handleActivity}
      />
      <div id="right_main" className="right_main">
        {getPageContent()}
      </div>
    </div>
  );
};

export default Main;
