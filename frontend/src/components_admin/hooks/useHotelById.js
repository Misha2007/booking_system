import { useState, useEffect } from "react";
import data_file from "../../data.json";
import { useNavigate } from "react-router-dom";

export default function useHotelById({ route, method, enabled = true }) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("authToken");

  useEffect(() => {
    console.log(!!enabled);
    if (!enabled) return;

    const fetchData = async () => {
      if (!storedToken) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(
          `http://${data_file.ip}:${data_file.port}${route}`,
          {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("authToken");
            navigate("/login?error=Session expired. Please log in again.");
            return;
          } else if (res.status === 403) {
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

        setResponse(data || {});
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (route && method) {
      fetchData();
    }
  }, []);
  return { response, loading, error };
}
