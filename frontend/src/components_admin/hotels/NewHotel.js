import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import data_file from "../../data.json";
import "./NewHotel.css";

function NewHotel() {
  const [regions, setRegions] = useState([]); // Regions data for selection
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [rooms, setRooms] = useState([]); // State to hold added rooms
  const [newRoom, setNewRoom] = useState(false);
  const [errors, setErrors] = useState({
    roomType: "",
    roomName: "",
    // Other fields...
  });

  const navigate = useNavigate();
  const storedToken = localStorage.getItem("authToken");

  // Form refs for hotel fields
  const nameInputRef = useRef();
  const locationInputRef = useRef();
  const availableRoomsInputRef = useRef();
  const hotelRatingInputRef = useRef();
  const priceInputRef = useRef();
  const imageInputRef = useRef();
  const regionSelectRef = useRef();

  // Room form refs
  const roomTypeInputRef = useRef();
  const roomNameInputRef = useRef();

  // Fetch regions data (for selecting country/region)
  useEffect(() => {
    if (!storedToken) {
      navigate("/login");
      return;
    }

    const fetchRegions = async () => {
      try {
        const response = await fetch(
          `http://${data_file.ip}:${data_file.port}/countries/all`, // Endpoint for fetching regions
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedToken}`,
            },
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
            navigate(
              "/login" +
                (errorData.message ? `?error=${errorData.message}` : "")
            );
            return;
          }
        }

        const data = await response.json();
        setRegions(data.regions); // Populate regions dropdown
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };

    fetchRegions();
  }, [navigate, storedToken]);

  // Handle image preview
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
      setShowImagePreview(true);
    }
  };

  // Handle adding rooms
  const handleAddRoom = () => {
    const roomType = roomTypeInputRef.current.value.trim();
    const roomName = roomNameInputRef.current.value.trim();

    if (!roomType || !roomName) {
      setErrors({
        roomType: roomType ? "" : "Room type is required",
        roomName: roomName ? "" : "Room name is required",
      });
      return;
    }

    // Check if the room already exists
    if (rooms.some((room) => room.roomName === roomName)) {
      alert("Room name already exists.");
      return;
    }

    setRooms((prevRooms) => [...prevRooms, { roomType, roomName }]);
    setErrors({ roomType: "", roomName: "" });
    roomTypeInputRef.current.value = "";
    roomNameInputRef.current.value = "";
    setNewRoom(false);
  };

  // Submit hotel form
  const submitHandler = async (event) => {
    event.preventDefault();

    const name = nameInputRef.current.value.trim();
    const location = locationInputRef.current.value.trim();
    const availableRooms = availableRoomsInputRef.current.value.trim();
    const hotelRating = hotelRatingInputRef.current.value.trim();
    const price = priceInputRef.current.value.trim();
    const image = imageUrl; // Image URL or file path
    const regionId = regionSelectRef.current.value;

    // Validate the main form fields
    if (
      !name ||
      !location ||
      !availableRooms ||
      !hotelRating ||
      !price ||
      !regionId
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Payload for hotel creation
    const payload = {
      name,
      location,
      availableRooms,
      hotelRating,
      price,
      image,
      regionId,
      rooms, // Include the added rooms
    };

    try {
      const response = await fetch(
        `http://${data_file.ip}:${data_file.port}/hotel/admin/create`, // Endpoint for creating hotel
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Hotel created successfully.");
        navigate("/hotels"); // Navigate to hotel list page
      } else {
        alert(result.message || "Failed to create hotel.");
      }
    } catch (error) {
      console.error("Error creating hotel:", error);
      alert("Server error.");
    }
  };

  return (
    <section className="hotel-section" id="hotel-block">
      <div className="hotel-container">
        <h2 id="hotel_title">Create Hotel</h2>
        <form onSubmit={submitHandler}>
          <div className="form-group">
            {/* Hotel Name */}
            <div className="input-container">
              <i className="fa fa-building"></i>
              <input
                type="text"
                id="name"
                name="name"
                placeholder=" "
                required
                ref={nameInputRef}
                aria-label="Hotel Name"
              />
              <label htmlFor="name">Hotel Name</label>
            </div>

            {/* Location */}
            <div className="input-container">
              <i className="fa fa-map-marker"></i>
              <input
                type="text"
                id="location"
                name="location"
                placeholder=" "
                required
                ref={locationInputRef}
                aria-label="Location"
              />
              <label htmlFor="location">Location</label>
            </div>

            {/* Available Rooms */}
            <div className="input-container">
              <i className="fa fa-bed"></i>
              <input
                type="number"
                id="availableRooms"
                name="availableRooms"
                placeholder=" "
                required
                ref={availableRoomsInputRef}
                aria-label="Available Rooms"
              />
              <label htmlFor="availableRooms">Available Rooms</label>
            </div>

            {/* Hotel Rating */}
            <div className="input-container">
              <i className="fa fa-star"></i>
              <input
                type="number"
                id="hotelRating"
                name="hotelRating"
                placeholder=" "
                min="0"
                max="5"
                required
                ref={hotelRatingInputRef}
                aria-label="Hotel Rating"
              />
              <label htmlFor="hotelRating">Hotel Rating (0-5)</label>
            </div>

            {/* Price */}
            <div className="input-container">
              <i className="fa fa-dollar-sign"></i>
              <input
                type="number"
                id="price"
                name="price"
                placeholder=" "
                required
                ref={priceInputRef}
                aria-label="Price per Night"
              />
              <label htmlFor="price">Price per Night</label>
            </div>

            {/* Hotel Image */}
            <div className="input-container">
              <i className="fa fa-image"></i>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                aria-label="Upload Hotel Image"
              />
              <label htmlFor="image">Hotel Image</label>
            </div>

            {/* Image Preview */}
            {showImagePreview && (
              <div className="image-preview">
                <img src={imageUrl} alt="Image Preview" />
                <button onClick={() => setShowImagePreview(false)}>
                  Remove Image
                </button>
              </div>
            )}

            {/* Region Select */}
            <div className="input-container">
              <i className="fa fa-cogs"></i>
              <select
                name="regionId"
                id="regionId"
                ref={regionSelectRef}
                required
                aria-label="Select Region"
              >
                <option value="">Select Region</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.countryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="room-section">
              <h3 className="rooms-add-title">
                Rooms Added
                <i
                  className="fa fa-plus-square"
                  onClick={() => setNewRoom(true)}
                ></i>
              </h3>

              <div className="added-rooms">
                {newRoom && (
                  <div className="room_container">
                    <span className="cancel-room-icon">
                      <i
                        className="fa fa-minus"
                        onClick={() => setNewRoom(false)}
                      ></i>
                    </span>

                    {/* Room Type */}
                    <div className="input-container">
                      <i className="fa fa-bed"></i>
                      <input
                        type="text"
                        id="roomType"
                        name="roomType"
                        placeholder=" "
                        required
                        ref={roomTypeInputRef}
                        aria-label="Room Type"
                      />
                      <label htmlFor="roomType">Room Type</label>
                      {errors.roomType && (
                        <span className="error">{errors.roomType}</span>
                      )}
                    </div>

                    {/* Room Name */}
                    <div className="input-container">
                      <i className="fa fa-hotel"></i>
                      <input
                        type="text"
                        id="roomName"
                        name="roomName"
                        placeholder=" "
                        required
                        ref={roomNameInputRef}
                        aria-label="Room Name"
                      />
                      <label htmlFor="roomName">Room Name</label>
                      {errors.roomName && (
                        <span className="error">{errors.roomName}</span>
                      )}
                    </div>

                    <div className="room_buttons">
                      <button
                        type="button"
                        onClick={() => setNewRoom(false)}
                        className="cancel-room-button"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddRoom}
                        className="add-room-button"
                      >
                        Add Room
                      </button>
                    </div>
                  </div>
                )}
                {rooms.length > 0 && (
                  <ul>
                    {rooms.map((room, index) => (
                      <li key={index}>
                        <div>
                          {room.roomType} - {room.roomName}
                        </div>
                        <i className="fa fa-minus"></i>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="hotel_button">
              Create Hotel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default NewHotel;
