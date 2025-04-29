import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Result.css";
import data_file from "../../data.json";

const Result = () => {
  const { countryName } = useParams();
  const [hotels, setHotels] = useState([]);
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(
          `http://${data_file.ip}:${data_file.port}/countries/by/${countryName}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setHotels(data.hotels.hotels || []);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchHotels();

    const storedFavourites = JSON.parse(localStorage.getItem("favourites")) || [];
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
                  <h3>{hotel.location}</h3>
                  <div>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                    <p>${hotel.price} Starting</p>
                  </div>
                </div>
                <div className="buttons-container">
                  <button className="book-now">Book now</button>
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
