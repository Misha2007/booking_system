// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import React, { useEffect, useState } from "react";
// import PaymentForm from "./PaymentForm";

// // Your Stripe public key
// const PUBLIC_KEY =
//   "pk_test_51RHkRpFPHINHHKB8AQeEPiKO8KvBJpoBCJaaPCBDgaTeE7jNfIbi9Dk32e19IN8fdhgLlA3cnmCSrKRlC7KO46f10036mIBYlO";

// const stripePromise = loadStripe(PUBLIC_KEY);

// const PaymentPage = () => {
//   const [sessionId, setSessionId] = useState("");

//   useEffect(() => {
//     const fetchSessionId = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:3002/payment/create-checkout-session",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const { sessionId } = await response.json();
//         setSessionId(sessionId); // Store the session ID in state
//       } catch (error) {
//         console.error("Error fetching session ID:", error);
//       }
//     };

//     fetchSessionId();
//   }, []);

//   const handleRedirectToCheckout = async () => {
//     const stripe = await stripePromise;

//     // Redirect to the Stripe Checkout page using the session ID
//     const { error } = await stripe.redirectToCheckout({ sessionId });

//     if (error) {
//       console.error("Error redirecting to Checkout:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Complete Your Payment</h1>
//       {sessionId ? (
//         <button onClick={handleRedirectToCheckout}>Proceed to Payment</button>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default PaymentPage;

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import PaymentForm from "./PaymentForm";

// Your Stripe public key
const PUBLIC_KEY =
  "pk_test_51RHkRpFPHINHHKB8AQeEPiKO8KvBJpoBCJaaPCBDgaTeE7jNfIbi9Dk32e19IN8fdhgLlA3cnmCSrKRlC7KO46f10036mIBYlO";

const stripePromise = loadStripe(PUBLIC_KEY);

const PaymentPage = () => {
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const fetchSessionId = async () => {
      try {
        const response = await fetch(
          "http://localhost:3002/payment/create-checkout-session",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const { sessionId } = await response.json();
        setSessionId(sessionId); // Store the session ID in state
      } catch (error) {
        console.error("Error fetching session ID:", error);
      }
    };

    fetchSessionId();
  }, []);

  const handleRedirectToCheckout = async () => {
    const stripe = await stripePromise;

    // Redirect to the Stripe Checkout page using the session ID
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error("Error redirecting to Checkout:", error);
    }
  };

  return (
    <div>
      <h1>Complete Your Payment</h1>
      {sessionId ? (
        <button onClick={handleRedirectToCheckout}>Proceed to Payment</button>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PaymentPage;
