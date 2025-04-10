import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./Countries.css";

const Countries = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const searchQuery = query.get("q") || "";

  const [search, setSearch] = useState(searchQuery);

  const countries = [
    "United States",
    "Canada",
    "Brazil",
    "United Kingdom",
    "Germany",
    "France",
    "Japan",
    "India",
    "Australia",
    "South Africa",
  ];

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`?q=${encodeURIComponent(search)}`);
  };

  return (
    <div className="topics">
      <div className="form-countries-full">
        <div className="form-room">
          <ul className="chart">
            <form onSubmit={handleSearch} className="topic-detail-form">
              <button type="submit" className="search-button">
                <i className="fa fa-search"></i>
              </button>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search countries..."
                id="search-form-topics"
              />
            </form>

            <div className="topic_block">
              <li>
                <Link to="/" className="topic">
                  <span style={{ fontWeight: search ? "normal" : "bold" }}>
                    All
                  </span>
                </Link>
              </li>
              <hr />
              {filteredCountries.map((country) => (
                <div className="topic_block" key={country}>
                  <li>
                    <Link
                      to={`/?q=${encodeURIComponent(country)}`}
                      className="topic"
                    >
                      <span>{country}</span>
                    </Link>
                  </li>
                  <hr />
                </div>
              ))}
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Countries;
