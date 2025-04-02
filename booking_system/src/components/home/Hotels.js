import React, { useState, useEffect } from "react";
import "./Hotels.css";

const Hotels = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('http://localhost:3002/hotels');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setHotels(Array.isArray(data.hotels) ? data.hotels : []);
      } catch (error) {
        console.error('Error fetching hotels:', error);
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
            <div key={hotel.hotelId} className="hotel">
              <img alt={hotel.name} src={hotel.image} />
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