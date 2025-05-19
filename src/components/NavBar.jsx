import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { supabase } from "../supabase";
import "../styles/index.css";
import { useState } from "react";

export default function NavBar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignOut = async () => {
    setShowConfirm(true);
  };

  const confirmSignOut = async () => {
    await supabase.auth.signOut();
    setShowConfirm(false);
    if (location.pathname === "/admin") {
      navigate("/");
    }
  };

  const cancelSignOut = () => setShowConfirm(false);

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-logo">SurfRentals</Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          {user && (
            <Link to="/admin" className="navbar-link">Admin</Link>
          )}
          {user ? (
            <button
              className="navbar-link"
              style={{ background: "none", border: "none", cursor: "pointer" }}
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          ) : (
            <Link to="/login" className="navbar-link">Admin Login</Link>
          )}
        </div>
      </nav>
      {showConfirm && (
        <div className="signout-modal">
          <div className="signout-modal-content">
            <p>Are you sure you want to sign out?</p>
            <button className="signout-btn" onClick={confirmSignOut}>Yes, Sign Out</button>
            <button className="signout-cancel-btn" onClick={cancelSignOut}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}