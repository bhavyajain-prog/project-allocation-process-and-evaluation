import React from "react";
import logo from "../assets/logo.jpg";

const Header = () => {
  return (
    <div>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
    </div>
  );
};

export default Header;
