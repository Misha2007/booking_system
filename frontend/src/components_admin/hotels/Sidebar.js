import data_file from "../../data.json";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AdminHotel.css";

function Sidebar(props) {
  const params = useParams();
  const [hotel, setHotel] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hotelId, setHotelId] = useState(params.hotelId);
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("authToken");
  const newHotel = props.newHotel;

  const sections = [
    {
      key: "HotelInfo",
      label: "Hotel Details",
    },
    {
      key: "checkDates",
      label: "Check dates",
    },
    {
      key: "AddImage",
      label: "Add images",
    },
    {
      key: "Gallery",
      label: "Gallery",
    },
  ];

  useEffect(() => {
    if (!storedToken) {
      navigate("/login");
    }
  }, []);

  return (
    <div id="admin-hotel-wrap" className="sidebar">
      <div className="sidebar-details">
        {sections.map((section) =>
          newHotel ? (
            <h2
              key={section.key}
              className={props.openSection === section.key ? "main" : ""}
              onClick={() => props.setOpenSection(section.key)}
              style={{ cursor: "pointer" }}
            >
              {section.label}
            </h2>
          ) : (
            <>
              {section.key === "HotelInfo" && (
                <h2
                  key={section.key}
                  className={props.openSection === section.key ? "main" : ""}
                  onClick={() => props.setOpenSection(section.key)}
                  style={{ cursor: "pointer" }}
                >
                  {section.label}
                </h2>
              )}
            </>
          )
        )}
      </div>
    </div>
  );
}

export default Sidebar;
