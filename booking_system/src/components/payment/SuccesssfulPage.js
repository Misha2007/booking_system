const SuccessfulPage = () => {
  return (
    <div className="payment-success-container">
      <div className="success-box">
        <div className="checkmark-icon">&#10004;</div>
        <h1>Payment Successful</h1>
        <p>Your payment has been processed successfully.</p>
        <button className="go-home-btn">Go to Home</button>
      </div>
    </div>
  );
};

export default SuccessfulPage;
