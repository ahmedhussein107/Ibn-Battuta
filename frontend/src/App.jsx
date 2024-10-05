import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";

import CreateProductPage from "./pages/CreateProductPage";
const Home = () => (
  <div>
    <h1>Home Page</h1>
    <p>
      Welcome to the Home page! This is where the main content is displayed.
    </p>
  </div>
);

const About = () => (
  <div>
    <h1>About Page</h1>
    <p>Learn more about this app on this page.</p>
  </div>
);

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>

        <hr />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/create-product" element={<CreateProductPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
