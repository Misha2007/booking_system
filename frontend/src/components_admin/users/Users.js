import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./Users.css";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

function Users() {
  const [clients, setClients] = useState(null);
  const [error, setError] = useState(null); // State for error messages
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const storedToken = localStorage.getItem("authToken");
  const navigate = useNavigate();

  // Handle redirects if no token is found
  useEffect(() => {
    if (!storedToken) {
      navigate("/login");
    } else {
      fetchUserData(); // Only fetch if token is present
    }
  }, [storedToken, navigate]);

  // Fetch user data from the server
  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `${REACT_APP_API_URL}user/admin/getAllUsers`,
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
      setClients(data);
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle delete user
  const handleDeleteSubmit = async (id) => {
    try {
      const response = await fetch(
        `${REACT_APP_API_URL}user/admin/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Remove the deleted user from the clients list by filtering
      setClients((prevClients) => ({
        ...prevClients,
        users: prevClients.users.filter((user) => user.clientId !== id),
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle adding or editing user
  const handleSubmit = (id) => {
    navigate(`/admin/${id ? `edit/${id}` : "create-user"}`);
  };

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter users based on the search term
  const filteredClients = clients?.users?.filter((user) => {
    return (
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="clients">
      <div className="clients__header">
        <input
          className="clients__search"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button
          className="clients__add-button"
          onClick={() => handleSubmit(null)}
        >
          <i className="fa fa-plus"></i> Add User
        </button>
      </div>
      <h2>All users</h2>
      {error && <div className="error">{error}</div>} {/* Error display */}
      <table className="clients__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients?.map((user) => (
            <tr key={user.clientId}>
              <td>{user.clientId}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName || "None"}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber || "None"}</td>
              <td>{user.password}</td>
              <td className="clients__actions">
                <button
                  className="icon-button edit"
                  onClick={() => handleSubmit(user.clientId)}
                >
                  <i className="fa fa-pencil" />
                </button>
                <button
                  className="icon-button delete"
                  onClick={() => handleDeleteSubmit(user.clientId)}
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

export default Users;
