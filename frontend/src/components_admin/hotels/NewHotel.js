import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NewHotel.css";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

function NewHotel() {
  const [newHotel, setNewHotel] = useState({
    name: "",
    location: "",
    price: 0,
    hotelRating: 0,
    description: "",
    regionId: "",
  });

  const [regions, setRegions] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [addRoom, setAddRoom] = useState(false);
  const [creatingNewRegion, setCreatingNewRegion] = useState(false);
  const [newRegion, setNewRegion] = useState({
    regionName: "",
    countryName: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("authToken");

  const roomTypeRef = useRef();
  const roomNameRef = useRef();
  const capacityRef = useRef();
  const basePriceRef = useRef();
  const quantityRef = useRef();

  useEffect(() => {
    if (!storedToken) {
      navigate("/login");
    } else {
      fetchInitialData();
    }
  }, []);

  const fetchInitialData = async () => {
    try {
      const [regionRes, roomTypeRes] = await Promise.all([
        fetch(`${REACT_APP_API_URL}countries/all`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        }),
        fetch(`${REACT_APP_API_URL}rooms/room-types`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        }),
      ]);

      if (!regionRes.ok || !roomTypeRes.ok)
        throw new Error("Failed to fetch initial data");

      const regionsData = await regionRes.json();
      const roomTypesData = await roomTypeRes.json();

      console.log(roomTypesData);
      setRegions(regionsData.regions);
      setRoomTypes(roomTypesData);
    } catch (err) {
      setError(err);
    }
  };

  const handleAddRoom = (e) => {
    e.preventDefault();

    const newRoom = {
      roomType: roomTypeRef.current?.value || "",
      roomName: roomNameRef.current?.value || "",
      capacity: capacityRef.current?.valueAsNumber || 0,
      basePrice: basePriceRef.current?.valueAsNumber || 0,
      quantity: quantityRef.current?.valueAsNumber || 0,
    };

    if (!newRoom.roomType || !newRoom.roomName) {
      setError(new Error("Missing room fields"));
      return;
    }

    setRooms([...rooms, newRoom]);

    roomTypeRef.current.value = "";
    roomNameRef.current.value = "";
    capacityRef.current.value = "";
    basePriceRef.current.value = "";
    quantityRef.current.value = "";
    setAddRoom(false);
  };

  const handleRemoveRoom = (index) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const handleCreateHotel = async () => {
    try {
      let regionId = newHotel.regionId;

      if (creatingNewRegion && newRegion.regionName && newRegion.countryName) {
        const regionRes = await fetch(`${REACT_APP_API_URL}regions/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify(newRegion),
        });

        if (!regionRes.ok) throw new Error("Failed to create new region");

        const regionData = await regionRes.json();
        regionId = regionData.regionId;
      }

      const hotelPayload = {
        ...newHotel,
        regionId,
        rooms,
      };

      const res = await fetch(`${REACT_APP_API_URL}hotel/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify(hotelPayload),
      });

      if (!res.ok) throw new Error("Failed to create hotel");

      const hotelData = await res.json().hotelId;
      navigate(`/admin/hotels/${hotelData.hotelId}`, {
        state: { newHotel: true },
      });
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div id="admin-hotel">
      {error && <p className="error">Error: {error.message}</p>}

      <div className="card room">
        <h2 className="title">Create New Hotel</h2>
        <p>
          <p>
            <strong>Name:</strong>{" "}
          </p>

          <input
            type="text"
            value={newHotel.name}
            onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
          />
        </p>
        <p>
          <p>
            <strong>Location:</strong>{" "}
          </p>

          <input
            type="text"
            value={newHotel.location}
            onChange={(e) =>
              setNewHotel({ ...newHotel, location: e.target.value })
            }
          />
        </p>
        <p>
          <p>
            <strong>Price:</strong>{" "}
          </p>

          <input
            type="number"
            value={newHotel.price}
            onChange={(e) =>
              setNewHotel({ ...newHotel, price: +e.target.value })
            }
          />
        </p>
        <p>
          <p>
            <strong>Rating:</strong>{" "}
          </p>

          <input
            type="number"
            value={newHotel.hotelRating}
            onChange={(e) =>
              setNewHotel({ ...newHotel, hotelRating: +e.target.value })
            }
          />
        </p>
        <p>
          <p>
            <strong>Description:</strong>{" "}
          </p>

          <textarea
            value={newHotel.description}
            onChange={(e) =>
              setNewHotel({ ...newHotel, description: e.target.value })
            }
          />
        </p>

        <div className="region-select">
          <div>
            <strong>Region:</strong>
            <button
              className="add-room"
              onClick={() => setCreatingNewRegion(true)}
            >
              <span>+ New Region</span>
            </button>
          </div>

          {!creatingNewRegion ? (
            <>
              <div>
                <select
                  value={newHotel.regionId}
                  onChange={(e) =>
                    setNewHotel({ ...newHotel, regionId: e.target.value })
                  }
                  className="select-region"
                >
                  <option value="">-- Select Region --</option>
                  {regions.map((region) => (
                    <option key={region.regionId} value={region.regionId}>
                      {region.regionName} - {region.countryName}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <div>
              <p>
                <strong>Region Name:</strong>{" "}
                <input
                  type="text"
                  value={newRegion.regionName}
                  onChange={(e) =>
                    setNewRegion({ ...newRegion, regionName: e.target.value })
                  }
                />
              </p>
              <p>
                <strong>Country:</strong>{" "}
                <input
                  type="text"
                  value={newRegion.countryName}
                  onChange={(e) =>
                    setNewRegion({ ...newRegion, countryName: e.target.value })
                  }
                />
              </p>
              <div className="add-room-container">
                <button
                  className="add-room cancel"
                  type="button"
                  onClick={() => setCreatingNewRegion(false)}
                >
                  <span>Cancel</span>
                </button>
                <button className="add-room">
                  <span>Done</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="title">Rooms</h3>
        {rooms.map((room, index) => (
          <div key={index} className="room">
            <i
              className="fa fa-trash"
              onClick={() => handleRemoveRoom(index)}
            ></i>
            <p>
              <strong>Type:</strong> {room.roomType}
            </p>
            <p>
              <strong>Name:</strong> {room.roomName}
            </p>
            <p>
              <strong>Capacity:</strong> {room.capacity}
            </p>
            <p>
              <strong>Base Price:</strong> ${room.basePrice}
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
              <select ref={roomTypeRef}>
                <option value="">-- Select Room Type --</option>
                {roomTypes.map(({ roomId, roomType, roomName }, i) => (
                  <option value={roomId}>
                    {roomName}, {roomType}
                  </option>
                ))}
              </select>
            </p>
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
              <input ref={basePriceRef} type="number" step="0.01" required />
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

      <div className="save-hotel-wrap">
        <button className="save-hotel" onClick={handleCreateHotel}>
          <span>Save Hotel</span>
        </button>
      </div>
    </div>
  );
}

export default NewHotel;
