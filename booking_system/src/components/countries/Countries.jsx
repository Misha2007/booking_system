import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./Countries.css";
import data_file from "../../data.json";
import Result from "./Result";

const Countries = () => {
  const [countries, setCountries] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const searchQuery = query.get("q") || "";

  const [search, setSearch] = useState(searchQuery);

  // setCountries([
  //   "United States",
  //   "Canada",
  //   "Brazil",
  //   "United Kingdom",
  //   "Germany",
  //   "France",
  //   "Japan",
  //   "India",
  //   "Australia",
  //   "South Africa",
  // ]);
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          `http://${data_file.ip}:${data_file.port}/countries/all`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        const uniqueCountries = [
          ...new Set(data.regions.map((item) => item.countryName)),
        ];

        setCountries(uniqueCountries);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchCountries();
  }, []);

  console.log(countries);

  // const filteredCountries = countries.filter((country) =>
  //   country.toLowerCase().includes(search.toLowerCase())
  // );

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
                <Link to="/search" className="topic">
                  <span style={{ fontWeight: search ? "normal" : "bold" }}>
                    All
                  </span>
                </Link>
              </li>
              <hr />
              {countries.map((country) => (
                <div className="topic_block" key={country}>
                  <li>
                    <Link
                      to={`/result/${encodeURIComponent(country)}`}
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
