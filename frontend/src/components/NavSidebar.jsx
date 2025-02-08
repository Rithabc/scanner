import React, { useContext } from "react";
import { useState } from "react";
import { AuthContext } from "../auth/AuthProvider";
import {useNavigate} from 'react-router-dom';

export default function NavSidebar({ children }) {
  const [tabs, setTabs] = useState([0, 0, 0, 0]);

  const {logout} = useContext(AuthContext);
    const navigate = useNavigate();
  const handleLogout = () => {
    
    logout();
    navigate('/login');
  }
  

  return (
    <div className="drawer drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-start ">
        {/* Page content here */}
        {children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu rounded-box w-56">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href='/scanner'>Scanner</a>
          </li>
          <li>
            <details close="true">
              <summary>Account</summary>
                <ul>
                    <li>
                      <a onClick={() => handleLogout()} className="hover:bg-red-400">Log Out</a>
                    </li>
                    <li>
                      <a >Submenu 2</a>
                    </li>
                    </ul>
            </details>
          </li>
          
        </ul>
      </div>
    </div>
  );
}
