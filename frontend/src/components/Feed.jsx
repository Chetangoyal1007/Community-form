

// import React from "react";
// import QuoraBox from "./QuoraBox";
// import Post from "./Post";
// import "./css/Feed.css";

// function Feed({ questions }) {
//   // Only show QuoraBox if not searching (i.e., all questions are shown)
//   const showQuoraBox = true; // Set to false if you want to hide when searching
//   return (
//     <div className="feed">
//       {showQuoraBox && <QuoraBox />}
//       {Array.isArray(questions) && questions.length === 0 ? (
//         <p>No posts found for this category.</p>
//       ) : (
//         (Array.isArray(questions) ? questions : []).map((post, index) => (
//           <Post key={post._id || index} post={post} />
//         ))
//       )}
//     </div>
//   );
// }

// export default Feed;



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
      if (window.scrollY > 100) {
        setShowScrollArrow(true);
      } else {
        setShowScrollArrow(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="feed-container">
      {/* Left Sidebar */}
      <div className="left-sidebar">
        {/* Categories / Filters */}
      </div>

      {/* Main Feed */}
      <div className="feed-main">
        <QuoraBox />
        {sortedQuestions.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          sortedQuestions.map((post) => <Post key={post._id} post={post} />)
        )}
      </div>

      {/* Right Sidebar */}
      <div className="right-sidebar">
      </div>

      {/* Scroll-to-top arrow */}
      {showScrollArrow && (
        <button className="scroll-to-top-arrow" onClick={scrollToTop}>
          &uarr;
        </button>
      )}
    </div>
  );
}

export default Feed;
