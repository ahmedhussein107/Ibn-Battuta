import FileInput from "./FileInput";
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
    termsAccepted,
    handleTermsChange,
}) => {
    return (
        <>
            <h3 style={{ textAlign: "center" }}>
                Please upload Your ID and Certificates below
            </h3>
            <FileInput
                label="Select ID file:"
                onChange={handleFileChange1}
                onDelete={handleDeleteFile1}
                file={file1}
                inputRef={fileInput1Ref}
            />

            <FileInput
                label="Select certificate file(s):"
                onChange={handleFileChange2}
                onDelete={handleDeleteFile2}
                file={file2.length > 0}
                inputRef={fileInput2Ref}
                multiple={true}
            />
            <div className="checkbox-container">
                <div className="checkbox-group">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={termsAccepted}
                        onChange={handleTermsChange}
                    />
                    <label htmlFor="terms">
                        I accept the
                        <a href="https://google.com"> terms </a>
                        and
                        <a href="https://google.com"> conditions </a>
                    </label>
                </div>
            </div>
        </>
    );
};

export default Page2;
