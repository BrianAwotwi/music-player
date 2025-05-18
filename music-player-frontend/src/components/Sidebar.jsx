import { FiSearch } from "react-icons/fi";
import { LuLibraryBig } from "react-icons/lu";

import "./Sidebar.css";

const Sidebar = ({ setShowSearch, setShowLibrary }) => {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src="img/logo.PNG" alt="Logo" className="logo" />
        <h1 className="logo-text">Music Player</h1>
      </div>

      <div className="profile-container">
        <img src="img/profile.png" alt="Profile" className="profile-pic" />
        <h2 className="profile-name">User Name</h2>
      </div>

      <div className="sidebar-menu" onClick={setShowSearch}>
        <FiSearch className="sidebar-icon" title="Search" />
        <span className="search-text">Search</span>
      </div>

      <div className="sidebar-menu" onClick={setShowLibrary}>
        <LuLibraryBig className="sidebar-icon" title="Library" />
        <span className="library-text">Library</span>
      </div>
    </div>
  );
};

export default Sidebar;
