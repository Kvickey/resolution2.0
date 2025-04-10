import React from "react";
// import "./Sidebar.css";
import "./Topbar.css";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { FaSearch } from "react-icons/fa";

const CommonTopbar = ({ isOpen }) => {
  const { user, logout } = useAuth();

  // console.log(user);

  return (
    <div>
      <div id="top-bar" className={`top-bar ${isOpen ? "" : "sideCollapse"}`}>
        <div class="TopNav">
          <div className="search-container">
            <div className="search-wrapper">
              <input
                type="text"
                className="search-bar"
                placeholder="Search..."
              />
              <span className=" search-icon">
                <FaSearch />
              </span>
            </div>
          </div>
          <div className="rightBox justify-content-end">
            <button className="button1" onClick={logout}>
              Logout
            </button>
          </div>
          {/* <div class="col-md-1 ps-5"></div> */}
          <div class="col-md-1 ps-5"></div>
        </div>
      </div>
    </div>
  );
};

export default CommonTopbar;
