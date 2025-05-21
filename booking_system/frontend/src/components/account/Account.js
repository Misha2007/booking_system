import React, { useState } from "react";
import "./Profile.css";
import Profile from "./Profile";
import FavouritedTrips from "./FavouritedTrips";
import Settings from "./Settings";
import YourTrips from "./YourTrips";

const Account = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "yourTrips":
        return <YourTrips />;
      case "favouritedTrips":
        return <FavouritedTrips />;
      case "viewedTours":
        return <p>Viewed tours content here</p>;
      case "settings":
        return <Settings />;
      default:
        return <Profile />;
    }
  };

  return (
    <section className="dsa">
      <div className="account-container">
        <div className="functions-container">
          <div className="tab-container">
            <h2 className="account__title">Account</h2>
            <ol>
              <li
                className={activeTab === "profile" ? "active" : ""}
                onClick={() => setActiveTab("profile")}
                style={{ cursor: "pointer" }}
              >
                <i className="fa fa-user"></i>
                My profile
              </li>
              <li
                className={activeTab === "yourTrips" ? "active" : ""}
                onClick={() => setActiveTab("yourTrips")}
                style={{ cursor: "pointer" }}
              >
                <i className="fa fa-suitcase"></i>
                Your trips
              </li>
              <li
                className={activeTab === "favouritedTrips" ? "active" : ""}
                onClick={() => setActiveTab("favouritedTrips")}
                style={{ cursor: "pointer" }}
              >
                <i className="fa fa-heart"></i>
                Favourited trips
              </li>
              <li
                className={activeTab === "viewedTours" ? "active" : ""}
                onClick={() => setActiveTab("viewedTours")}
                style={{ cursor: "pointer" }}
              >
                <i className="fa fa-history"></i>
                Viewed tours
              </li>
              <li
                className={activeTab === "settings" ? "active" : ""}
                onClick={() => setActiveTab("settings")}
                style={{ cursor: "pointer" }}
              >
                <i className="fa fa-cog"></i>
                Settings
              </li>
            </ol>
          </div>
          <div>{renderContent()}</div>
        </div>
      </div>
    </section>
  );
};

export default Account;
