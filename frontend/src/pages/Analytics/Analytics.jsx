import React, { PureComponent } from "react";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import usePageHeader from "../../components/Header/UseHeaderPage";
import Button from "../../components/Button";
import DatePicker from "../../components/DatePicker";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import TextField from "@mui/material/TextField";
import {
    LineChart,
    BarChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Brush,
    AreaChart,
    Area,
    RadialBarChart,
    RadialBar,
    ResponsiveContainer,
} from "recharts";
import Select from "react-select";
import SearchField from "../../components/SearchField/SearchField";
import Cookies from "js-cookie";
import Footer from "../../components/Footer";

const tableHeadStyle = {
    padding: "10px",
    fontSize: "1.1rem",
    borderBottom: "2px solid var(--accent-color)",
    textAlign: "center",
};
const tableRowStyle = {
    color: "black",
    padding: "10px",
    fontSize: "1rem",
    textAlign: "center",
};
const _month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const customStyles = {
    control: (provided) => ({
        ...provided,
        padding: "0.5rem",
        borderRadius: "0.375rem",
        border: "1px solid var(--accent-color)",
        boxShadow: "none",
        backgroundColor: "white",
        fontSize: "0.875rem",
        cursor: "pointer",
        "&:hover": {
            borderColor: "#9ca3af",
        },
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: "white",
        borderRadius: "0.375rem",
        border: "1px solid #d1d5db",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    }),
    option: (provided, state) => ({
        ...provided,
        padding: "0.5rem 1rem",
        backgroundColor: state.isFocused ? "#f3f4f6" : "white",
        color: "black",
        cursor: "pointer",
        "&:active": {
            backgroundColor: "#e5e7eb",
        },
    }),
};

const groupDataByMonth = (data) => {
    const groupedData = {
        January: [
            { name: "number of tourists", value: 0, color: "brown" },

            { name: "number of sales", value: 0, color: "var(--accent-color)" },
        ],
    };

    console.log("to be groupd data", data);
    data.forEach((item) => {
        const { month, numberOfTourists, numberOfSales } = item;

        // Initialize the month if it doesn't exist in the groupedData
        if (!groupedData[month]) {
            groupedData[month] = [
                { name: "number of tourists", value: 0, color: "brown" },
                {
                    name: "number of sales",
                    value: 0,
                    color: "var(--accent-color)",
                },
            ];
        }

        // Aggregate values
        groupedData[month][0].value += numberOfTourists;
        groupedData[month][1].value += numberOfSales;
    });
    console.log("grouped data", groupedData);
    return groupedData;
};
const Controls = ({ initialTableData, currentTableData, setCurrentTableData }) => {
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [isAll, setIsAll] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [searchText, setSearchText] = useState(null);

    const options = _month.map((month, index) => ({
        value: month,
        label: month,
    }));
    const handleSearch = () => {
        if (searchText) {
            const filteredData = currentTableData.filter((item) =>
                item.name.toLowerCase().includes(searchText.toLowerCase())
            );
            setCurrentTableData(filteredData);
        } else {
            setCurrentTableData(initialTableData);
        }
    };

    useEffect(() => {
        handleSearch();
    }, [searchText]);

    useEffect(() => {
        if (selectedDate) {
            const filteredData = initialTableData.filter(
                (item) =>
                    new Date(item.date).toDateString() ===
                    new Date(selectedDate).toDateString()
            );
            setCurrentTableData(filteredData);
            setIsAll(false);
            setSelectedMonth(null);
        } else {
            setCurrentTableData(initialTableData);
        }
    }, [selectedDate]);

    useEffect(() => {
        console.log("in use effect of month");
        if (selectedMonth) {
            console.log(selectedMonth);
            const filteredData = initialTableData.filter((item) => {
                return item.month === selectedMonth;
            });
            setCurrentTableData(filteredData);
        } else {
            setCurrentTableData(initialTableData);
        }
    }, [selectedMonth]);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "2vh",
                marginTop: "2vh",
                alignContent: "center",
                marginRight: "2vw",
            }}
        >
            <div style={{ width: "10%", marginTop: "1vh", marginLeft: "2vw" }}>
                <Button
                    text="All"
                    width="100%"
                    height="5vh"
                    stylingMode={isAll ? "always-dark" : "always-light"}
                    handleClick={() => {
                        setIsAll(true);
                        setSelectedMonth("");
                    }}
                />
            </div>

            <div style={{ width: "15%", marginTop: "1.1vh" }}>
                <Select
                    options={options}
                    value={
                        selectedMonth
                            ? options.find((option) => option.value === selectedMonth)
                            : null
                    }
                    onChange={(selectedOption) => {
                        setSelectedMonth(selectedOption.value);
                        setIsAll(false);
                    }}
                    styles={customStyles}
                    placeholder="MM"
                    isSearchable={false}
                />
            </div>
            <DatePicker label="Select a date" setValue={setSelectedDate} />
            <div style={{ width: "30%" }}>
                <SearchField
                    placeholder={"search by name"}
                    searchText={searchText}
                    setSearchText={setSearchText}
                />
            </div>
        </div>
    );
};
const DrawTable = ({ data }) => {
    const [currentData, setCurrentData] = useState(data);

    const API =
        Cookies.get("userType") === "Advertiser"
            ? "Activity"
            : Cookies.get("userType") === "TourGuide"
            ? "Itinerary"
            : "Product";

    return (
        <div
            style={{
                width: "80%",
                color: "var(--accent-color)",
                border: "1px solid var(--accent-color)",
                borderRadius: "10px",
                marginBottom: "2vh",
            }}
        >
            <Controls
                initialTableData={data}
                currentTableData={currentData}
                setCurrentTableData={setCurrentData}
            />

            <div
                style={{
                    maxHeight: data.length > 5 ? "300px" : "none",
                    overflowY: data.length > 5 ? "auto" : "visible",
                    marginRight: "20px",
                }}
            >
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "separate",
                        borderSpacing: "0 10px",
                        margin: "10px",
                    }}
                >
                    <thead>
                        <tr>
                            <th style={tableHeadStyle}>{API}</th>
                            <th style={tableHeadStyle}>Date</th>
                            <th style={tableHeadStyle}>Month</th>
                            <th style={tableHeadStyle}>Total Revenue</th>
                            <th style={tableHeadStyle}>Number of Tourists</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, index) => (
                            <tr
                                key={index}
                                style={{
                                    marginBottom: "10px",
                                    backgroundColor:
                                        index % 2 === 0 ? "#f9f9f9" : "white",
                                }}
                            >
                                <td style={tableRowStyle}>{item.name}</td>
                                <td style={tableRowStyle}>{item.date}</td>
                                <td style={tableRowStyle}>{item.month}</td>
                                <td style={tableRowStyle}>{item.revenue}</td>
                                <td style={tableRowStyle}>{item.numberOfTourists}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const DrawAreaChart = ({ data }) => {
    return (
        <div
            style={{
                marginBottom: "20px",
                width: "80%",
                borderRadius: "10px",
                border: "1px solid var(--accent-color)",
                color: "var(--accent-color)",
            }}
        >
            <h2
                style={{
                    transform: "translateX(10vw)",
                    marginBottom: "1vh",
                    marginTop: "1vh",
                }}
            >
                Total Revenue Per Month
            </h2>
            <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="none" stroke="none" />

                    <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop
                                offset="0%"
                                stopColor="var(--accent-color)"
                                stopOpacity={1}
                            />
                            <stop
                                offset="100%"
                                stopColor="var(--accent-color)"
                                stopOpacity={0.3}
                            />
                        </linearGradient>
                    </defs>

                    <XAxis
                        dataKey="name"
                        // tickFormatter={(tick) =>
                        //     new Date(tick).toLocaleString("default", { month: "short" })
                        // }
                    />
                    <YAxis />
                    <Tooltip />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="var(--accent-color)"
                        fill="url(#colorGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

const DrawBarChart = ({ data, title }) => {
    return (
        <div
            style={{
                textAlign: "center",
                marginBottom: "20px",
                width: "100%",
                borderRadius: "10px",
                border: "1px solid var(--accent-color)",
                color: "var(--accent-color)",
            }}
        >
            <h2 style={{ marginTop: "1vh", marginBottom: "1vh" }}>{title}</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid
                        horizontal={true}
                        vertical={false}
                        strokeDasharray="3 3"
                    />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                        wrapperStyle={{
                            backgroundColor: "transparent", // Make tooltip background transparent
                        }}
                    />{" "}
                    <Bar dataKey="value" fill="var(--accent-color)" barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const ColorDot = ({ color }) => (
    <div
        style={{
            display: "inline-block",
            width: "1rem",
            height: "1rem",
            marginRight: "0.5rem",
            borderRadius: "9999px",
            backgroundColor: color,
        }}
    />
);

const DrawRadialBarChart = ({ data }) => {
    const [selectedMonth, setSelectedMonth] = useState(Object.keys(data)[0]);

    // Convert data for the selected month into recharts format
    const chartData = data[selectedMonth].map((item) => ({
        ...item,
        fill: item.color,
        name: item.name,
    }));

    const options = Object.keys(data).map((month) => ({
        value: month,
        label: month,
    }));

    const customStyles = {
        control: (provided) => ({
            ...provided,
            padding: "0.5rem",
            borderRadius: "0.375rem",
            border: "1px solid #d1d5db",
            boxShadow: "none",
            backgroundColor: "white",
            fontSize: "0.875rem",
            cursor: "pointer",
            "&:hover": {
                borderColor: "#9ca3af",
            },
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: "white",
            borderRadius: "0.375rem",
            border: "1px solid #d1d5db",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }),
        option: (provided, state) => ({
            ...provided,
            padding: "0.5rem 1rem",
            backgroundColor: state.isFocused ? "#f3f4f6" : "white",
            color: "black",
            cursor: "pointer",
            "&:active": {
                backgroundColor: "#e5e7eb",
            },
        }),
    };

    return (
        <div
            style={{
                width: "100%",
                maxWidth: "28rem",
                border: "1px solid var(--accent-color)",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "2rem",
                    color: "var(--accent-color)",
                }}
            >
                <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Sales Per Month</h2>
                <Select
                    options={options}
                    value={options.find((option) => option.value === selectedMonth)}
                    onChange={(selectedOption) => setSelectedMonth(selectedOption.value)}
                    styles={customStyles}
                    placeholder="Select a month"
                    isSearchable={false}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem",
                }}
            >
                <div style={{ width: "70%" }}>
                    <ResponsiveContainer width="100%" height={300}>
                        <RadialBarChart
                            cx="50%"
                            cy="50%"
                            innerRadius="20%"
                            outerRadius="90%"
                            data={chartData}
                            startAngle={90}
                            endAngle={-270}
                        >
                            <RadialBar
                                minAngle={15}
                                cornerRadius="50%"
                                label={{
                                    position: "insideStart",
                                    fill: "white",
                                }}
                                background
                                clockWise
                                dataKey="value"
                            />
                        </RadialBarChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ width: "30%", maxWidth: "200px" }}>
                    {chartData.map((entry) => (
                        <div
                            key={entry.name}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "8px",
                            }}
                        >
                            <ColorDot color={entry.color} />
                            <span style={{ marginLeft: "8px" }}>{entry.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const DrawTouristsPerMonth = ({ data }) => {
    if (!data || data.length === 0) {
        return null;
    }

    const maxTourists = Math.max(...data.map((item) => item.tourists));
    const sumOfTourists = data.reduce((total, item) => total + item.tourists, 0);

    return (
        <div
            style={{
                width: "100%",
                color: "var(--accent-color)",
                border: "1px solid var(--accent-color)",
                borderRadius: "10px",
                padding: "2vw",
            }}
        >
            <h2>Registered Tourists : {sumOfTourists} </h2>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                Number of Tourists per Month
            </h2>

            <div
                style={{
                    maxHeight: data.length > 5 ? "300px" : "none",
                    overflowY: data.length > 5 ? "auto" : "visible",
                }}
            >
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "separate",
                        borderSpacing: "0 10px",
                    }}
                >
                    <thead>
                        <tr>
                            <th
                                style={{
                                    textAlign: "left",
                                    padding: "10px",
                                    fontSize: "1.1rem",
                                    borderBottom: "2px solid var(--accent-color)",
                                }}
                            >
                                #
                            </th>
                            <th
                                style={{
                                    textAlign: "left",
                                    padding: "10px",
                                    fontSize: "1.1rem",
                                    borderBottom: "2px solid var(--accent-color)",
                                }}
                            >
                                Month
                            </th>
                            <th
                                style={{
                                    textAlign: "left",
                                    padding: "10px",
                                    fontSize: "1.1rem",
                                    borderBottom: "2px solid var(--accent-color)",
                                }}
                            >
                                Number of Tourists
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr
                                key={index}
                                style={{
                                    marginBottom: "10px",
                                    backgroundColor:
                                        index % 2 === 0 ? "#f9f9f9" : "white",
                                }}
                            >
                                <td
                                    style={{
                                        color: "black",
                                        padding: "10px",
                                        fontSize: "1rem",
                                    }}
                                >
                                    {index + 1}
                                </td>
                                <td
                                    style={{
                                        color: "black",
                                        padding: "10px",
                                        fontSize: "1rem",
                                    }}
                                >
                                    {item.month}
                                </td>
                                <td style={{ padding: "10px" }}>
                                    <div
                                        className="bar"
                                        style={{
                                            width: `${
                                                (item.tourists / maxTourists) * 100
                                            }%`,
                                            backgroundColor:
                                                index === 0
                                                    ? "#FFA500"
                                                    : index === 1
                                                    ? "#87CEEB"
                                                    : index === 2
                                                    ? "#87CEEB"
                                                    : "#DCDCDC",
                                            padding: "5px",
                                            borderRadius: "5px",
                                            fontSize: "1rem",
                                            color: "black",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {item.tourists}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const Analytics = () => {
    usePageHeader("/analytics.png", "Analytics");

    const [data, setData] = useState([]);
    const [touristData, setTouristData] = useState([]);
    const [monthData, setMonthData] = useState([]);
    const [revenuePerThing, setRevenuePerThing] = useState([]);
    const [touristPerThing, setTouristPerThing] = useState([]);
    const [activityRevenue, setActivityRevenue] = useState(0);
    const [itineraryRevenue, setItineraryRevenue] = useState(0);
    const [radial, setRadial] = useState({
        January: [
            { name: "number of tourists", value: 0, color: "brown" },

            { name: "number of sales", value: 0, color: "var(--accent-color)" },
        ],
    });
    useEffect(() => {
        console.log("i am here");
        axiosInstance
            .get("/analytics/getAnalytics", { withCredentials: true })
            .then((res) => {
                setTouristData(res.data.touristData ? res.data.touristData : []);
                console.log("result is :", res);
                const updatedData = res.data.data.map((item) => {
                    const month = new Date(item.date).getMonth();
                    return {
                        ...item,
                        month: _month[month],
                    };
                });
                if (res.data.itineraryRevenue)
                    setItineraryRevenue(res.data.itineraryRevenue);
                if (res.data.activityRevenue)
                    setActivityRevenue(res.data.activityRevenue);
                setData(updatedData);
                // to get the total revenue per month
                setMonthData(
                    Object.entries(
                        updatedData.reduce((acc, item) => {
                            if (!acc[item.month]) {
                                acc[item.month] = 0;
                            }
                            acc[item.month] += item.revenue;
                            return acc;
                        }, {})
                    ).map(([name, value]) => ({ name, value }))
                );
                setRevenuePerThing(
                    Object.entries(
                        updatedData.reduce((acc, item) => {
                            if (!acc[item.name]) {
                                acc[item.name] = 0;
                            }
                            acc[item.name] += item.revenue;
                            return acc;
                        }, {})
                    ).map(([name, value]) => ({ name, value }))
                );
                setTouristPerThing(
                    Object.entries(
                        updatedData.reduce((acc, item) => {
                            if (!acc[item.name]) {
                                acc[item.name] = 0;
                            }
                            acc[item.name] += item.numberOfTourists;
                            return acc;
                        }, {})
                    ).map(([name, value]) => ({ name, value }))
                );
                setRadial(groupDataByMonth(updatedData));
            });
    }, []);
    return (
        <div
            style={{
                marginTop: "40vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
            }}
        >
            <DrawTable data={data} />
            <DrawAreaChart data={monthData} />

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    gap: "2vw",
                    width: "80%",
                }}
            >
                <DrawBarChart
                    data={revenuePerThing}
                    title={`Total Revenue Per ${
                        Cookies.get("userType") === "Advertiser"
                            ? "Activity"
                            : Cookies.get("userType") === "TourGuide"
                            ? "Itinerary"
                            : "Product"
                    }`}
                />
                <DrawBarChart
                    data={touristPerThing}
                    title={`Total Tourists Per ${
                        Cookies.get("userType") === "Advertiser"
                            ? "Activity"
                            : Cookies.get("userType") === "TourGuide"
                            ? "Itinerary"
                            : "Product"
                    }`}
                />
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    width: "80%",
                    gap: "4vw",
                }}
            >
                {Cookies.get("userType") === "Admin" && (
                    <DrawTouristsPerMonth data={touristData} />
                )}

                <DrawRadialBarChart data={radial} title="Total Revenue Per Month" />
            </div>
            {Cookies.get("userType") === "Admin" && (
                <div
                    style={{
                        border: "1px solid var(--accent-color)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "80%",
                        borderRadius: "10px",
                        color: "fontVariant(--accent-color)",
                        textAlign: "center",
                        margin: "2vmin",
                    }}
                >
                    <h3>
                        TotalRevenun from Activities: {activityRevenue} EGP,{"  "}{" "}
                    </h3>
                    <h3>TotalRevenun from Itineryary: {itineraryRevenue} EGP</h3>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default Analytics;
