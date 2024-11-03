import "../styles/Button.css";
export default function Button({ text, handleClick, width }) {
  return (
    <button
      style={{ width: width }}
      className="submit-button"
      onClick={handleClick}
    >
      {text}
    </button> // Button component with a text label
  );
}
