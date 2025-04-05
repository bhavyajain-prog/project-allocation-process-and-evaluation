import React from "react";
import logo from "../assets/logo.jpg";

const Header = () => {
  return (
    <div style={{ backgroundColor: "#f1f2f7" }}>
      <div className="text-center">
        <img src={logo} alt="Logo" className="w-[55px] inline-block mt-4" />
      </div>
    </div>
  );
};

export default Header;
