import React from "react";
import { FaTrash } from "react-icons/fa";
import "./FileInput.css";
const FileInput = ({ label, onChange, onDelete, file, inputRef, multiple = false }) => {
    return (
        <div className="input-group">
            <label>{label}</label>
            <div className="file-input-wrapper">
                <input
                    type="file"
                    onChange={onChange}
                    ref={inputRef}
                    multiple={multiple}
                />
                {file && <FaTrash className="delete-icon" onClick={onDelete} />}
            </div>
        </div>
    );
};

export default FileInput;
