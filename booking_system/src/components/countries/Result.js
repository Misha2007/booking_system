import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Result.css";
import data_file from "../../data.json";

const Result = () => {
  const { countryName } = useParams();
  console.log(countryName);

  const [hotels, setHotels] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const searchQuery = query.get("q") || "";

  const [search, setSearch] = useState(searchQuery);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          `http://${data_file.ip}:${data_file.port}/countries/by/${countryName}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data.hotels);
        // const uniqueCountries = [
        //   ...new Set(data.regions.map((item) => item.countryName)),
        // ];

        setHotels(data.hotels.hotels);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchCountries();
  }, []);

  return (
    <section id="result">
      <div>
        <h2>Found by {countryName}</h2>
        <p>Found {hotels.length} options</p>
        <div className="hotels-result">
          {hotels.map((hotel) => (
            <div key={hotel.hotelId} className="hotel-result">
              <img alt={hotel.name} src={hotel.image} />
              <div className="hotel-result-details">
                <div>
                  <h2>{hotel.name}</h2>
                  <p>
                    <i className="fa fa-star"></i>
                    {hotel.hotelRating}
                  </p>
                  <h3>hotel.location</h3>
                  <div>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum.
                    </p>
                    <p>${hotel.price} Starting</p>
                  </div>
                </div>
                <div className="buttons-container">
                  <button className="book-now">Book now</button>
                  <button className="book-now">
                    <span>Add to favourites </span>
                    <i className="fa fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Result;
