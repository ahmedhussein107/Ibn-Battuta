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
    isTourGuide,
}) => {
    return (
        <>
            <h3 style={{ textAlign: "center" }}>
                Please upload Your ID and{" "}
                {isTourGuide ? "Certificates" : "Taxation Registery"} below
            </h3>
            <FileInput
                label="Select ID file:"
                onChange={handleFileChange1}
                onDelete={handleDeleteFile1}
                file={file1}
                inputRef={fileInput1Ref}
            />

            <FileInput
                label={`Select ${
                    isTourGuide ? "Certificates" : "Taxation Registery"
                } file(s):`}
                onChange={handleFileChange2}
                onDelete={handleDeleteFile2}
                file={file2.length > 0}
                inputRef={fileInput2Ref}
                multiple={true}
            />
        </>
    );
};

export default Page2;
