import React, { useState, useEffect } from "react";
import "./Profile.css";
import Error from "../UI/Error";

const Profile = () => {
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(null);

  const handleCloseError = () => {
    setError(null);
  };

  const [fields, setFields] = useState([
    { id: 1, label: "Name", name: "name", type: "text", value: "" },
    { id: 2, label: "Surname", name: "surname", type: "text", value: "" },
    { id: 3, label: "Email", name: "email", type: "email", value: "" },
    { id: 4, label: "Phone number", name: "number", type: "phone", value: "" },
  ]);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userEmail = localStorage.getItem("userEmail");
      const userPassword = localStorage.getItem("userPassword");
      console.log(userEmail);
      if (!userEmail || !userPassword) {
        setError({
          title: "Login error",
          message: "No logged-in user found.",
        });
        return;
      }

      try {
        const response = await fetch("http://localhost:3002/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail, password: userPassword }),
        });

        if (!response.ok) {
          setError({
            title: "Problems with backend",
            message: "Failed to fetch user data",
          });
          return;
        }

        const data = await response.json();
        console.log("Fetched user:", data.user);

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
      </div>
    </div>
  );
};

export default Profile;
