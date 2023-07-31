/** @format */

import React from "react";
import logo  from "../../assets/OmniBotRoundedCorners.png";

const Header = () => {
  return (
    <nav
      className="navbar navbar-dark-work"
      aria-label="omni-bot-navbar">
      <div className="container-fluid">
        <div id="omni-bot-navbar">
          <ul className="navbar-nav justify-content-center">
            <li className="nav-item">
              <span className="text" aria-current="page">
                <img
                  src={logo}
                  width="38"
                  height="38"
                  className="me-3"
                  alt="Omni-Bot Logo"></img>
                Welcome to the Best Learning Experience Ever with OmniBot.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
