/* eslint-disable react/no-unescaped-entities */
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
                    <Link to="/add-new-user" style={styles.link}>
                        Add New User
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link to="/user-management" style={styles.link}>
                        User Management
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link
                        to="/update-product/67015b31da89f2d0b8a94912"
                        style={styles.link}
                    >
                        Update Product
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link to="/tourguide" style={styles.link}>
                        Tour Guide Profile
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link to="/advertiser" style={styles.link}>
                        Advertiser Profile
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link to="/create-activity" style={styles.link}>
                        Create Activity
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link to="/seller" style={styles.link}>
                        Seller Profile
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link to="/update-activity" style={styles.link}>
                        Update Activity
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link to="/filter-landmarks" style={styles.link}>
                        Filter Landmarks
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link to="/tourist" style={styles.link}>
                        Tourist Profile
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link to="/activities" style={styles.link}>
                        Upcoming Activities
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link to="/view-products" style={styles.link}>
                        Gift Shop
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link to="/category-create" style={styles.link}>
                        Create Category
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link to="/category-all" style={styles.link}>
                        All Categories
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link to="/tag-create" style={styles.link}>
                        Create Tag
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link to="/tag-all" style={styles.link}>
                        All Tags
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link to="/landmark-governor" style={styles.link}>
                        Governor's Landmark
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link to="/itinerary" style={styles.link}>
                        Tour Guide's Itineraries
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link to="/itineraries" style={styles.link}>
                        Tour Guide's Itineraries Update and Delete
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link to="/itinerary-customAvtivity" style={styles.link}>
                        Tour Guide's Custom Activities
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link to="/activity" style={styles.link}>
                        Advertiser's Activities
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link to="/signup" style={styles.link}>
                        Sign Up as Tourist
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link to="/allsignup" style={styles.link}>
                        Sign Up
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link to="/filter-itineraries" style={styles.link}>
                        Filter Itinerary
                    </Link>
                </li>
                <li style={styles.li}>
                    <Link to="/landmarks" style={styles.link}>
                        Landmarks
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
