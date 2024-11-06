import React, { useState } from "react";
import { Paper, Autocomplete, TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ onClick, options }) => {
	const [searchValue, setSearchValue] = useState("");

	return (
		<Paper component="div" sx={styles.paper}>
			<IconButton onClick={onClick} sx={{ color: "#666666" }}>
				<SearchIcon sx={{ color: "#666666", fontSize: 30 }} />
			</IconButton>
			<Autocomplete
				freeSolo
				value={searchValue}
				onChange={(event, newValue) => {
					setSearchValue(newValue);
				}}
				options={options ? options : []}
				sx={{
					flex: 1,
					mr: 1,
					"& .MuiOutlinedInput-root": {
						padding: 0,
					},
					"& .MuiAutocomplete-clearIndicator": {
						mr: 1,
					},
					borderRadius: 5,
					bgcolor: "#FFFFFF",
				}}
				renderInput={(params) => (
					<TextField
						{...params}
						placeholder="Search"
						variant="standard"
						sx={styles.searchInput}
					/>
				)}
			/>
		</Paper>
	);
};

const styles = {
	paper: {
		display: "flex",
		alignItems: "center",
		width: "100%",
		maxWidth: 600,
		borderRadius: 25,
		boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
		bgcolor: "#EBE9E9",
		p: 1,
	},
	searchInput: {
		ml: 1,
		justifyContent: "center",
		"& .MuiInput-underline:before": {
			borderBottom: "none",
		},
		"& .MuiInput-underline:after": {
			borderBottom: "none",
		},
		"& .MuiInput-underline:hover:not(.Mui-disabled):before": {
			borderBottom: "none",
		},
	},
};

export default SearchBar;
