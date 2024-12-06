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

// Page Factory Class
class PageFactory {
  static createPage(type, props) {
    switch (type) {
      case "home":
        return {
          getContent: (props) => (
            <QuestionPage
              title_text={props.title_text}
              order={props.order}
              search={props.search}
              setQuestionOrder={props.setQuestionOrder}
              clickTag={props.clickTag}
              handleAnswer={props.handleAnswer}
              handleNewQuestion={props.handleNewQuestion}
            />
          ),
          getSelected: () => "q",
        };
      case "tag":
        return {
          getContent: (props) => (
            <TagPage
              clickTag={props.clickTag}
              handleNewQuestion={props.handleNewQuestion}
            />
          ),
          getSelected: () => "t",
        };
      case "profile":
        return {
          getContent: () => <UserProfile />,
          getSelected: () => "p",
        };
      case "answer":
        return {
          getContent: (props) => (
            <AnswerPage
              qid={props.qid}
              handleNewQuestion={props.handleNewQuestion}
              handleNewAnswer={props.handleNewAnswer}
            />
          ),
          getSelected: () => "q",
        };
      case "newQuestion":
        return {
          getContent: (props) => (
            <NewQuestion handleQuestions={props.handleQuestions} />
          ),
          getSelected: () => "q",
        };
      case "newAnswer":
        return {
          getContent: (props) => (
            <NewAnswer qid={props.qid} handleAnswer={props.handleAnswer} />
          ),
          getSelected: () => "q",
        };
      case "activityDashboard":
        return {
          getContent: () => <ActivityDashboard />,
          getSelected: () => "a",
        };
      default:
        throw new Error(`Invalid page type: ${type}`);
    }
  }
}

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
  const [currentPage, setCurrentPage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let newPage = "home";
    if (qid) {
      newPage = "answer";
    } else if (profile) {
      newPage = "profile";
    } else if (currentPath === "/tags") {
      newPage = "tag";
    } else if (currentPath === "/activity") {
      newPage = "activityDashboard";
    }

    setPage(newPage);
    setCurrentPage(PageFactory.createPage(newPage, {}));
  }, [profile, qid, currentPath]);

  const navigateToPage = (newPage, resetProfile = true) => {
    if (resetProfile) setProfile(false);
    switch (newPage) {
      case "home":
        setQuesitonPage("", "All Questions");
        break;
      case "tag":
        navigate("/tags");
        break;
    }

    setPage(newPage);
    setCurrentPage(PageFactory.createPage(newPage, {}));
  };

  const handleQuestionNavigation = (questionId) => {
    setQuesitonPage("", "Question Details", questionId);
    setPage("answer");
    setCurrentPage(PageFactory.createPage("answer", { qid: questionId }));
  };

  const handleAnswerNavigation = (qid) => {
    handleQuestionNavigation(qid);
  };

  const handleQuestions = () => {
    navigateToPage("home");
  };

  const handleTags = () => {
    navigateToPage("tag");
  };

  const handleActivity = async () => {
    await navigate("/activity");
    setPage("activityDashboard");
    setCurrentPage(PageFactory.createPage("activityDashboard", {}));
  };

  const pageProps = {
    title_text: title,
    order: questionOrder,
    search,
    qid,
    setQuestionOrder,
    clickTag: (tagName) => {
      setQuesitonPage(`[${tagName}]`, tagName);
    },
    handleAnswer: handleQuestionNavigation,
    handleNewQuestion: () => navigateToPage("newQuestion"),
    handleNewAnswer: () => navigateToPage("newAnswer", false),
    handleQuestions,
  };

  return (
    <div id="main" className="main">
      <SideBarNav
        selected={currentPage?.getSelected() || "q"}
        handleQuestions={handleQuestions}
        handleTags={handleTags}
        handleActivity={handleActivity}
      />
      <div id="right_main" className="right_main">
        {currentPage?.getContent(pageProps)}
      </div>
    </div>
  );
};

export default Main;
