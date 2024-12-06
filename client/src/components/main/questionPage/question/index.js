// import { useState } from "react";
import { getMetaData } from "../../../../tool";
import "./index.css";
const Question = ({
  q,
  clickTag,
  handleAnswer,
  onDelete,
  onSelect,
  isSelected,
  isModerator,
}) => {
  const handleCheckboxChange = () => {
    onSelect(q._id);
  };

  const handleDelete = () => {
    onDelete(q._id);
  };

  return (
    <div
      className="question right_padding"
      // onClick={() => {
      //   handleAnswer(q._id);
      // }}
    >
      <div className="postStats">
        <div>{q.answers.length || 0} answers</div>
        <div>{q?.views?.length || 0} views</div>
      </div>
      <div className="question_mid">
        <div
          className="postTitle"
          onClick={() => {
            handleAnswer(q._id);
          }}
        >
          {q.title}
        </div>
        <div className="question_tags">
          {q.tags.map((tag, idx) => (
            <button
              key={idx}
              className="question_tag_button"
              onClick={(e) => {
                e.stopPropagation();
                clickTag(tag.name);
              }}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
      <div className="lastActivity">
        <div className="question_author">{q.asked_by}</div>
        <div>&nbsp;</div>
        <div className="question_meta">
          {getMetaData(new Date(q.ask_date_time))}
        </div>
      </div>
      {isModerator && (
        <div className="question_actions">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
          />
        </div>
      )}
    </div>
  );
};

export default Question;
