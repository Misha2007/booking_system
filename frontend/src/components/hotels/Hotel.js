import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Trip from "./Trip";
import "./Hotel.css";
import NotFound from "../UI/NotFound";
import "./Gallery.css";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const Result = (props) => {
  const navigate = useNavigate();

  const { hotelId } = useParams();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedRoomCategory, setSelectedRoomCategory] = useState("all");

  const [hotel, setHotel] = useState();
  const [notFound, setNotFound] = useState(false);

  const [error, setError] = useState(null);

  const [authorized, setAuthorized] = useState(
    localStorage.getItem("authToken")
  );

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const searchQuery = query.get("q") || "";

  const previewImage =
    hotel && hotel.Images.find((image) => image.isCover)?.url;

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${REACT_APP_API_URL}hotel/${hotelId}`);

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const onSubmitTrip = async (tripData) => {
    const storedToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${REACT_APP_API_URL}user/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      });

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
        roomId: tripData.roomId,
        numberOfGuests: tripData.numberOfGuests,
        price: tripData.price,
      };

      localStorage.setItem("pendingBooking", JSON.stringify(bookingData));

      navigate("/payment", {
        state: { bookingData: bookingData, user: data.user },
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const getGroupedImages = () => {
    if (!hotel?.Images) return {};

    const grouped = {
      all: [],
    };

    hotel.Images.forEach((img) => {
      grouped.all.push(img);

      if (img.roomInfoId) {
        if (!grouped[img.roomInfoId]) {
          grouped[img.roomInfoId] = [];
        }
        grouped[img.roomInfoId].push(img);
      }
    });

    return grouped;
  };

  const groupedImages = getGroupedImages();

  const roomOptions = [
    { id: "all", name: "All" },
    ...(hotel?.roomInfos || []).map((room) => ({
      id: room.id,
      name: room.room.roomType,
    })),
  ];

  if (notFound) {
    return <NotFound />;
  }

  return (
    <section id="result">
      <div>
        {hotel ? (
          <div className="hotel-result-container">
            <div className="hotel-result">
              {/* <div className="hotel-result-image">
                <img alt={hotel.name} src={hotel.image} />
                {hotel.Images.map((image) => (
                  <img src={image.url} />
                ))}
              </div> */}
              {console.log(previewImage)}
              <div className="gallery-preview hotel-result-image">
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    onClick={() => setIsGalleryOpen(true)}
                  />
                )}
              </div>

              {isGalleryOpen && (
                <div
                  className="gallery-overlay"
                  onClick={() => {
                    setIsGalleryOpen(false);
                    setSelectedImage(null);
                  }}
                >
                  <div
                    className="gallery-modal"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="gallery-header">
                      {selectedImage && (
                        <button
                          className="gallery-close back-button"
                          onClick={() => setSelectedImage(null)}
                        >
                          <i className="fa fa-arrow-left"></i>
                        </button>
                      )}

                      <div className="gallery-filters">
                        {roomOptions.map((room) => (
                          <button
                            key={room.id}
                            className={`gallery-filter-button ${
                              selectedRoomCategory === room.id ? "active" : ""
                            }`}
                            onClick={() => setSelectedRoomCategory(room.id)}
                          >
                            {room.name}
                          </button>
                        ))}
                      </div>
                      <button
                        className="gallery-close"
                        onClick={() => {
                          setIsGalleryOpen(false);
                          setSelectedImage(null);
                        }}
                      >
                        <i className="fa fa-times" aria-hidden="true"></i>
                      </button>
                    </div>

                    {!selectedImage ? (
                      <div className="gallery-grid">
                        {(groupedImages[selectedRoomCategory] || []).length ===
                        0 ? (
                          <p style={{ textAlign: "center", marginTop: "20px" }}>
                            No images available for this room.
                          </p>
                        ) : (
                          <div className="gallery-grid">
                            {(groupedImages[selectedRoomCategory] || []).map(
                              (image, index) => (
                                <div key={index} className="gallery-item">
                                  <img
                                    src={image.url}
                                    alt={`Hotel image ${index + 1}`}
                                    onClick={() =>
                                      setSelectedImage({
                                        url: image.url,
                                        index,
                                      })
                                    }
                                  />
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="enlarged-view">
                        <img src={selectedImage.url} alt="Enlarged view" />

                        {groupedImages[selectedRoomCategory].length > 1 && (
                          <>
                            {selectedImage.index > 0 && (
                              <button
                                className="arrow-gallery arrow-left"
                                onClick={() =>
                                  setSelectedImage((prev) => ({
                                    url: groupedImages[selectedRoomCategory][
                                      prev.index - 1
                                    ].url,
                                    index: prev.index - 1,
                                  }))
                                }
                              >
                                <i className="fa fa-arrow-left"></i>
                              </button>
                            )}
                            {selectedImage.index <
                              groupedImages[selectedRoomCategory].length -
                                1 && (
                              <button
                                className="arrow-gallery arrow-right"
                                onClick={() =>
                                  setSelectedImage((prev) => ({
                                    url: groupedImages[selectedRoomCategory][
                                      prev.index + 1
                                    ].url,
                                    index: prev.index + 1,
                                  }))
                                }
                              >
                                <i className="fa fa-arrow-right"></i>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                {!authorized && (
                  <p style={{ color: "#f14a4aff" }}>
                    If you want to book a hotel, you need to authorize.
                  </p>
                )}
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
