import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Result.css";
import { useNavigate } from "react-router-dom";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const Result = () => {
  const { countryName } = useParams();
  const [hotels, setHotels] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(
          `${REACT_APP_API_URL}countries/by/${countryName}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data.hotels);

        setHotels(data.hotels.hotels || []);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchHotels();

    const storedFavourites =
      JSON.parse(localStorage.getItem("favourites")) || [];
    setFavourites(storedFavourites);
  }, [countryName]);

  const toggleFavourite = (hotelId) => {
    let updatedFavourites;
    if (favourites.includes(hotelId)) {
      updatedFavourites = favourites.filter((id) => id !== hotelId);
    } else {
      updatedFavourites = [...favourites, hotelId];
    }
    setFavourites(updatedFavourites);
    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
  };

  const userChecker = () => {
    if (localStorage.getItem("authToken")) {
      console.log("User logged in");
    } else {
      alert("You should log in!!!");
    }
  };

  return (
    <section id="result">
      <div>
        <h2>Found by {countryName}</h2>
        <p>Found {hotels.length} options</p>
        <div className="hotels-result">
          {hotels.map((hotel) => (
            <div
              key={hotel.hotelId}
              className="hotel-result"
              onClick={(e) => {
                if (
                  e.target.tagName.toLowerCase() !== "button" &&
                  !e.target.closest("button")
                ) {
                  navigate(`/hotel/${hotel.hotelId}`);
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="hotel-result-image">
                <img alt={hotel.name} src={hotel.Images[0].url} />
              </div>
              <div className="hotel-result-details">
                <div className="hotel-name-rate">
                  <h2>{hotel.name}</h2>
                  <p>
                    <span>
                      <i className="fa fa-star"></i>
                    </span>
                    <span>{hotel.hotelRating}</span>
                  </p>
                </div>
                <div>
                  <h3>{hotel.location}</h3>

                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                  <p>${hotel.price} Starting</p>
                </div>
                <div className="buttons-container">
                  <button
                    className="book-now"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation
                      userChecker();
                    }}
                  >
                    Book now
                  </button>
                  <button
                    className="book-now"
                    onClick={() => toggleFavourite(hotel.hotelId)}
                  >
                    <span>
                      {favourites.includes(hotel.hotelId)
                        ? "Remove from favourites"
                        : "Add to favourites"}{" "}
                    </span>
                    <i
                      className={`fa fa-heart${
                        favourites.includes(hotel.hotelId) ? " fav" : ""
                      }`}
                    ></i>
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
