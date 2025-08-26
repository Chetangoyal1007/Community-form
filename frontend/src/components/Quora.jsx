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
        <div className="quora__content">
          <Sidebar
            onCategoryClick={handleCategoryClick}
            selectedCategory={selectedCategory}
          />
          <Feed
            selectedCategory={selectedCategory}
            questions={Array.isArray(questions) ? questions : []}
          />
          <Widget />
        </div>
      </div>
    </div>
  );
}

export default Quora;
