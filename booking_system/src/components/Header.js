import { useState } from "react";
import "./Header.css";

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
        <a href="/" className="menuItem">
          Main
        </a>
        <a href="#" className="menuItem">
          Countries
        </a>
        <a href="#" className="menuItem">
          Search
        </a>
        <a href="#" className="menuItem">
          Benefits
        </a>
        <a href="#" className="menuItem">
          Account
        </a>
      </nav>

      <button id="mobile-menu-btn" onClick={toggleMenuOpen}>
        <i className="fa-solid fa-bars"></i>
      </button>
    </header>
  );
};

export default Header;
