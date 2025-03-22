import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check authentication status on page load and when tokens change
  useEffect(() => {
    checkAuthStatus();

    // Listen for storage changes (for login/logout updates)
    const handleStorageChange = () => checkAuthStatus();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token); // Update authentication state
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    navigate("/");

    // Ensure UI updates by triggering a storage event
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <nav className="navbar navbar-dark bg-dark p-3">
      <Link className="navbar-brand" to="/">Book Management</Link>
      <div className="dropdown">
        <button 
          className="btn btn-light dropdown-toggle" 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          Menu
        </button>
        {isDropdownOpen && (
          <div className="dropdown-menu show" style={{ right: 0, left: "auto" }}>
            {isAuthenticated ? (
              <button className="dropdown-item" onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <Link className="dropdown-item" to="/" onClick={() => setIsDropdownOpen(false)}>Login</Link>
                <Link className="dropdown-item" to="/signup" onClick={() => setIsDropdownOpen(false)}>Signup</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
