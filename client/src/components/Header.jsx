import React, { useState, useEffect } from "react";
import { FaUserAlt, FaCaretDown, FaCaretUp } from "react-icons/fa";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const token = localStorage.getItem("token");

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleMyLeads = () => {
    setIsDropdownOpen(false);
    window.location.assign("/my-leads");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload(); // Refresh the page after logout
  };

  const handleNavigation = (path) => {
    setIsDropdownOpen(false);
    window.location.assign(path);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById("dropdown");
      if (dropdown && !dropdown.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div className="shadow-md sticky top-0 z-60 bg-white flex justify-between p-5">
        <div className="text-2xl">
          <button
            onClick={() => window.location.assign("/")}
            className="font-bold"
          >
            HomeMate
          </button>
        </div>
        <div className="flex space-x-10">
          <button onClick={handleToggleDropdown} className="relative">
            <FaUserAlt size={30} />
            {isDropdownOpen ? <FaCaretUp /> : <FaCaretDown />} {/* Indicator */}
          </button>
        </div>
      </div>

      {isDropdownOpen && (
        <div
          id="dropdown"
          className="absolute right-5 top-20 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50 transition-all duration-300 ease-in-out"
        >
          <div className="py-1">
            {token ? (
              <>
                <button
                  onClick={handleMyLeads}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                >
                  My Leads
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 transition-colors duration-200"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation("/register")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                >
                  Register
                </button>
                <button
                  onClick={() => handleNavigation("/login")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 transition-colors duration-200"
                >
                  Log In
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
