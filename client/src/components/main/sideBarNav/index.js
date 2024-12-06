import "./index.css";

const SideBarNav = ({
  selected = "",
  handleQuestions,
  handleTags,
  handleActivity,
}) => {
  return (
    <div id="sideBarNav" className="sideBarNav">
      <div
        id="menu_question"
        className={`menu_button ${selected === "q" ? "menu_selected" : ""}`}
        onClick={() => {
          handleQuestions();
        }}
      >
        Questions
      </div>
      <div
        id="menu_tag"
        className={`menu_button ${selected === "t" ? "menu_selected" : ""}`}
        onClick={() => {
          handleTags();
        }}
      >
        Tags
      </div>
      <div
        id="menu_tag"
        className={`menu_button ${selected === "a" ? "menu_selected" : ""}`}
        onClick={() => {
          handleActivity();
        }}
      >
        Activity Dashboard
      </div>
    </div>
  );
};

export default SideBarNav;
