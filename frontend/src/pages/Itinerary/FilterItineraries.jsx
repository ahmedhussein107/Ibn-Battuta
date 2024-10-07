import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import ObjectList from "../../components/ListOfObjects";
//import moment from 'moment';

export default function getUpcomingitineraries() {
  const [itineraries, setitineraries] = useState([]);
  const [tags, settags] = useState([""]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [ratingRange, setRatingRange] = useState({ min: "", max: "" });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedtags, setSelectedtags] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(""); // Selected language filter
  const [languages, setLanguages] = useState([]); // Available languages filter

  const [response, setResponse] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/tag/allTags/`)
      .then((response) => {
        let categs = [];
        for (let tags of response.data) {
          categs.push(tags._id);
        }
        //console.log(categs);
        settags(categs);
        //console.log("tags", tags);
      })
      .catch((error) => {
        console.error("Error fetching tags:", error);
      });
  }, []);

  useEffect(() => {
    axiosInstance
      .get(`/itinerary/getAllItineraries/`)
      .then((response) => {
        const uniqueLanguages = Array.from(
          new Set(response.data.map((itinerary) => itinerary.language))
        );
        setLanguages(uniqueLanguages);
      })
      .catch((error) => {
        console.error("Error fetching tags:", error);
      });
  }, []);

  useEffect(() => {
    axiosInstance
      .get(`/itinerary/filterItineraries/`, { params: buildQuery() })
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
        setitineraries(response.data);
        //console.log("seller:", seller);
      })
      .catch((error) => {
        console.error("Error fetching itineraries:", error);
      });
  }, [
    selectedtags,
    priceRange,
    ratingRange,
    startDate,
    endDate,
    selectedLanguage,
  ]);

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

  const handleStartDateChange = (date) => {
    try {
      setStartDate(date.toISOString());
    } catch (e) {
      setStartDate("");
    }
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
  };

  const handleEndDateChange = (date) => {
    try {
      setEndDate(date.toISOString());
    } catch (e) {
      setEndDate("");
    }
    console.log(endDate);
  };

  const handletagsChange = (e) => {
    setSelectedtags(e.target.value);
    console.log(selectedtags);
  };

  const buildQuery = () => {
    let query = {};

    if (selectedtags) {
      query.tags = selectedtags;
    } else {
      delete query.tags;
    }

    if (priceRange.min || priceRange.max) {
      query.price = priceRange.min + "-" + priceRange.max;
    } else {
      delete query.price;
    }

    if (startDate || endDate) {
      query.availableDatesAndTimes = startDate + "~" + endDate;
    } else {
      delete query.availableDatesAndTimes;
    }
    console.log(selectedLanguage);
    if (selectedLanguage) {
      query.language = selectedLanguage;
    } else {
      delete query.language;
    }

    return query;
  };

  const chooseFields = (itineraries) => {
    return itineraries.map((activity) => {
      const {
        isFlagged,
        sumOfRatings,
        ratings,
        tourguideID,
        createdAt,
        updatedAt,
        __v,
        _id,
        id,
        rating,
        ...rest
      } = activity;
      return {
        TourGuide: tourguideID.name,
        ...rest,
        rating: rating != -1 ? rating : "not yet rated",
      };
    });
  };

  return (
    <div>
      <h1>Filter Itinerary</h1>
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

      {/* tags dropdown filter */}
      <div>
        <label>tags:</label>
        <select value={selectedtags} onChange={handletagsChange}>
          <option value="">All tags</option>
          {tags.map((tags) => (
            <option key={tags} value={tags}>
              {tags}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Language:</label>
        <select value={selectedLanguage} onChange={handleLanguageChange}>
          <option value="">All Languages</option>
          {languages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>

      <hr />

      <ObjectList data={chooseFields(itineraries)} />

      {response && <p>{response}</p>}
    </div>
  );
}
