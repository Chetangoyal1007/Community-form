import React, { useEffect, useState } from "react";
import QuoraHeader from "./QuoraHeader";
import Sidebar from "./Sidebar";
import Feed from "./Feed";
import Widget from "./Widget";
import "./css/Quora.css";
import axios from "axios";

function Quora() {
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // default to all
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch questions from backend (optionally filtered by category)
  const fetchQuestions = async (category = "") => {
    setLoading(true);
    setError("");
    try {
      const params = category ? { category } : {};

      console.log("Fetching questions for category:", category || "All");

      const response = await axios.get(
        "https://community-form-backend.onrender.com/api/questions",
        { params }
      );

      setQuestions(
        response.data.reverse ? response.data.reverse() : response.data
      );
    } catch (err) {
      console.error(err);
      setError("Failed to fetch questions. Please try again.");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Search questions by text
  const handleSearch = async (searchText) => {
    if (!searchText.trim()) {
      fetchQuestions(selectedCategory);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://community-form-backend.onrender.com/api/questions/search?query=${encodeURIComponent(
          searchText
        )}`
      );

      if (response.data && response.data.status && response.data.data) {
        setQuestions(response.data.data);
      } else {
        setQuestions([]);
      }
    } catch (err) {
      setError("Failed to search questions. Please try again.");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions whenever selectedCategory changes
  useEffect(() => {
    fetchQuestions(selectedCategory);
  }, [selectedCategory]);

  // Update selected category when user clicks a category
  const handleCategoryClick = (category) => {
    setSelectedCategory(category || ""); // ensure always a string
  };

  // Reset to show all questions when Home is clicked
  const handleHomeClick = () => {
    setSelectedCategory("");
  };

  return (
    <div className="quora">
      <QuoraHeader 
  onHomeClick={handleHomeClick} 
  onSearch={handleSearch} 
  onQuestionAdded={() => fetchQuestions(selectedCategory)} // ✅ new prop
/>

      <div className="quora__contents">
        <div className="quora__sidebar-left">
          <Sidebar
            onCategoryClick={handleCategoryClick}
            selectedCategory={selectedCategory}
          />
        </div>
        <div className="quora__main-feed">
          {loading ? (
            <p>Loading questions...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <Feed
              selectedCategory={selectedCategory}
              questions={Array.isArray(questions) ? questions : []}
            />
          )}
        </div>
        <div className="quora__sidebar-right">
          <Widget />
        </div>
      </div>
    </div>
  );
}

export default Quora;
