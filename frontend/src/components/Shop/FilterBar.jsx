import React from "react";
import SearchField from "../SearchField/SearchField";
import Sorter from "../Sorter";
import PriceRange from "../PriceRange";
import RatingRange from "../RatingRange";
import SideBar from "../SideBar/SideBar";

const FilterSidebar = ({
	name,
	setName,
	sortBy,
	setSortBy,
	priceRange,
	setPriceRange,
	ratingRange,
	setRatingRange,
	minPrice,
	maxPrice,
}) => {
	const nonCollapsibleItems = [
		<SearchField placeholder="product name" searchText={name} setSearchText={setName} />,
	];

	const titles = ["Sort By", "Price Range", "Rating Range"];

	const collapsibleItems = [
		<Sorter
			values={["priceAsc", "priceDesc", "ratingAsc", "ratingDesc"]}
			labels={[
				"Price (Low to High)",
				"Price (High to Low)",
				"Rating (Low to High)",
				"Rating (High to Low)",
			]}
			value={sortBy}
			setValue={setSortBy}
		/>,
		<PriceRange
			priceRange={priceRange}
			setPriceRange={setPriceRange}
			min={minPrice}
			max={maxPrice}
		/>,
		<RatingRange ratingRange={ratingRange} setRatingRange={setRatingRange} />,
	];

	return (
		<div style={{ width: "100%" }}>
			<SideBar
				collapsibleItems={collapsibleItems}
				nonCollapsibleItems={nonCollapsibleItems}
				titles={titles}
			/>
		</div>
	);
};

export default FilterSidebar;
