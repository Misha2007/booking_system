import { useState, useEffect } from "react";
import data_file from "../../data.json";
import { useNavigate } from "react-router-dom";

export default function useHotelById(hotelId) {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchHotel = async () => {
      if (!storedToken) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://${data_file.ip}:${data_file.port}/hotel-admin/${hotelId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
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
          throw new Error("Failed to fetch hotel");
        }

        setHotel(data.hotel || {});
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (hotelId) {
      fetchHotel();
    }
  }, [hotelId, navigate, storedToken]);

  return { hotel, loading, error };
}
