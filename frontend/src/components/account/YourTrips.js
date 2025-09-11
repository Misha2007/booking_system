import { useState, useEffect } from "react";
import "../home/Hotels.css";
import "./YourTrips.css";
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const YourTrips = () => {
  const [trips, setTrips] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // carousel page index
  const [userData, setUserData] = useState({}); // user data

  useEffect(() => {
    const fetchUserData = async () => {
      const storedToken = localStorage.getItem("authToken");

      try {
        const response = await fetch(`${REACT_APP_API_URL}user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        setUserData(data.user.clientId);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(
          `${REACT_APP_API_URL}trips/get/${userData}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setTrips(Array.isArray(data.trips) ? data.trips : []);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    if (userData) fetchTrips();
  }, [userData]);

  // Calculate the number of full carousel groups (each group will contain 2 trips)
  const carouselGroups = [];
  if (trips.length < 4) {
    carouselGroups.push(trips); // Only one group if there are less than 4 trips
  } else {
    for (let i = 0; i < trips.length; i += 2) {
      carouselGroups.push(trips.slice(i, i + 2)); // Group trips in sets of 2
    }
  }

  const maxIndex = Math.max(0, carouselGroups.length - 1);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1));
  };

  if (trips.length === 0) {
    return <p>You have no trips yet.</p>;
  }

  return (
    <div className="favourited-trips-container">
      <h2 className="profile__title">Your Trips</h2>
      <div className="profile">
        <div className="trip-carousel-viewport">
          <div
            className={
              "trip-carousel-track " +
              (carouselGroups.length === 1 ? "less" : "")
            }
            style={{ transform: `translateX(-${currentIndex * 85}%)` }} // Adjust to show 2 columns at once
          >
            {console.log(carouselGroups.length)}
            {carouselGroups.map((group, idx) => (
              <div className="trip-container-row" key={idx}>
                <div className="trip-column">
                  {group.slice(0, 1).map(
                    (
                      trip // Show first trip in first column
                    ) => (
                      <div
                        key={trip.tripId}
                        className={
                          "trip-account" +
                          (trip.tripId % 2 !== 0 ? " green" : "")
                        }
                      >
                        <div>
                          <h2>Name:</h2>
                          <h1>{trip.name}</h1>
                        </div>
                        <div>
                          <h2>Days:</h2>
                          <div>
                            <h3>
                              {new Date(trip.arrivalDate).toDateString()}{" "}
                              <span>-</span>
                            </h3>
                            <h3>
                              {new Date(trip.departureDate).toDateString()}
                            </h3>
                          </div>
                        </div>
                        <i className="fa fa-arrow-right"></i>
                      </div>
                    )
                  )}
                </div>
                <div className="trip-column">
                  {group.slice(1, 2).map(
                    (
                      trip // Show second trip in second column
                    ) => (
                      <div
                        key={trip.tripId}
                        className={
                          "trip-account" +
                          (trip.tripId % 2 !== 0 ? " green" : "")
                        }
                      >
                        <div>
                          <h2>Name:</h2>
                          <h1>{trip.name}</h1>
                        </div>
                        <div>
                          <h2>Days:</h2>
                          <div>
                            <h3>
                              {new Date(trip.arrivalDate).toDateString()}{" "}
                              <span>-</span>
                            </h3>
                            <h3>
                              {new Date(trip.departureDate).toDateString()}
                            </h3>
                          </div>
                        </div>
                        <i className="fa fa-arrow-right"></i>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={
            trips.length > 4 ? "carousel-buttons" : "carousel-buttons-disable"
          }
        >
          <i
            className="fa fa-arrow-circle-left"
            onClick={handlePrevious}
            style={{ cursor: "pointer" }}
          ></i>
          <i
            className="fa fa-arrow-circle-right"
            onClick={handleNext}
            style={{ cursor: "pointer" }}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default YourTrips;
