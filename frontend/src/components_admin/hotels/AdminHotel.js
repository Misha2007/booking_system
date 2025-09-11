import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useHotelById from "../hooks/useHotelById";
import Sidebar from "./Sidebar";
import AddImage from "./AddImage";
import "./AdminHotel.css";
import HotelInfo from "./HotelInfo";
import Gallery from "./Gallery";
import NewHotel from "./NewHotel";

function AdminHotel() {
  const navigate = useNavigate();
  const { hotelId } = useParams();
  const newHotel = !!hotelId;

  const { response, loading, error } = useHotelById({
    route: `hotel-admin/${hotelId}`,
    method: "GET",
    enabled: newHotel,
  });

  console.log(response, loading, error);

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
          newHotel={newHotel}
        />
        <div className="hotel-info-wrap">
          <div className="close">
            <i
              className="fa fa-close"
              onClick={() => navigate("/admin/hotels")}
            ></i>
          </div>
          <h1>Admin Panel - Hotel Details</h1>
          {newHotel ? (
            <>
              {openSection === "HotelInfo" && <HotelInfo />}
              {openSection === "checkDates" && <p>Coming soon...</p>}
              {openSection === "AddImage" && (
                <AddImage hotel={response ? response.hotel : ""} />
              )}
              {openSection === "Gallery" && (
                <Gallery hotelId={response ? response.hotel.hotelId : ""} />
              )}
            </>
          ) : (
            <NewHotel></NewHotel>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminHotel;
