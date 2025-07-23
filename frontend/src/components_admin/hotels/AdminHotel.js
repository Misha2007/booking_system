import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useHotelById from "../hooks/useHotelById";
import Sidebar from "./Sidebar";
import AddImage from "./AddImage";
import "./AdminHotel.css";
import HotelInfo from "./HotelInfo";

function AdminHotel() {
  const navigate = useNavigate();
  const { hotelId } = useParams();

  const { hotel, loading, error } = useHotelById(hotelId);

  const [imageTarget, setImageTarget] = useState("hotel");
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [openSection, setOpenSection] = useState("HotelInfo");

  const setOpenSectionFunction = (data) => {
    setOpenSection(data);
  };

  if (loading) {
    return (
      <div className="admin-hotel-panel">
        <div id="admin-hotel-wrap">
          <p className="loading">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-hotel-panel">
        <div id="admin-hotel-wrap">
          <p className="error">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  const handleRoomChange = (e) => {
    setSelectedRoomId(e.target.value);
  };

  const handleImageTargetChange = (e) => {
    setImageTarget(e.target.value);
  };

  return (
    <div className="admin-hotel-panel">
      <div id="admin-hotel-wrap">
        <Sidebar
          setOpenSection={setOpenSectionFunction}
          openSection={openSection}
        />
        <div className="hotel-info-wrap">
          <div className="close">
            <i
              className="fa fa-close"
              onClick={() => navigate("/admin/hotels")}
            ></i>
          </div>
          <h1>Admin Panel - Hotel Details</h1>
          {openSection === "HotelInfo" && <HotelInfo />}
          {openSection === "checkDates" && <p>Coming soon...</p>}
          {openSection === "AddImage" && (
            <div id="image-upload">
              <AddImage
                target={imageTarget}
                hotelId={hotelId}
                roomId={selectedRoomId}
              />
              <div className="field">
                <label>Hotel Name:</label>
                <select value={hotel.name} onChange={() => {}}>
                  <option value={hotel.name}>{hotel.name}</option>
                </select>
              </div>
              <div className="field">
                <label>Choose Image Target:</label>
                <select value={imageTarget} onChange={handleImageTargetChange}>
                  <option value="hotel">Hotel</option>
                  <option value="room">Room</option>
                </select>
              </div>
              {imageTarget === "room" && (
                <div className="field">
                  <label>Select Room:</label>
                  <select onChange={handleRoomChange} value={selectedRoomId}>
                    <option value="" disabled>
                      Select a room
                    </option>
                    {hotel.roomInfos.map((room) => (
                      <option key={room.id} value={room.roomId}>
                        {room.room.roomType} - {room.room.roomName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <button>Submit</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminHotel;
