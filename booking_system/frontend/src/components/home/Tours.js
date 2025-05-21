import React, { useState, useEffect } from "react";
import "./Tours.css"; // Import CSS file

const Tours = () => {
  // Sample data (replace with database fetch)
  const [tours, setTours] = useState([]);

  useEffect(() => {
    // Simulated database fetch
    setTimeout(() => {
      setTours([
        {
          id: 1,
          title: "Mountain Adventure",
          description: "Explore the breathtaking mountains.",
          image:
            "https://www.zicasso.com/static/f0a152d1bc93dc1a7b2fd97679e949b2/304cc/f0a152d1bc93dc1a7b2fd97679e949b2.jpg",
        },
        {
          id: 2,
          title: "Old Town",
          description: "Discover historic landmarks.",
          image:
            "https://cdn.togethertowherever.com/wp-content/uploads/2024/04/Gates-of-Old-Town-Tallinn.jpeg",
        },
        {
          id: 3,
          title: "Paris Getaway",
          description: "Experience the magic of Paris.",
          image:
            "https://travel.usnews.com/dims4/USNEWS/f6017b9/2147483647/resize/600x400%5E%3E/crop/600x400/quality/85/?url=https%3A%2F%2Ftravel.usnews.com%2Fimages%2FNew_Paris_pic_jw04ZlH.jpg",
        },
        {
          id: 4,
          title: "Pyramids",
          description: "Discover historic landmarks.",
          image:
            "https://afar.brightspotcdn.com/dims4/default/9bb38bd/2147483647/strip/true/crop/2000x1061+0+14/resize/1440x764!/quality/90/?url=https%3A%2F%2Fk3-prod-afar-media.s3.us-west-2.amazonaws.com%2Fbrightspot%2F0f%2F2c%2F6f2efc02b5ba681dadbfa694f856%2Foriginal-egypt.jpg",
        },
        {
          id: 5,
          title: "Paris Getaway",
          description: "Experience the magic of Paris.",
          image:
            "https://travel.usnews.com/dims4/USNEWS/f6017b9/2147483647/resize/600x400%5E%3E/crop/600x400/quality/85/?url=https%3A%2F%2Ftravel.usnews.com%2Fimages%2FNew_Paris_pic_jw04ZlH.jpg",
        },
      ]);
    }, 1000);
  }, []);

  return (
    <section className="dsa">
      <div className="tours-container">
        <h2 className="tours__title">Tours</h2>
        <div className="tours">
          {tours.length > 0 && (
            <div className="column left">
              <div
                className="tour"
                style={{ backgroundImage: `url(${tours[0].image})` }}
              >
                <h3 id="main-image-title">{tours[0].title}</h3>
                <p id="main-image-desc">{tours[0].description}</p>
              </div>
            </div>
          )}

          <div className="column right">
            {tours.slice(1).map((tour) => (
              <div
                key={tour.id}
                className="tour"
                style={{ backgroundImage: `url(${tour.image})` }}
              >
                <h3>{tour.title}</h3>
                <p>{tour.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tours;
