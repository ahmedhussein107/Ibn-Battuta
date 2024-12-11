import React from "react";
import "./Page2.css";

const Page2 = ({
    handleDeleteFile1,
    handleDeleteFile2,
    handleFileChange1,
    handleFileChange2,
    file1,
    file2,
    fileInput1Ref,
    fileInput2Ref,
    isTourGuide,
}) => {
    // Helper to render file names and delete buttons
    const renderFileList = (files, handleDelete) => (
        <ul className="file-list">
            {files.map((file, index) => (
                <li key={index} className="file-item">
                    <span className="file-name">{file.name}</span>
                    <button className="delete-button" onClick={() => handleDelete(index)}>
                        ❌
                    </button>
                </li>
            ))}
        </ul>
    );

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <h3 style={{ textAlign: "center", marginBottom: "15px" }}>
                Please upload Your ID and{" "}
                {isTourGuide ? "Certificates" : "Taxation Registery"} below
            </h3>

            {/* ID File Upload */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <div className="file-input-container">
                    <h4>Select ID File:</h4>
                    <div
                        className="file-drop-zone"
                        onClick={() => fileInput1Ref.current.click()}
                    >
                        Drag and drop or click to upload ID file
                    </div>
                    <input
                        type="file"
                        ref={fileInput1Ref}
                        onChange={handleFileChange1}
                        style={{ display: "none" }}
                    />
                    {file1 && renderFileList([file1], handleDeleteFile1)}
                </div>

                {/* Certificates/Taxation Registry File Upload */}
                <div className="file-input-container">
                    <h4>
                        Select {isTourGuide ? "Certificates" : "Taxation Registry"}{" "}
                        File(s):
                    </h4>
                    <div
                        className="file-drop-zone"
                        onClick={() => fileInput2Ref.current.click()}
                    >
                        Drag and drop or click to upload files
                    </div>
                    <input
                        type="file"
                        ref={fileInput2Ref}
                        onChange={handleFileChange2}
                        style={{ display: "none" }}
                        multiple
                    />
                    {file2.length > 0 && renderFileList(file2, handleDeleteFile2)}
                </div>
            </div>
        </div>
    );
};

export default Page2;
