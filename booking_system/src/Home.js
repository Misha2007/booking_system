import { useState } from "react";
import "./Home.css";

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenuOpen = () => {
    setMenuOpen(true);
  };

  const toggleMenuClose = () => {
    setMenuOpen(false);
  };

  return (
    <div>
      <header id="header" className="fixed header-transparent">
        <a href="/" id="logo">
          <img src="images/logo.png" alt="Logo" className="image" />
        </a>

        <nav id="menu" className={menuOpen ? "open" : ""}>
          <button id="mobile-menu-btn" onClick={toggleMenuClose}>
            <i className="fa-solid fa-xmark" style={{ color: "#fff" }}></i>
          </button>
          <a href="/" className="menuItem">
            Main
          </a>
          <a href="#" className="menuItem">
            Last-Minute Tours
          </a>
          <a href="#" className="menuItem">
            Countries
          </a>
          <a href="#" className="menuItem">
            Search
          </a>
          <a href="#" className="menuItem">
            Account
          </a>
          <a href="#" className="menuItem">
            Benefits
          </a>
        </nav>

        <button id="mobile-menu-btn" onClick={toggleMenuOpen}>
          <i className="fa-solid fa-bars"></i>
        </button>
      </header>

      <div id="motion-demo">
        <img
          src="https://images.vexels.com/media/users/3/242810/isolated/preview/faf4f5ad02d6d68cfeafa44e1b57649a-plane-semi-flat.png"
          alt="Flying Plane"
          className="animated-plane"
        />
      </div>
    </div>
  );
};

export default Home;
