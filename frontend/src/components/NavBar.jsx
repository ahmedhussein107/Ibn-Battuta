import { Link } from "react-router-dom";
const NavBar = () => {
	return (
		<nav style={styles.nav}>
			<ul style={styles.ul}>
				<li style={styles.li}>
					<Link to="/" style={styles.link}>
						Home
					</Link>
				</li>
				<li style={styles.li}>
					<Link to="/about" style={styles.link}>
						About
					</Link>
				</li>
				<li style={styles.li}>
					<Link to="/create-product" style={styles.link}>
						Create Product
					</Link>
				</li>
				<li style={styles.li}>
					<Link to="/update-product/123" style={styles.link}>
						Update Product
					</Link>
				</li>
				<li style={styles.li}>
					<Link to="/tourguide" style={styles.link}>
						Tour Guide Profile
					</Link>
				</li>
				<li style={styles.li}>
					<Link to="/tourist" style={styles.link}>
						Tourist Profile
					</Link>
				</li>
				<li style={styles.li}>
					<Link to="/seller" style={styles.link}>
						Seller Profile
					</Link>
				</li>
			</ul>
		</nav>
	);
};

const styles = {
	nav: {
		backgroundColor: "#f8f9fa", // Light background color for the navbar
		padding: "10px 20px", // Padding around the navbar
		boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Slight shadow for depth
	},
	ul: {
		display: "flex", // Flexbox to place items in a row
		listStyleType: "none", // Remove bullet points
		margin: 0, // Remove default margin
		padding: 0, // Remove default padding
	},
	li: {
		margin: "0 15px", // Spacing between the list items
	},
	link: {
		textDecoration: "none", // Remove underline from links
		color: "#007bff", // Default color for links (Bootstrap-like)
		fontSize: "16px", // Font size for the links
		fontWeight: "bold", // Make the text bold
		padding: "5px 10px", // Padding inside the link
		borderRadius: "5px", // Slight rounding of corners
		transition: "background-color 0.3s", // Smooth background color transition
	},
	linkHover: {
		backgroundColor: "#e9ecef", // Change background on hover
	},
};

export default NavBar;
