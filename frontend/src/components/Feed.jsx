import React, { useState, useEffect } from "react";
import QuoraBox from "./QuoraBox";
import Post from "./Post";
import "./css/Feed.css";

function Feed({ questions }) {
  const [sortedQuestions, setSortedQuestions] = useState([]);
  const [showScrollArrow, setShowScrollArrow] = useState(false);

  // Sort questions by most recent
  useEffect(() => {
    const sorted = [...(questions || [])].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setSortedQuestions(sorted);
  }, [questions]);

  // Scroll event for arrow visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollArrow(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Callback to remove a deleted question from state
  const handleDeleteQuestion = (id) => {
    setSortedQuestions((prev) => prev.filter((q) => q._id !== id));
  };

  return (
    <div className="feed-container">
      <div className="left-sidebar">{/* Categories / Filters */}</div>

      <div className="feed-main">
        <QuoraBox />
        {sortedQuestions.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          sortedQuestions.map((post) => (
            <Post
              key={post._id}
              post={post}
              onDeleteQuestion={handleDeleteQuestion} // pass callback
            />
          ))
        )}
      </div>

      <div className="right-sidebar">{/* Optional right sidebar */}</div>

      {showScrollArrow && (
        <button className="scroll-to-top-arrow" onClick={scrollToTop}>
          ⬆
        </button>
      )}
    </div>
    
  );
}

export default Feed;
