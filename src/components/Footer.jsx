import { Link } from "react-router-dom";
import "../styles/index.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/" className="footer-link">Home</Link>
        <Link to="/about" className="footer-link">About</Link>
        <Link to="/contact" className="footer-link">Contact</Link>
      </div>
      <div className="footer-copy">
        &copy; {new Date().getFullYear()} SurfRentals. All rights reserved.
      </div>
    </footer>
  );
}