import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useHotelById from "../hooks/useHotelById";
import Sidebar from "./Sidebar";
import AddImage from "./AddImage";
import "./AdminHotel.css";
import HotelInfo from "./HotelInfo";
import Gallery from "./Gallery";

function AdminHotel() {
  const navigate = useNavigate();
  const { hotelId } = useParams();

  const { hotel, loading, error } = useHotelById(hotelId);

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
          {openSection === "AddImage" && <AddImage hotel={hotel} />}
          {openSection === "Gallery" && <Gallery hotelId={hotel.hotelId} />}
        </div>
      </div>
    </div>
  );
}

export default AdminHotel;
