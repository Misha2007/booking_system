import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Oops! Page not found.</p>
      <Link to={navigate(-1)}>Go back</Link>
    </div>
  );
};

export default NotFound;
