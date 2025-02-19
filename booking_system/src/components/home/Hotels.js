import React, { useState, useEffect } from "react";
import "./Hotels.css";

const Hotels = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setHotels([
        {
          id: 1,
          title: "Carolina Hotel",
          price: 50,
          image:
            "https://www.carolina.ee/photos/Fassaad%20%202009.jpg?1389297182377",
          stars: 3.2,
        },
        {
          id: 2,
          title: "Springfield at Sea Resort & Spa",
          price: 50,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/266923700.jpg?k=3306fa6ad63862f227d83f51a825e2d6255cd15de37217a470ae94813d5e3d2a&o=&hp=1",
          stars: 5.0,
        },
        {
          id: 3,
          title: "Hotel Soho",
          price: 50,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/square600/371896039.webp?k=6386b5949904e76fedbf862547d98b6be1143175f423f1a711ec9a62bb1d6e43&o=",
          stars: 4.6,
        },
        {
          id: 4,
          title: "Draakon Hotel",
          price: 50,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1024x768/2753125.jpg?k=f8215e38aa420367f9196cd5619fcfa5157a1fda084466bcb803eda031c6e93a&o=&hp=1",
          stars: 3.5,
        },
      ]);
    }, 1000);
  }, []);

  return (
    <section className="dsa">
      <div className="hotels-container">
        <h2 className="hotels__title">Best hotels</h2>
        <div className="hotels">
          {hotels.slice(0).map((hotel) => (
            <div key={hotel.id} className="hotel">
              <img alt="" src={`${hotel.image}`}></img>
              <h3>{hotel.title}</h3>
              <div className="detail-container">
                <p>${hotel.price} Starting</p>
                <p>
                  <i class="fa fa-star"></i>
                  {hotel.stars}
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
