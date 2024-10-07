import React, { useState } from "react";
import SingleEntryInput from "./SingleEntryInput";
import SingleEntry from "./SingleEntry";
const InputForm = ({ data, setData, input }) => {
    return (
        <div>
            {Object.keys(data).map((key) => (
                <div style={{ marginBottom: "2vh" }}>
                    {input && (
                        <SingleEntryInput
                            label={key}
                            initialValue={data[key]}
                            data={data}
                            setData={setData}
                            width={12}
                        />
                    )}
                    {!input && (
                        <SingleEntry
                            label={key}
                            initialValue={data[key]}
                            data={data}
                            setData={setData}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default InputForm;
