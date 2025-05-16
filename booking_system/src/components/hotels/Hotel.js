import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
// import "./Result.css";
import data_file from "../../data.json";
import Trip from "./Trip";
import "./Hotel.css";
import NotFound from "../UI/NotFound";

const Result = (props) => {
  const navigate = useNavigate();

  const { hotelId } = useParams();
  console.log(hotelId);

  const [hotel, setHotel] = useState();
  const [notFound, setNotFound] = useState(false);

  const [error, setError] = useState(null);

  const [authorized, setAuthorized] = useState(
    localStorage.getItem("authToken")
  );

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const searchQuery = query.get("q") || "";

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          `http://${data_file.ip}:${data_file.port}/hotel/${hotelId}`
        );

        if (response.status === 404) {
          setNotFound(true);
          return;
        }

        if (!response.ok) {
          console.log(response);
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data.hotel);

        setHotel(data.hotel);
      } catch (error) {
        console.error("Error fetching hotels:", error);

        setNotFound(true);
      }
    };

    fetchCountries();
  }, []);

  const onSubmitTrip = async (tripData) => {
    const storedToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        `http://${data_file.ip}:${data_file.port}/user/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (!response.ok) {
        setError({
          title: "Problems with backend",
          message: "Failed to fetch user data",
        });
        return;
      }

      const data = await response.json();
      console.log("Fetched user:", data.user.clientId);
      console.log(tripData);
      console.log(hotel.hotelId);
      const bookingData = {
        clientId: data.user.clientId,
        hotelId: hotel.hotelId,
        arrivalDate: tripData.arrivalDate,
        departureDate: tripData.departureDate,
        roomType: tripData.departureDate,
        numberOfGuests: tripData.numberOfGuests,
      };

      localStorage.setItem("pendingBooking", JSON.stringify(bookingData));

      navigate("/payment", { state: { hotel_data: hotel, user: data.user } });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  if (notFound) {
    return <NotFound />;
  }

  return (
    <section id="result">
      <div>
        {hotel ? (
          <div className="hotel-result-container">
            <div className="hotel-result">
              <div className="hotel-result-image">
                <img alt={hotel.name} src={hotel.image} />
              </div>
              <div className="hotel-result-details">
                <div className="hotel-name-rate">
                  <h2>{hotel.name}</h2>
                  <p>
                    <i className="fa fa-star"></i>
                    {hotel.hotelRating}
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
                {/* <div className="buttons-container">
                  <button
                    className="book-now"
                    onClick={(e) => {
                      e.stopPropagation();
                      userChecker();
                    }}
                  >
                    Book now
                  </button>
                  <button
                    className="book-now"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Add to favourites </span>
                    <i className="fa fa-heart"></i>
                  </button>
                </div> */}
              </div>
            </div>
            {authorized && (
              <div id="trip">
                <Trip hotel={hotel} onSubmitTrip={onSubmitTrip}></Trip>
              </div>
            )}
          </div>
        ) : (
          <p>Loading hotel details...</p>
        )}
      </div>
    </section>
  );
};

export default Result;
