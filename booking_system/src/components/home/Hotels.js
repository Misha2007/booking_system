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
          description: "Explore the breathtaking mountains.",
          price: 50,
          image:
            "https://www.zicasso.com/static/f0a152d1bc93dc1a7b2fd97679e949b2/304cc/f0a152d1bc93dc1a7b2fd97679e949b2.jpg",
          stars: 5,
        },
        {
          id: 2,
          title: "Springfield at Sea Resort & Spa",
          price: 50,
          image:
            "https://cdn.togethertowherever.com/wp-content/uploads/2024/04/Gates-of-Old-Town-Tallinn.jpeg",
          stars: 5,
        },
        {
          id: 3,
          title: "Paris Getaway",
          price: 50,
          image:
            "https://travel.usnews.com/dims4/USNEWS/f6017b9/2147483647/resize/600x400%5E%3E/crop/600x400/quality/85/?url=https%3A%2F%2Ftravel.usnews.com%2Fimages%2FNew_Paris_pic_jw04ZlH.jpg",
          stars: 5,
        },
        {
          id: 4,
          title: "Pyramids",
          price: 50,
          image:
            "https://afar.brightspotcdn.com/dims4/default/9bb38bd/2147483647/strip/true/crop/2000x1061+0+14/resize/1440x764!/quality/90/?url=https%3A%2F%2Fk3-prod-afar-media.s3.us-west-2.amazonaws.com%2Fbrightspot%2F0f%2F2c%2F6f2efc02b5ba681dadbfa694f856%2Foriginal-egypt.jpg",
          stars: 5,
        },
        {
          id: 5,
          title: "Paris Getaway",
          price: 50,
          image:
            "https://travel.usnews.com/dims4/USNEWS/f6017b9/2147483647/resize/600x400%5E%3E/crop/600x400/quality/85/?url=https%3A%2F%2Ftravel.usnews.com%2Fimages%2FNew_Paris_pic_jw04ZlH.jpg",
          stars: 5,
        },
      ]);
    }, 1000);
  }, []);

  return (
    <section className="dsa">
      <div className="hotels-container">
        <h2 className="hotels__title">Best hotels</h2>
        <div className="hotels">
          {hotels.slice(1).map((hotel) => (
            <div key={hotel.id} className="hotel">
              <img src={`${hotel.image}`}></img>
              <h3>{hotel.title}</h3>
              <p>{"⭐".repeat(hotel.stars)}</p>
              <p>${hotel.price} Starting</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hotels;
