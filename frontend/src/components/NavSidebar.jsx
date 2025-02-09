import React, { useContext } from "react";
import { useState } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function NavSidebar({ children }) {
  const [isOpened, setIsOpened] = useState(true);

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex w-screen h-screen">
      <div className="w-fit h-full bg-base-200 flex flex-col items-center justify-between">
        {isOpened && (
          <ul className="menu bg-base-200 rounded-box">
            <li>
              <a
                className="btn border-0"
                onClick={() => setIsOpened(!isOpened)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="inline-block h-6 w-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </a>
            </li>
            <li>
              <Link
                to={"/"}
                className="tooltip tooltip-right btn border-0"
                data-tip="Home"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </Link>
            </li>
            <li>
              <Link
                to={"/scanner"}
                className="tooltip tooltip-right btn border-0"
                data-tip="Scanner"
              >
                <svg
                  fill="#000000"
                  viewBox="0 0 35 35"
                  data-name="Layer 2"
                  id="a23c8b98-967c-4812-aeb3-60f34cc8eeab"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g id="SVGRepo_iconCarrier">
                    <path d="M30.559,33.805H4.441A4.2,4.2,0,0,1,.25,29.614V26.077a4.2,4.2,0,0,1,4.191-4.192H30.559a4.2,4.2,0,0,1,4.191,4.192v3.537A4.2,4.2,0,0,1,30.559,33.805ZM4.441,24.385A1.693,1.693,0,0,0,2.75,26.077v3.537a1.693,1.693,0,0,0,1.691,1.691H30.559a1.693,1.693,0,0,0,1.691-1.691V26.077a1.694,1.694,0,0,0-1.691-1.692Z" />
                    <path d="M27.929,29.345a1.5,1.5,0,0,0,0-3,1.5,1.5,0,0,0,0,3Z" />
                    <path d="M2.093,25.415a1.25,1.25,0,0,1-.883-2.133L22.931,1.561A1.25,1.25,0,1,1,24.7,3.329L2.977,25.049A1.246,1.246,0,0,1,2.093,25.415Z" />
                    <path d="M26.279,19.048h-9.51a1.25,1.25,0,1,1,0-2.5h9.51a1.25,1.25,0,0,1,0,2.5Z" />
                  </g>
                </svg>
              </Link>
            </li>
            <li>
              <a
                onClick={() => setIsOpened(!isOpened)}
                className="tooltip tooltip-right btn border-0"
                data-tip="Account"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </a>
            </li>
          </ul>
        )}

        {!isOpened && (
          <>
            <ul className="menu bg-base-200 rounded-box w-56">
              <li>
                <a
                  className="btn border-0 flex justify-end"
                  onClick={() => setIsOpened(!isOpened)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <g id="SVGRepo_iconCarrier">
                      <g id="Menu / Close_LG">
                        <path
                          id="Vector"
                          d="M21 21L12 12M12 12L3 3M12 12L21.0001 3M12 12L3 21.0001"
                          stroke="#000000"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </g>
                  </svg>
                </a>
              </li>

              <li>
                <Link to={"/"}>Home</Link>
              </li>
              <li>
                <Link to={"/scanner"}>Scanner</Link>
              </li>
              <li>
                <details>
                  <summary>Parent</summary>
                  <ul>
                    <li>
                      <a>Submenu 1</a>
                    </li>
                    <li>
                      <a>Submenu 2</a>
                    </li>
                    <li>
                      <details>
                        <summary>Parent</summary>
                        <ul>
                          <li>
                            <a>Submenu 1</a>
                          </li>
                          <li>
                            <a>Submenu 2</a>
                          </li>
                        </ul>
                      </details>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
          </>
        )}
       {!isOpened  ? <button onClick={handleLogout} className="btn border-0 bg-red-400 min-w-[80%] mb-2">Logout</button> : <a onClick={handleLogout} className="btn border-0 bg-red-400 mb-2 tooltip tooltip-right " data-tip="Logout"> <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      <path
        d="M15 12L2 12M2 12L5.5 9M2 12L5.5 15"
        stroke="#000000"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.00195 7C9.01406 4.82497 9.11051 3.64706 9.87889 2.87868C10.7576 2 12.1718 2 15.0002 2L16.0002 2C18.8286 2 20.2429 2 21.1215 2.87868C22.0002 3.75736 22.0002 5.17157 22.0002 8L22.0002 16C22.0002 18.8284 22.0002 20.2426 21.1215 21.1213C20.3531 21.8897 19.1752 21.9862 17 21.9983M9.00195 17C9.01406 19.175 9.11051 20.3529 9.87889 21.1213C10.5202 21.7626 11.4467 21.9359 13 21.9827"
        stroke="#000000"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </g>
  </svg></a>}

      </div>
      {children}
    </div>
  );
}
