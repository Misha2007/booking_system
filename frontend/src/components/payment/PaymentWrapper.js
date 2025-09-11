import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";
import { useLocation } from "react-router-dom";

const REACT_APP_PUBLIC_KEY = process.env.REACT_APP_PUBLIC_KEY;
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const stripePromise = loadStripe(REACT_APP_PUBLIC_KEY);

const PaymentWrapper = () => {
  const [clientSecret, setClientSecret] = useState(null);
  const location = useLocation();
  const { bookingData, user } = location.state || {};

  useEffect(() => {
    const fetchClientSecret = async () => {
      const response = await fetch(`${REACT_APP_API_URL}payment/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: user.email,
          bookingData: bookingData,
        }),
      });
      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    };

    fetchClientSecret();
  }, []);

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe", // or 'flat', 'night', 'none'
      variables: {
        colorPrimary: "#108740",
        colorBackground: "#ffffff",
        colorText: "#000",
        colorDanger: "#df1b41",
        fontFamily: "Arial, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
      rules: {
        ".Input": {
          padding: "12px",
        },
        ".Input:focus": {
          borderColor: "#635bff",
        },
        ".Tab": {
          border: "1px solid #ccc",
        },
        ".Tab:hover": {
          backgroundColor: "#f6f9fc",
        },
      },
    },
  };

  return clientSecret ? (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm clientSecret={clientSecret} />
    </Elements>
  ) : (
    <div>Loading payment form…</div>
  );
};

export default PaymentWrapper;
