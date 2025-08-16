import { Avatar } from "@material-ui/core";
import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  ChatBubbleOutlined,
  MoreHorizOutlined,
  RepeatOneOutlined,
  ShareOutlined,
  DeleteOutline,
} from "@material-ui/icons"; 
import React, { useState } from "react";
import "./css/Post.css";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import CloseIcon from "@material-ui/icons/Close";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ReactTimeAgo from "react-time-ago";
import api from "../api";
import ReactHtmlParser from "html-react-parser";
import { useSelector } from "react-redux";
import { selectUser } from "../feature/userSlice";

function LastSeen({ date }) {
  return (
    <div>
      <ReactTimeAgo date={new Date(date)} locale="en-US" timeStyle="round" />
    </div>
  );
}

function Post({ post }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const Close = <CloseIcon />;
  const user = useSelector(selectUser);

  const handleQuill = (value) => {
    setAnswer(value);
  };

  // Submit Answer
  const handleSubmit = async () => {
    if (post?._id && answer !== "") {
      const config = { headers: { "Content-Type": "application/json" } };
      const body = { answer, questionId: post?._id, user };
      await api
        .post("/api/answers", body, config)
        .then(() => {
          alert("Answer added successfully");
          setIsModalOpen(false);
          window.location.reload();
        })
        .catch((e) => console.log(e));
    }
  };

  // Delete Answer
  const handleDeleteAnswer = async (answerId) => {
    if (window.confirm("Are you sure you want to delete this answer?")) {
      try {
        await api.delete(`/api/answers/${answerId}`);
        alert("Answer deleted successfully");
        window.location.reload();
      } catch (error) {
        console.log(error);
        alert("Failed to delete answer");
      }
    }
  };

  // Delete Question
  const handleDeleteQuestion = async () => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await api.delete(`/api/questions/${post?._id}`);
        alert("Question deleted successfully");
        window.location.reload();
      } catch (error) {
        console.log(error);
        alert("Failed to delete question");
      }
    }
  };

  return (
    <div className="post">
      {/* User Info */}
      <div className="post__info">
        <Avatar src={post?.user?.photo} />
        <h4>{post?.user?.userName}</h4>
        <small><LastSeen date={post?.createdAt} /></small>

        {/* Delete Question Button (only owner) */}
        {user?.email === post?.user?.email && (
          <DeleteOutline
            style={{ cursor: "pointer", color: "red", marginLeft: "auto" }}
            onClick={handleDeleteQuestion}
          />
        )}
      </div>

      {/* Question Body */}
      <div className="post__body">
        <div className="post__question">
          <p>{post?.questionName}</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="post__btnAnswer"
          >
            Answer
          </button>

          {/* Answer Modal */}
          <Modal
            open={isModalOpen}
            closeIcon={Close}
            onClose={() => setIsModalOpen(false)}
            closeOnEsc
            center
            closeOnOverlayClick={false}
            styles={{ overlay: { height: "auto" } }}
          >
            <div className="modal__question">
              <h1>{post?.questionName}</h1>
              <p>
                asked by <span className="name">{post?.user?.userName}</span> on{" "}
                <span className="name">{new Date(post?.createdAt).toLocaleString()}</span>
              </p>
            </div>
            <div className="modal__answer">
              <ReactQuill
                value={answer}
                onChange={handleQuill}
                placeholder="Enter your answer"
              />
            </div>
            <div className="modal__button">
              <button className="cancle" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button onClick={handleSubmit} type="submit" className="add">
                Add Answer
              </button>
            </div>
          </Modal>
        </div>
        {post.questionUrl && <img src={post.questionUrl} alt="url" />}
      </div>

      {/* Footer */}
      <div className="post__footer">
        <div className="post__footerAction">
          <ArrowUpwardOutlined />
          <ArrowDownwardOutlined />
        </div>
        <RepeatOneOutlined />
        <ChatBubbleOutlined />
        <div className="post__footerLeft">
          <ShareOutlined />
          <MoreHorizOutlined />
        </div>
      </div>

      {/* Answers Count */}
      <p
        style={{
          color: "rgba(0,0,0,0.5)",
          fontSize: "12px",
          fontWeight: "bold",
          margin: "10px 0",
        }}
      >
        {post?.allAnswers.length} Answer(s)
      </p>

      {/* Answers Section */}
      <div
        style={{
          margin: "5px 0px 0px 0px ",
          padding: "5px 0px 0px 20px",
          borderTop: "1px solid lightgray",
        }}
        className="post__answer"
      >
        {post?.allAnswers?.map((_a) => (
          <div
            key={_a?._id}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              padding: "10px 5px",
              borderTop: "1px solid lightgray",
            }}
            className="post-answer-container"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#888",
                justifyContent: "space-between",
              }}
              className="post-answered"
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Avatar src={_a?.user?.photo} />
                <div style={{ margin: "0px 10px" }} className="post-info">
                  <p>{_a?.user?.userName}</p>
                  <span><LastSeen date={_a?.createdAt} /></span>
                </div>
              </div>

              {/* Delete Answer (owner only) */}
              {user?.email === _a?.user?.email && (
                <DeleteOutline
                  style={{ cursor: "pointer", color: "red" }}
                  onClick={() => handleDeleteAnswer(_a?._id)}
                />
              )}
            </div>

            <div className="post-answer">{ReactHtmlParser(_a?.answer)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Post;
