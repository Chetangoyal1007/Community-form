import React from "react";
import Sidebar from "./Sidebar";
import Feed from "./Feed";
import Widget from "./Widget";
import "./css/Quora.css";

function Quora({ questions, selectedCategory, setSelectedCategory, fetchQuestions }) {
  const handleCategoryClick = (category) => {
    setSelectedCategory(category || "");
  };

  return (
    <div className="quora">
      <div className="quora__contents">
        <div className="quora__sidebar-left">
          <Sidebar
            onCategoryClick={handleCategoryClick}
            selectedCategory={selectedCategory}
          />
        </div>
        <div className="quora__main-feed">
          <Feed
            selectedCategory={selectedCategory}
            questions={Array.isArray(questions) ? questions : []}
          />
        </div>
        <div className="quora__sidebar-right">
          <Widget />
        </div>
      </div>
    </div>
  );
}

export default Quora;
