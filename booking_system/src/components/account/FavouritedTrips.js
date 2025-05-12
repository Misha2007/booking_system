import React, { useState, useEffect } from "react";
import "../home/Hotels.css";

const localHotels = [
  {
    hotelId: 1,
    name: "Hotel Soho",
    location: "Unknown",
    hotelRating: 4.6,
    price: 50,
    image:
      "https://cf.bstatic.com/xdata/images/hotel/square600/371896039.webp?k=6386b5949904e76fedbf862547d98b6be1143175f423f1a711ec9a62bb1d6e43&o=",
  },
  {
    hotelId: 2,
    name: "Draakon Hotel",
    location: "Unknown",
    hotelRating: 3.5,
    price: 50,
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/2753125.jpg?k=f8215e38aa420367f9196cd5619fcfa5157a1fda084466bcb803eda031c6e93a&o=&hp=1",
  },
  {
    hotelId: 3,
    name: "Springfield at Sea Resort & Spa",
    location: "Unknown",
    hotelRating: 5,
    price: 50,
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/266923700.jpg?k=3306fa6ad63862f227d83f51a825e2d6255cd15de37217a470ae94813d5e3d2a&o=&hp=1",
  },
  {
    hotelId: 4,
    name: "Carolina Hotel",
    location: "Unknown",
    hotelRating: 3.2,
    price: 40,
    image: "https://www.carolina.ee/photos/Fassaad%20%202009.jpg?1389297182377",
  },
];

const FavouritedTrips = () => {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const storedFavourites =
      JSON.parse(localStorage.getItem("favourites")) || [];
    setFavourites(storedFavourites);
  }, []);

  const removeFromFavourites = (hotelId) => {
    const updatedFavourites = favourites.filter((id) => id !== hotelId);
    setFavourites(updatedFavourites);
    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
  };

  const validFavourites = favourites.filter((hotelId) =>
    localHotels.some((hotel) => hotel.hotelId === hotelId)
  );

  if (validFavourites.length === 0) {
    return <p>You have no favourited trips yet.</p>;
  }

  return (
    <div className="favourited-trips-container">
      <h2 className="profile__title">Favourited Trips</h2>
      <div className="hotels">
        {validFavourites.map((hotelId) => {
          const hotel = localHotels.find((h) => h.hotelId === hotelId);
          return (
            <div
              key={hotel.hotelId}
              className="hotel"
              style={{ position: "relative", paddingBottom: "40px" }}
            >
              <img alt={hotel.name} src={hotel.image} />
              <h3>{hotel.name}</h3>
              <div className="detail-container">
                <p>${hotel.price} Starting</p>
                <p>
                  <i className="fa fa-star"></i> {hotel.hotelRating}
                </p>
              </div>
              <button
                className="remove-favourite-btn"
                onClick={() => removeFromFavourites(hotel.hotelId)}
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  padding: "5px 10px",
                  backgroundColor: "#ff4d4d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Remove from favourite trips
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FavouritedTrips;
