import "./index.css";

const Input = ({
  title,
  hint,
  id,
  mandatory = true,
  val,
  setState,
  err,
  editable = true,
}) => {
  return (
    <>
      <div className="input_title">
        {title}
        {mandatory ? "*" : ""}
      </div>
      {hint && <div className="input_hint">{hint}</div>}
      <input
        readOnly={!editable}
        id={id}
        className="input_input"
        type="text"
        value={val}
        onInput={(e) => {
          setState(e.target.value);
        }}
      />
      {err && <div className="input_error">{err}</div>}
    </>
  );
};

export default Input;
