import React, { useState, useEffect } from "react";
import "./Hotels.css";
import data_file from "../../data.json";
import { useNavigate } from "react-router-dom";

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(
          `http://${data_file.ip}:${data_file.port}/hotels`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setHotels(Array.isArray(data.hotels) ? data.hotels : []);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchHotels();
  }, []);

  return (
    <section className="dsa">
      <div className="hotels-container">
        <h2 className="hotels__title">Best Hotels</h2>
        <div className="hotels">
          {hotels.map((hotel) => (
            <div
              key={hotel.hotelId}
              className="hotel"
              onClick={(e) => {
                if (
                  e.target.tagName.toLowerCase() !== "button" &&
                  !e.target.closest("button")
                ) {
                  navigate(`/hotel/${hotel.hotelId}`);
                }
              }}
            >
              {console.log("dsfsdfkdshfk", hotel.Images)}
              <img alt={hotel.name} src={hotel.Images[0].url} />
              <h3>{hotel.name}</h3>
              <div className="detail-container">
                <p>${hotel.price} Starting</p>
                <p>
                  <i className="fa fa-star"></i>
                  {hotel.hotelRating}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hotels;
