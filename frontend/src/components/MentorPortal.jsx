import React from "react";
import { Link } from "react-router-dom";
import logo from "./assets/logo.jpg";

const MentorPortal = () => {
  return (
    <>
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            background-color: #f1f2f7;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
          }

          .mentor {
            display: flex;
            justify-content: center;
          }

          .mentor > img {
            width: 55px;
            height: auto;
            margin-top: 120px;
          }

          .tag h2 {
            font-size: 30px;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: 300;
            margin-top: 40px;
          }

          .button {
            display: flex;
            flex-direction: column;
            gap: 15px;
            align-items: center;
          }

          .btn {
            width: 155px;
            height: 40px;
            color: #ffffff;
            background-color: #00acac;
            border-radius: 5px;
            border: none;
            margin-top: 50px;
            font-size: 18px;
            cursor: pointer;
          }

          button a {
            color: #ffffff;
            text-decoration: none;
          }

          /* Responsive Styles */
          @media (max-width: 768px) {
            .logo {
              width: 50px;
              margin-top: 80px;
            }

            .tag h2 {
              font-size: 24px;
              margin-top: 20px;
            }

            .button {
              gap: 10px;
            }

            .btn {
              width: 120px;
              height: 35px;
              font-size: 16px;
              margin-top: 30px;
            }
          }

          @media (max-width: 480px) {
            .logo {
              width: 50px;
            }

            .tag h2 {
              margin-top: 25px;
              font-size: 30px;
            }

            .button {
              gap: 10px;
            }

            .btn {
              width: 100%;
              height: 45px;
              font-size: 18px;
            }
          }
        `}
      </style>
      <div className="mentor">
        <img src={logo} alt="logo" className="logo" />
      </div>
      <div className="tag">
        <h2>Mentor Portal</h2>
      </div>
      <div className="button">
        <button className="btn">
          <Link to="/mentorteamselection">Team Selection</Link>
        </button>
        <button className="btn">
          <Link to="/mentordashboard">Dashboard</Link>
        </button>
        <button className="btn">
          <Link to="/documentapproval">Approve Docs</Link>
        </button>
      </div>
    </>
  );
};

export default MentorPortal;
