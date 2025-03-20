import React, { useState, useEffect } from "react";
import "./Profile.css";
import Profile from "./Profile";

const Account = () => {
  return (
    <section className="dsa">
      <div className="account-container">
        <div className="functions-container">
          <div>
            <h2 className="account__title">Account</h2>
            <ol>
              <li className="active">
                <i className="fa fa-user"></i>
                My profile
              </li>
              <li>
                <i className="fa fa-suitcase"></i>
                Your trips
              </li>
              <li>
                <i className="fa fa-history"></i>
                Viewed tours
              </li>
              <li>
                <i className="fa fa-cog"></i>
                Settings
              </li>
            </ol>
          </div>
          <div>
            <Profile></Profile>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Account;
