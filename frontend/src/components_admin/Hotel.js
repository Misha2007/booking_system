import data_file from "../data.json";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AdminHotel.css";

function AdminHotel() {
  const params = useParams();
  const [hotel, setHotel] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hotelId, setHotelId] = useState(params.hotelId);
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchHotelData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://${data_file.ip}:${data_file.port}/hotel-admin/${hotelId}`
        );
        const data = await response.json();
        setHotel(data.hotel);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    if (!storedToken) {
      navigate("/login");
    } else {
      fetchHotelData();
    }
  }, []);

  return (
    <>
      <div id="admin-hotel-wrap">
        <i
          className="fa fa-close"
          onClick={() => navigate("/admin/hotels")}
        ></i>

        <h1>Admin Panel - Hotel Details</h1>
        <div id="admin-hotel">
          {loading ? (
            <p className="loading">Loading...</p>
          ) : error ? (
            <p className="error">Error: {error.message}</p>
          ) : (
            <>
              <div id="hotel-details" className="card">
                <h2 className="title">Hotel Information</h2>
                <div className="hotel-info">
                  <p>
                    <strong>Hotel ID:</strong> {hotelId}
                  </p>
                  <p>
                    <strong>Hotel Name:</strong> {hotel.name}
                  </p>
                  <p>
                    <strong>Location:</strong> {hotel.location}
                  </p>
                  <p>
                    <strong>Available Rooms:</strong> {hotel.availableRooms}
                  </p>
                  <p>
                    <strong>Rating:</strong> {hotel.hotelRating}
                  </p>
                  <p>
                    <strong>Price:</strong> ${hotel.price}
                  </p>
                  <p>
                    <strong>Description:</strong> {hotel.description}
                  </p>
                </div>
                <div className="hotel-img">
                  <p className="img-url">
                    <strong>Hotel Image: </strong>
                    <a
                      href={hotel.image}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Image
                    </a>
                  </p>
                  <img src={hotel.image} alt={hotel.name} />
                </div>
              </div>

              <div>
                <div id="rooms" className="card">
                  <h3 className="title">Rooms</h3>
                  {hotel.rooms.map((room) => (
                    <div key={room.id} className="room">
                      <p>
                        <strong>Room Id:</strong> {room.Room}
                      </p>

                      <p>
                        <strong>Room Type:</strong> {room.roomType}
                      </p>

                      <p>
                        <strong>Room Name:</strong> {room.roomName}
                      </p>
                    </div>
                  ))}
                  <button className="add-room">
                    <span> Add room</span>{" "}
                  </button>
                </div>

                <div id="region" className="card">
                  <h3 className="title">Region</h3>
                  <div className="region-info">
                    <p>
                      <strong>Region Name:</strong> {hotel.region?.regionName}
                    </p>
                    <p>
                      <strong>Country:</strong> {hotel.region?.countryName}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminHotel;
