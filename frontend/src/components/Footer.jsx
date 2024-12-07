import "../styles/Footer.css";

import { Link } from "react-router-dom";
export default function Footer() {
    return (
        <footer className="footer">
            <p className="footer-item">© 2024 Ibn Battuta. All rights reserved.</p>

            <div className="footer-item">
                {" "}
                <Link to="/privacy" className="custom-link">
                    Privacy|Terms
                </Link>
                <Link to="/support" className="custom-link">
                    Support
                </Link>
                <a href="mailto:raffayl@gmail.com" className="custom-link">
                    Contact
                </a>
            </div>
        </footer>
    );
}
