import React from "react";
import logo from "./assets/logo.jpg";
import { Link } from "react-router-dom";

export default function AdminPortal() {
  return (
    <>
      <style>
        {`
          body {
            background-color: #f1f2f7;
          }
          .admin-portal {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 100px;
          }
          .admin {
            display: flex;
            justify-content: center;
            margin-top: 20px;
          }
          .logo {
            width: 55px;
            height: auto;
          }
          .tag h2 {
            font-size: 30px;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: 300;
            margin-top: 40px;
            margin-left: 42rem;
            color: #000;
          }
          .button-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
          }
          .btn {
            width: 155px;
            padding: 10px 0px;
            color: #FFFFFF;
            background-color: #00acac;
            border-radius: 5px;
            border: none;
            text-decoration: none;
            text-align: center;
            margin-top: 50px;
            font-size: 18px;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          .btn:hover {
            background-color: #008c8c;
          }
          @media (max-width: 768px) {
            .logo {
              width: 50px;
              margin-top: 80px;
            }
            .tag h2 {
              font-size: 24px;
              margin-top: 20px;
            }
            .button-group {
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
              font-size: 20px;
            }
            .button-group {
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
      <div className="admin">
        <img src={logo} alt="logo" className="logo" />
      </div>
      <div className="tag">
        <h2>Admin Portal</h2>
      </div>
      <div className="button-group">
        <Link className="btn" to="/mentorstatusadmin">
          Mentor Status
        </Link>
        <Link className="btn" to="/adminteamoverview">
          Team Status
        </Link>
        <Link className="btn" to="/documentapproval">
          Approve Docs
        </Link>
        <Link className="btn" to="/adminuploadsection">
          Upload docs
        </Link>
      </div>
    </>
  );
}
