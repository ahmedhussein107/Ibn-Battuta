import React, { PureComponent } from "react";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    AreaChart,
    Area,
    ResponsiveContainer,
} from "recharts";
import axiosInstance from "../../api/axiosInstance";

const Analytics = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axiosInstance.get("/analytics/getAnalytics").then((response) => {
            setData(response.data);
        });
    }, []);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default Analytics;
