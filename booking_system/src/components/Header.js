import { useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenuOpen = () => {
    setMenuOpen(true);
  };

  const toggleMenuClose = () => {
    setMenuOpen(false);
  };

  return (
    <header id="header" className="fixed header-transparent">
      <a href="/" id="logo">
        <img
          src="https://cdn-icons-png.flaticon.com/512/5219/5219577.png"
          alt="Logo"
          className="image"
        />
      </a>

      <nav id="menu" className={menuOpen ? "open" : ""}>
        <button id="mobile-menu-btn" onClick={toggleMenuClose}>
          <i className="fa-solid fa-xmark" style={{ color: "#fff" }}></i>
        </button>
        <Link to="/" className="menuItem">
          Main
        </Link>
        <Link to="/contries" className="menuItem">
          Countries
        </Link>
        <Link to="/search" className="menuItem">
          Search
        </Link>
        <Link to="/benefits" className="menuItem">
          Benefits
        </Link>
        <Link to="/login" className="menuItem">
          Account
        </Link>
      </nav>

      <button id="mobile-menu-btn" onClick={toggleMenuOpen}>
        <i className="fa-solid fa-bars"></i>
      </button>
    </header>
  );
};

export default Header;
