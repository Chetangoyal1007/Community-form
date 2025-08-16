import React from "react";
import SidebarOptions from "./SidebarOptions";
import "./css/Sidebar.css";

function Sidebar({ onCategoryClick }) {
  return (
    <div className="sidebar">
      <SidebarOptions onCategoryClick={onCategoryClick} />
    </div>
  );
}

export default Sidebar;
