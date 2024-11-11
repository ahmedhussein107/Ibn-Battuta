import React, { useEffect, useState } from "react";
import {useParams, useNavigate, useLocation} from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const UpdateProductPage = () => {
    const location = useLocation();
    const { product } = location.state;

};

export default UpdateProductPage;
