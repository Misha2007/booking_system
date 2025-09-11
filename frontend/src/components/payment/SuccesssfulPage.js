import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const SuccessfulPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const createTrip = async () => {
      const bookingData = JSON.parse(localStorage.getItem("pendingBooking"));
      const token = localStorage.getItem("authToken");

      if (!bookingData || !token) return;

      try {
        const response = await fetch(`${REACT_APP_API_URL}trips/create`, {
          method: "POST",
          body: JSON.stringify(bookingData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          setError({
            title: "Problems with backend",
            message: errorMessage || "Invalid data.",
          });
          return;
        }

        // Optionally clear after success
        localStorage.removeItem("pendingBooking");
      } catch (error) {
        setError({
          title: "Server Unreachable",
          message: "Failed to create a trip, please try again later.",
        });
      }
    };

    createTrip();
  }, []);

  return (
    <div className="payment-success-container">
      <div className="success-box">
        <div className="checkmark-icon">&#10004;</div>
        <h1>Payment Successful</h1>
        <p>Your payment has been processed successfully.</p>
        <button className="go-home-btn" onClick={() => navigate("/")}>
          Go to Home
        </button>
        {error && (
          <div className="error-message">
            <h3>{error.title}</h3>
            <p>{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessfulPage;
