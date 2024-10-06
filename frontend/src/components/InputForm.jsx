import React, { useState } from "react";
import SingleEntryInput from "./SingleEntryInput";
const InputForm = ({ data, setData }) => {
    return (
        <div>
            {Object.keys(data).map((key) => (
                <div style={{ marginBottom: "10px" }}>
                    <SingleEntryInput
                        label={key}
                        initialValue={data[key]}
                        data={data}
                        setData={setData}
                        width={12}
                    />
                </div>
            ))}
        </div>
    );
};

export default InputForm;
