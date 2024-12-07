import React, { PureComponent } from "react";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Brush,
    AreaChart,
    Area,
    ResponsiveContainer,
} from "recharts";

const DrawChart = ({ data }) => {
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

const Analytics = () => {
    const [data, setData] = useState([
        { name: "dfaf", value: 23 },
        { name: "dfaf", value: 231 },
        { name: "dfaf", value: 2243 },
        { name: "dfaf", value: 2343 },
        { name: "dfaf", value: 223 },
        { name: "dfaf", value: 223 },
    ]);

    return (
        <>
            <DrawChart data={data} />
        </>
    );
};

export default Analytics;
