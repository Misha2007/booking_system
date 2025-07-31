import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useHotelById from "../hooks/useHotelById";
import "./AdminMain.css";

function AdminMain() {
  const navigate = useNavigate();
  const { hotelId } = useParams();

  const [openSection, setOpenSection] = useState("HotelInfo");

  const setOpenSectionFunction = (data) => {
    setOpenSection(data);
  };

  //   if (error) {
  //     return (
  //       <div className="admin-hotel-panel">
  //         <div id="admin-hotel-wrap">
  //           <p className="error">Error: {error.message}</p>
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <div className="admin-hotel-panel">
      <div id="admin-hotel-wrap">
        <div className="hotel-info-wrap">
          <h1>Admin Panel</h1>
          <div id="admin-sections">
            <div className="section">
              <h1>3</h1>
              <h3>
                <i className="fa fa-users"></i>
                Users
              </h3>
              <button
                className="section-btn"
                onClick={() => navigate("/admin/create-user")}
              >
                Create new user
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminMain;
