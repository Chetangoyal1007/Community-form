

import React from "react";
import QuoraBox from "./QuoraBox";
import Post from "./Post";
import "./css/Feed.css";

function Feed({ questions }) {
  // Only show QuoraBox if not searching (i.e., all questions are shown)
  const showQuoraBox = true; // Set to false if you want to hide when searching
  return (
    <div className="feed">
      {showQuoraBox && <QuoraBox />}
      {Array.isArray(questions) && questions.length === 0 ? (
        <p>No posts found for this category.</p>
      ) : (
        (Array.isArray(questions) ? questions : []).map((post, index) => (
          <Post key={post._id || index} post={post} />
        ))
      )}
    </div>
  );
}

export default Feed;

