import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const got_error = location.state || "404";
  const got_error_message = location.state || "Page not found.";

  const { error, errorMessage } = location.state || {
    error: "404",
    errorMessage: "Page not found.",
  };

  // const [error, setError] = useState(got_error);
  // const [errorMessage, setErrorMessage] = useState(got_error_message);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="not-found">
      <h1>{error} error</h1>
      <p>Oops! {errorMessage}</p>
      <button className="go-back-button" onClick={handleGoHome}>
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
