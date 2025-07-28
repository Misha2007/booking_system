import React, { useState, useEffect } from "react";
import "./Profile.css";
import Profile from "./Profile";
import FavouritedTrips from "./FavouritedTrips";
import Settings from "./Settings";
import YourTrips from "./YourTrips";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

const sections = [
  {
    key: "profile",
    icon: "fa-user",
    label: "My profile",
    component: <Profile />,
  },
  {
    key: "yourTrips",
    icon: "fa-suitcase",
    label: "Your trips",
    component: <YourTrips />,
  },
  {
    key: "favouritedTrips",
    icon: "fa-heart",
    label: "Favourited trips",
    component: <FavouritedTrips />,
  },
  {
    key: "settings",
    icon: "fa-cog",
    label: "Settings",
    component: <Settings />,
  },
];

const Account = () => {
  const isMobile = useIsMobile();
  const [openSection, setOpenSection] = useState("profile");

  // Always show profile by default on desktop
  useEffect(() => {
    if (!isMobile) setOpenSection("profile");
  }, [isMobile]);

  // Add menu-open class if a section is open on mobile
  const functionsContainerClass =
    "functions-container" + (isMobile && openSection ? " menu-open" : "");

  return (
    <section className="dsa">
      <div className="account-container">
        <div className={functionsContainerClass}>
          <div className="custom-list">
            <h2 className="account__title">Account</h2>
            <ol>
              {sections.map((section) => (
                <li
                  key={section.key}
                  className={
                    openSection === section.key
                      ? "active account-sections-container"
                      : "account-sections-container"
                  }
                  onClick={() =>
                    isMobile
                      ? setOpenSection(
                          openSection === section.key ? null : section.key
                        )
                      : setOpenSection(section.key)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <div>
                    <i className={`fa ${section.icon}`}></i>
                    {section.label}{" "}
                  </div>
                  {isMobile && (
                    <span className="chevron" style={{ marginLeft: "auto" }}>
                      {openSection === section.key ? "▲" : "▼"}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
          <div>
            {isMobile
              ? // Only show the open section's content on mobile
                sections.map(
                  (section) =>
                    openSection === section.key && (
                      <div key={section.key} className="open-section-card">
                        {section.component}
                      </div>
                    )
                )
              : // On desktop, show only the selected tab's content
                sections.map(
                  (section) =>
                    openSection === section.key && (
                      <div key={section.key}>{section.component}</div>
                    )
                )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Account;
