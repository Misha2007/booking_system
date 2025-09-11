import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

function AdminHotels() {
  const [hotels, setHotels] = useState([]); // Default to an empty array
  const [error, setError] = useState(null); // State for error messages
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const storedToken = localStorage.getItem("authToken");
  const navigate = useNavigate();

  // Handle redirects if no token is found
  useEffect(() => {
    if (!storedToken) {
      navigate("/login");
    } else {
      fetchHotelData(); // Only fetch if token is present
    }
  }, [storedToken, navigate]);

  // Fetch hotel data from the server
  const fetchHotelData = async () => {
    try {
      const response = await fetch(`${REACT_APP_API_URL}hotels`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      });

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
        throw new Error("Failed to fetch hotels data");
      }

      const data = await response.json();

      // Check if data is an array before setting it to state
      setHotels(data.hotels);
    } catch (error) {
      setError(error.message); // Set error message if something goes wrong
    }
  };

  // Handle delete hotel
  const handleDeleteSubmit = async (id) => {
    try {
      const response = await fetch(`${REACT_APP_API_URL}hotels/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete hotel");
      }

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

      const data = await response.json();
      console.log(data);
      setHotels(data);
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle adding or editing hotel
  const handleSubmit = (id) => {
    navigate(`/admin/hotel/${id ? `edit/${id}` : "create"}`);
  };

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter hotels based on the search term
  const filteredHotels = hotels.filter((hotel) => {
    return (
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hotel.location &&
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      hotel.price.toString().includes(searchTerm) // Price as string
    );
  });

  return (
    <div className="clients">
      <div className="clients__header">
        <input
          className="clients__search"
          placeholder="Search by name, location, or price..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button
          className="clients__add-button"
          onClick={() => handleSubmit(null)} // Navigate to create page
        >
          <i className="fa fa-plus"></i> Add Hotel
        </button>
      </div>
      <h2>All Hotels</h2>
      {error && <div className="error">{error}</div>} {/* Error display */}
      <table className="clients__table">
        <thead>
          <tr>
            <th>Hotel ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Available Rooms</th>
            <th>Hotel Rating</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredHotels.map((hotel) => (
            <tr
              key={hotel.hotelId}
              onClick={() => {
                navigate(`/admin/hotel/${hotel.hotelId}`);
              }}
            >
              <td>{hotel.hotelId}</td>
              <td>{hotel.name}</td>
              <td>{hotel.location || "None"}</td>
              <td>{hotel.availableRooms || "None"}</td>
              <td>{hotel.hotelRating}</td>
              <td>{hotel.price ? `$${hotel.price}` : "None"}</td>
              <td className="clients__actions">
                <button
                  className="icon-button edit"
                  onClick={() => handleSubmit(hotel.hotelId)}
                >
                  <i className="fa fa-pencil" />
                </button>
                <button
                  className="icon-button delete"
                  onClick={() => handleDeleteSubmit(hotel.hotelId)}
                >
                  <i className="fa fa-trash" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminHotels;
