const FilterButtons = ({
    buttons,
    selected,
    handleChooseType = () => {
        console.log("buttonclick handle needs to be fixed");
    },
    customStyle = {},
}) => {
    return (
        <div style={{ ...buttonGroupStyle, ...customStyle }}>
            {buttons.map((button) => (
                <button
                    key={button}
                    onClick={() => handleChooseType(button)}
                    style={selected === button ? selectedButtonStyle : buttonStyle}
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
    border: "2px solid #000",
    borderRadius: "20px",
    backgroundColor: "transparent",
    color: "#000",
    cursor: "pointer",
    transition: "background-color 0.3s ease, color 0.3s ease",
};

const selectedButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#FF5722",
    color: "#fff",
};

export default FilterButtons;
