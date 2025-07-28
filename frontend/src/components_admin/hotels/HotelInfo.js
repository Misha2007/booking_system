import data_file from "../../data.json";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AdminHotel.css";

function HotelInfo() {
  const params = useParams();
  const [hotel, setHotel] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hotelId, setHotelId] = useState(params.hotelId);
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("authToken");

  const [addRoom, setAddRoom] = useState(false);
  const roomTypeRef = useRef();
  const roomNameRef = useRef();
  const capacityRef = useRef();
  const basePriceRef = useRef();
  const quantityRef = useRef();

  const fetchHotelData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://${data_file.ip}:${data_file.port}/hotel-admin/${hotelId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        if (
          response.status === 401 &&
          data.message &&
          data.message.toLowerCase().includes("expired")
        ) {
          localStorage.removeItem("authToken");
          navigate("/login?error=Session expired. Please log in again.");
          return;
        } else if (response.status === 403) {
          navigate("/error", {
            state: {
              error: "403",
              errorMessage: "You do not have access to this page",
            },
          });
          return;
        }
        throw new Error("Failed to fetch user data");
      }
      setHotel(data.hotel);
      console.log(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!storedToken) {
      navigate("/login");
    } else {
      fetchHotelData();
    }
  }, []);

  const handleAddRoom = async (event) => {
    event.preventDefault();

    const enteredRoomType = roomTypeRef.current?.value || "";
    const enteredRoomName = roomNameRef.current?.value || "";

    if (!enteredRoomType || !enteredRoomName) {
      setError(new Error("Missing input fields"));
      return;
    }

    const room = {
      roomType: enteredRoomType,
      roomName: enteredRoomName,
      hotelId: hotelId,
      capacity: capacityRef.current?.valueAsNumber || 0,
      basePrice: basePriceRef.current?.valueAsNumber || 0,
      quantity: quantityRef.current?.valueAsNumber || 0,
    };

    try {
      const response = await fetch(
        `http://${data_file.ip}:${data_file.port}/rooms/hotel/add-room`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify(room),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (
          response.status === 401 &&
          errorData.message &&
          errorData.message.toLowerCase().includes("expired")
        ) {
          localStorage.removeItem("authToken");
          navigate("/login?error=Session expired. Please log in again.");
          return;
        }
        throw new Error("Failed to add room");
      }

      const data = await response.json();

      await fetchHotelData();

      if (roomTypeRef.current) roomTypeRef.current.value = "";
      if (roomNameRef.current) roomNameRef.current.value = "";

      setAddRoom(false);
    } catch (err) {
      setError(err);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      const response = await fetch(
        `http://${data_file.ip}:${data_file.port}/rooms/delete/${roomId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete room");

      await fetchHotelData();
    } catch (err) {
      setError(err);
    }
  };

  return (
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
                <a href={hotel.image} target="_blank" rel="noopener noreferrer">
                  View Image
                </a>
              </p>
              <img src={hotel.image} alt={hotel.name} />
            </div>
          </div>

          <div>
            <div id="rooms" className="card">
              <h3 className="title">Rooms</h3>
              {hotel.roomInfos.map((room) => (
                <div key={room.id} className="room">
                  <i
                    className="fa fa-trash"
                    onClick={() => handleDeleteRoom(room.roomId)}
                  ></i>
                  <p>
                    <strong>Room Id:</strong> {room.roomId}
                  </p>
                  <p>
                    <strong>Room Type:</strong> {room.room.roomType}
                  </p>
                  <p>
                    <strong>Room Name:</strong> {room.room.roomName}
                  </p>
                  <p>
                    <strong>Capacity:</strong> {room.capacity} Guests
                  </p>
                  <p>
                    <strong>Default Price:</strong> {room.basePrice}$
                  </p>
                  <p>
                    <strong>Quantity:</strong> {room.quantity}
                  </p>
                </div>
              ))}
              {addRoom ? (
                <form className="room" onSubmit={handleAddRoom}>
                  <p>
                    <strong>Room Type:</strong>{" "}
                    <input ref={roomTypeRef} type="text" required />
                  </p>
                  <p>
                    <strong>Room Name:</strong>{" "}
                    <input ref={roomNameRef} type="text" required />
                  </p>
                  <p>
                    <strong>Capacity:</strong>{" "}
                    <input ref={capacityRef} type="number" required />
                  </p>
                  <p>
                    <strong>Base Price:</strong>{" "}
                    <input
                      ref={basePriceRef}
                      type="number"
                      step="0.01"
                      required
                    />
                  </p>
                  <p>
                    <strong>Quantity:</strong>{" "}
                    <input ref={quantityRef} type="number" required />
                  </p>
                  <div className="add-room-container">
                    <button
                      className="add-room cancel"
                      type="button"
                      onClick={() => setAddRoom(false)}
                    >
                      <span>Cancel</span>
                    </button>
                    <button className="add-room" type="submit">
                      <span>Add Room</span>
                    </button>
                  </div>
                </form>
              ) : (
                <button className="add-room" onClick={() => setAddRoom(true)}>
                  <span>Add Room</span>
                </button>
              )}
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
  );
}

export default HotelInfo;
