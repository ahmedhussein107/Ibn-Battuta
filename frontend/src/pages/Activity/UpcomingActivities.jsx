import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import ObjectList from "../../components/ListOfObjects";
//import moment from 'moment';

export default function getUpcomingActivities() {
	const [activities, setActivities] = useState([]);
	const [categories, setCategories] = useState([""]);
	const [priceRange, setPriceRange] = useState({ min: "", max: "" });
	const [ratingRange, setRatingRange] = useState({ min: "", max: "" });
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [sortBy, setSortBy] = useState("");
	const [response, setResponse] = useState(null);

	useEffect(() => {
		axiosInstance
			.get(`/category/allCategories/`)
			.then((response) => {
				let categs = [];
				for (let category of response.data) {
					categs.push(category._id);
				}
				//console.log(categs);
				setCategories(categs);
				//console.log("categories", categories);
			})
			.catch((error) => {
				console.error("Error fetching Categories:", error);
			});
	}, []);

	useEffect(() => {
		axiosInstance
			.get(`/activity/getUpcomingActivities/`, { params: buildQuery() })
			.then((response) => {
				// const {
				// 	_id,
				// 	__v,
				// 	createdAt,
				// 	updatedAt,
				// 	document,
				// 	notifications,
				// 	isAccepted,
				// 	...seller
				// } = response.data;
				console.log(response.data);
				setActivities(response.data);
				//console.log("seller:", seller);
			})
			.catch((error) => {
				console.error("Error fetching Activities:", error);
			});
	}, [selectedCategory, priceRange, ratingRange, startDate, endDate]);

	useEffect(() => {
		if (sortBy === "priceAsc") {
			activities.sort((a, b) => a.price - b.price);
		} else if (sortBy === "priceDesc") {
			activities.sort((a, b) => b.price - a.price);
		} else if (sortBy === "ratingAsc") {
			activities.sort((a, b) => a.rating - b.rating);
		} else if (sortBy === "ratingDesc") {
			activities.sort((a, b) => b.rating - a.rating);
		}
		console.log("activities: ", activities);
	}, [sortBy]);

	const handleClick = () => {
		axiosInstance
			.patch(`/seller/updateSeller/${sellerId}`, seller)
			.then((response) => {
				setResponse("Profile updated successfully!");
			})
			.catch((error) => {
				setResponse("Profile update failed!");
			});
	};

	const handleMinPriceChange = (e) => {
		setPriceRange({ ...priceRange, min: e.target.value });
		console.log(priceRange);
	};

	const handleMaxPriceChange = (e) => {
		setPriceRange({ ...priceRange, max: e.target.value });
		console.log(priceRange);
	};

	const handleMinRatingChange = (e) => {
		setRatingRange({ ...ratingRange, min: e.target.value });
		console.log(ratingRange);
	};

	const handleMaxRatingChange = (e) => {
		setRatingRange({ ...ratingRange, max: e.target.value });
		console.log(ratingRange);
	};

	const handleStartDateChange = (date) => {
		try {
			setStartDate(date.toISOString());
		} catch (e) {
			setStartDate("");
		}
	};

	const handleEndDateChange = (date) => {
		try {
			setEndDate(date.toISOString());
		} catch (e) {
			setEndDate("");
		}
		console.log(endDate);
	};

	const handleCategoryChange = (e) => {
		setSelectedCategory(e.target.value);
		console.log(selectedCategory);
	};

	const buildQuery = () => {
		let query = {};

		if (selectedCategory) {
			query.category = selectedCategory;
		} else {
			delete query.category;
		}

		if (priceRange.min || priceRange.max) {
			query.price = priceRange.min + "-" + priceRange.max;
		} else {
			delete query.price;
		}

		if (ratingRange.min || ratingRange.max) {
			query.rating = ratingRange.min + "-" + ratingRange.max;
		} else {
			delete query.rating;
		}

		if (startDate || endDate) {
			query.startDate = startDate + "~" + endDate;
		} else {
			delete query.startDate;
		}

		return query;
	};

	const chooseFields = (activities) => {
		return activities.map((activity) => {
			const {
				isFlagged,
				sumOfRatings,
				ratings,
				advertiserID,
				createdAt,
				updatedAt,
				__v,
				_id,
				id,
				...rest
			} = activity;
			return { Advertiser: advertiserID.name, ...rest };
		});
	};

	return (
		<div>
			<h1>Upcoming Activities</h1>
			{/* Price range filter */}
			<div>
				<label>Price Range:</label>
				<input
					type="number"
					placeholder="Min"
					value={priceRange.min}
					onChange={handleMinPriceChange}
				/>
				<input
					type="number"
					placeholder="Max"
					value={priceRange.max}
					onChange={handleMaxPriceChange}
				/>
			</div>

			{/* Rating range filter */}
			<div>
				<label>Rating Range:</label>
				<input
					type="number"
					placeholder="Min"
					value={ratingRange.min}
					onChange={handleMinRatingChange}
				/>
				<input
					type="number"
					placeholder="Max"
					value={ratingRange.max}
					onChange={handleMaxRatingChange}
				/>
			</div>

			{/* Date range filter */}
			<div>
				<label>Select Date Range:</label>
				<Datetime
					value={startDate}
					onChange={handleStartDateChange}
					inputProps={{ placeholder: "From" }}
				/>
				<Datetime
					value={endDate}
					onChange={handleEndDateChange}
					inputProps={{ placeholder: "To" }}
				/>
			</div>

			{/* Category dropdown filter */}
			<div>
				<label>Category:</label>
				<select value={selectedCategory} onChange={handleCategoryChange}>
					<option value="">All Categories</option>
					{categories.map((category) => (
						<option key={category} value={category}>
							{category}
						</option>
					))}
				</select>
			</div>

			{/* Sorting options */}
			<div>
				<label>Sort By:</label>
				<select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
					<option value="">No Sorting</option>
					<option value="priceAsc">Price (Low to High)</option>
					<option value="priceDesc">Price (High to Low)</option>
					<option value="ratingAsc">Rating (Low to High)</option>
					<option value="ratingDesc">Rating (High to Low)</option>
				</select>
			</div>

			<hr />

			<ObjectList data={chooseFields(activities)} />

			{response && <p>{response}</p>}
		</div>
	);
}
