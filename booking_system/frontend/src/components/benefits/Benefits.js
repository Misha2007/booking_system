import React from "react";
import "./Benefits.css"; // Create this if you want custom styles

const benefits = [
  {
    title: "Effortless Scheduling",
    description: "Book appointments in seconds with our intuitive and modern interface.",
  },
  {
    title: "Secure & Private",
    description: "Your data is protected with industry-leading security and privacy standards.",
  },
  {
    title: "24/7 Access",
    description: "Manage your bookings anytime, anywhere, from any device.",
  },
  {
    title: "Customizable Experience",
    description: "Tailor the system to fit your unique business needs and workflows.",
  },
];

const Benefits = () => (
  <div className="benefits-page">
    <h1 className="benefits-title">Why Choose Our Booking System?</h1>
    <div className="benefits-list">
      {benefits.map((benefit, idx) => (
        <div className="account-card" key={idx}>
          <h2 className="card-title">{benefit.title}</h2>
          <p className="card-description">{benefit.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Benefits;