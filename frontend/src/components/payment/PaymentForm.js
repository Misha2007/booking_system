import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import "./Payment.css";

const REACT_APP_FRONT_URL = process.env.REACT_APP_FRONT_URL;

const PaymentForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

    setIsProcessing(true);
    console.log(REACT_APP_FRONT_URL);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements, // this includes the PaymentElement input
      confirmParams: {
        return_url: `${REACT_APP_FRONT_URL}payment-success`,
      },
    });

    setIsProcessing(false);

    if (error) {
      setErrorMessage(error.message);
    } else if (paymentIntent?.status === "succeeded") {
      console.log("Payment successful!", paymentIntent);
    }
  };

  const appearance = {
    theme: "stripe",

    variables: {
      colorPrimary: "#0570de",
      colorBackground: "#ffffff",
      colorText: "#30313d",
      colorDanger: "#df1b41",
      fontFamily: "Ideal Sans, system-ui, sans-serif",
      spacingUnit: "2px",
      borderRadius: "4px",
      // See all possible variables below
    },
  };

  return (
    <div className="payment-form-container">
      <form onSubmit={handleSubmit} className="payment-form">
        {/* Render the PaymentElement to handle different payment methods */}
        <PaymentElement />
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
        <button disabled={!stripe || isProcessing}>
          {isProcessing ? "Processing…" : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
