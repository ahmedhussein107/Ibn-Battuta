import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

const HomePage = () => (
    <div
        style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
        }}
    >
        <h1>Home Page</h1>
        <p>Welcome to the Home page! This is where the main content is displayed.</p>
        <Footer />
    </div>
);

export default HomePage;
