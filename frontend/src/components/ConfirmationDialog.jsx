import React from "react";
import ReactDOM from "react-dom";

// Generic ConfirmationDialog component
const ConfirmationDialog = ({ message, onConfirm, onCancel, isOpen, styles }) => {
  // If `isOpen` is false, don't render the dialog
  if (!isOpen) return null;

  // Custom styles applied from the styles prop or default styles
  const defaultStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim background
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000, // Ensure it appears above other elements
    },
    dialog: {
      backgroundColor: "#ffffff",
      padding: "20px 40px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      maxWidth: "400px",
      textAlign: "center",
    },
    message: {
      fontSize: "18px",
      marginBottom: "20px",
    },
    buttons: {
      display: "flex",
      justifyContent: "space-around",
    },
    button: {
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "background-color 0.3s",
    },
    confirmButton: {
      backgroundColor: "#007bff",
      color: "#ffffff",
    },
    cancelButton: {
      backgroundColor: "#6c757d",
      color: "#ffffff",
    },
  };

  // Merge custom styles with default styles
  const mergedStyles = styles
    ? Object.assign({}, defaultStyles, styles)
    : defaultStyles;

  return ReactDOM.createPortal(
    <div style={mergedStyles.overlay}>
      <div style={mergedStyles.dialog}>
        <div style={mergedStyles.message}>{message}</div>
        <div style={mergedStyles.buttons}>
          <button
            style={{ ...mergedStyles.button, ...mergedStyles.confirmButton }}
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            style={{ ...mergedStyles.button, ...mergedStyles.cancelButton }}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root") // Make sure this div exists in your index.html
  );
};

export default ConfirmationDialog;
