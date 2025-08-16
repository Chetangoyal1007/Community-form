
import React from "react";
import QuoraBox from "./QuoraBox";
import Post from "./Post";
import "./css/Feed.css";

function Feed({ questions }) {
  return (
    <div className="feed">
      <QuoraBox />
      {questions.length === 0 ? (
        <p>No posts found for this category.</p>
      ) : (
        questions.map((post, index) => (
          <Post key={post._id || index} post={post} />
        ))
      )}
    </div>
  );
}

export default Feed;

