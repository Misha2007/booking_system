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
            "https://res.cloudinary.com/dshalmvbb/image/upload/v1773612910/mountains_nsngtc.jpg",
        },
        {
          id: 2,
          title: "Old Town",
          description: "Discover historic landmarks.",
          image:
            "https://res.cloudinary.com/dshalmvbb/image/upload/v1773613075/old_town_t1kjl0.jpg",
        },
        {
          id: 3,
          title: "Retro Vibes",
          description: "Feel the history within yourself.",
          image:
            "https://res.cloudinary.com/dshalmvbb/image/upload/v1773613162/retro_xnlten.jpg",
        },
        {
          id: 4,
          title: "Paris Getaway",
          description: "Experience the magic of Paris.",
          image:
            "https://res.cloudinary.com/dshalmvbb/image/upload/v1773612051/sfnj0tn8p1dhjh14mmih.jpg",
        },

        {
          id: 5,
          title: "Christmas Markets",
          description: "Celebrate Christmas in a different country.",
          image:
            "https://res.cloudinary.com/dshalmvbb/image/upload/v1773613341/christmas_edition_fusldt.jpg",
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
