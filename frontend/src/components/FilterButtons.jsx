const FilterButtons = ({
    buttons,
    selected,
    handleChooseType = () => {
        console.log("buttonclick handle needs to be fixed");
    },
    customStyle = {},
    fontSize = "1rem",
}) => {
    return (
        <div style={{ ...buttonGroupStyle, ...customStyle }}>
            {buttons.map((button) => (
                <button
                    key={button}
                    onClick={() => handleChooseType(button)}
                    style={
                        selected === button
                            ? { ...selectedButtonStyle, fontSize }
                            : { ...buttonStyle, fontSize }
                    }
                >
                    {button}
                </button>
            ))}
        </div>
    );
};

const buttonGroupStyle = {
    display: "flex",
    gap: "10px",
    marginLeft: "2%",
};

const buttonStyle = {
    padding: "10px 20px",
    border: "2px solid ",
    borderRadius: "40px",
    borderColor: "#9C4F21",
    backgroundColor: "transparent",
    color: "#9C4F21",
    cursor: "pointer",
    transition: "background-color 0.3s ease, color 0.3s ease",
};

const selectedButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#FAE2B6",
    color: "#9C4F21",
};

export default FilterButtons;
