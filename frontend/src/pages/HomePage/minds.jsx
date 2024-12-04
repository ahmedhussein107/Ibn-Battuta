import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import i1 from "../../assets/homepage/mapE.jpg";

const Minds = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const questions = [
        {
            question: "How does the app work?",
            answer: "The app simplifies trip planning by letting you choose destinations and customize activities.",
        },
        {
            question: "Can I book flights and hotels?",
            answer: "Yes, you can book both flights and hotels directly from the app.",
        },
        {
            question: "What if I need help?",
            answer: "Our support team is available 24/7 to assist you.",
        },
        {
            question: "Are there any hidden fees?",
            answer: "No, we believe in transparency. What you see is what you pay.",
        },
        {
            question: "Can I customize my trip?",
            answer: "Absolutely! You can customize every aspect of your trip.",
        },
        {
            question: "Is the app free to use?",
            answer: "Yes, the app is free to download and use. Some advanced features may require a subscription.",
        },
    ];

    const toggleQuestion = (index) => {
        setOpenIndex(openIndex === index ? null : index); // Toggle or close
    };

    return (
        <div
            style={{
                position: "relative",
                width: "98vw",
                margin: "0 auto",
            }}
        >
            <h2
                style={{
                    fontSize: "2.5rem",
                    color: "#A0522D",
                    fontWeight: "bold",
                    fontFamily: "serif",
                    textAlign: "center",
                    zIndex: 2,
                    position: "absolute",
                    width: "100%",
                    userSelect: "none",
                    marginTop: "-7vh",
                }}
            >
                Curious Minds
            </h2>

            <img
                src={i1}
                alt="Map Background"
                style={{
                    width: "98vw",
                    height: "80vh",
                    pointerEvents: "none",
                    userSelect: "none",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    top: "12vh",
                    left: "2%",
                    right: "5%",
                    borderRadius: "10px",
                    padding: "40px",
                    justifyContent: "center",
                }}
            >
                {questions.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            marginBottom: "10px",
                            background: "#fff",
                            padding: "17px 23px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                            overflow: "hidden",
                            transition: "height 0.3s ease",
                        }}
                        onClick={() => toggleQuestion(index)}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <summary
                                style={{
                                    fontSize: "1.5rem",
                                    color: "#A0522D",
                                    outline: "none",
                                    userSelect: "none",
                                    listStyle: "none",
                                    cursor: "pointer",
                                    margin: 0,
                                }}
                            >
                                {item.question}
                            </summary>
                            {openIndex === index ? (
                                <FaChevronUp
                                    style={{ fontSize: "1.2rem", color: "#A0522D" }}
                                />
                            ) : (
                                <FaChevronDown
                                    style={{ fontSize: "1.2rem", color: "#A0522D" }}
                                />
                            )}
                        </div>
                        <div
                            style={{
                                maxHeight: openIndex === index ? "200px" : "0",
                                overflow: "hidden",
                                transition: "max-height 0.5s ease",
                            }}
                        >
                            <p
                                style={{
                                    marginTop: "10px",
                                    fontSize: "1rem",
                                    color: "#555",
                                    padding: openIndex === index ? "10px 0" : "0",
                                    opacity: openIndex === index ? 1 : 0,
                                    transition: "opacity 0.5s ease",
                                }}
                            >
                                {item.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Minds;
