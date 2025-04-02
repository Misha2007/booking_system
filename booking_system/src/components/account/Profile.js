import React, { useState, useEffect } from "react";
import "./Profile.css";
import Error from "../UI/Error";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleCloseError = () => {
    setError(null);
  };

  const [fields, setFields] = useState([
    { id: 1, label: "Name", name: "firstName", type: "text", value: "" },
    { id: 2, label: "Surname", name: "surname", type: "text", value: "" },
    { id: 3, label: "Email", name: "email", type: "email", value: "" },
    { id: 4, label: "Phone number", name: "number", type: "phone", value: "" },
  ]);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        navigate("/login");
        return null;
      }

      try {
        const response = await fetch("http://localhost:3002/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setError({
            title: "Problems with backend",
            message: "Failed to fetch user data",
          });
          return;
        }

        const data = await response.json();
        console.log("Fetched user:", data);
        setToken(token);


        setUserData(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!userData) return;

    setFields((prevFields) =>
      prevFields.map((field) => ({
        ...field,
        value: userData[field.name] || "",
      }))
    );
  }, [userData]);

  // Handle field changes
  const handleChange = (id, newValue) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, value: newValue } : field
      )
    );
  };

  const logoutHandler = () => {
    setToken("");
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="profile-container">
      {error && (
        <Error
          title={error.title}
          message={error.message}
          onConfirm={handleCloseError}
        />
      )}
      <h2 className="profile__title">Hei, user</h2>
      <div className="profile">
        <form>
          {fields.map((field) => (
            <div key={field.id} className="field">
              <label htmlFor={field.name}>{field.label}:</label>
              <input
                type={field.type}
                name={field.name}
                value={field.value}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            </div>
          ))}
          <button className="login_button">Edit</button>
        </form>
        <a onClick={logoutHandler}>Logout</a>
      </div>
    </div>
  );
};

export default Profile;
