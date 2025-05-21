import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import data_file from "../../data.json";
import "./Settings.css";

const Settings = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (!storedToken) {
      navigate("/login");
      return;
    }
    setToken(storedToken);
  }, [navigate]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    // No switching functionality for now
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }
    setDeleting(true);
    setError(null);
    try {
      const response = await fetch(
        `http://${data_file.ip}:${data_file.port}/user/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        localStorage.removeItem("authToken");
        navigate("/login");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete account");
      }
    } catch (err) {
      setError("Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="favourited-trips-container">
      <h2 className="profile__title">Settings</h2>
      <div className="profile">
        <div className="settings-section">
          <h2 className="section-title">Language</h2>
          <select
            className="language-dropdown"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
          <p className="language-note">Language switching in the works</p>
        </div>
        <div className="settings-section">
          <button
            className="delete-account-text-button"
            onClick={handleDeleteAccount}
            disabled={deleting}
          >
            {deleting ? "Deleting Account..." : "Delete Account"}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Settings;
