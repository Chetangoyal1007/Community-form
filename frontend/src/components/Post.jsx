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

// LastSeen Component
function LastSeen({ date }) {
  return <ReactTimeAgo date={new Date(date)} locale="en-US" timeStyle="round" />;
}

// Recursive Answer Component
function Answer({ answer, user, handleDeleteAnswer, handleReplySubmit }) {
  const [isReplying, setIsReplying] = useState(false);
  const [reply, setReply] = useState("");

  return (
    <div style={{ marginLeft: answer.parentAnswerId ? "30px" : "0px" }}>
      <div className="answer-header">
        <div className="answer-user">
          <Avatar src={answer?.user?.photo} />
          <div className="answer-user-info">
            <p>{answer?.user?.userName}</p>
            <span><LastSeen date={answer?.createdAt} /></span>
          </div>
        </div>

        {user?.email === answer?.user?.email && (
          <DeleteOutline
            className="delete-icon"
            onClick={() => handleDeleteAnswer(answer?._id)}
          />
        )}
      </div>

      <div className="post-answer">{ReactHtmlParser(answer?.answer)}</div>

      <button
        className="reply-btn"
        onClick={() => setIsReplying(!isReplying)}
      >
        Reply
      </button>

      {isReplying && (
        <div className="reply-box">
          <ReactQuill
            value={reply}
            onChange={setReply}
            placeholder="Write a reply..."
          />
          <button
            onClick={() => {
              handleReplySubmit(reply, answer._id);
              setIsReplying(false);
              setReply("");
            }}
            className="submit-reply"
          >
            Submit Reply
          </button>
        </div>
      )}

      {answer.replies &&
        answer.replies.map((child) => (
          <Answer
            key={child._id}
            answer={child}
            user={user}
            handleDeleteAnswer={handleDeleteAnswer}
            handleReplySubmit={handleReplySubmit}
          />
        ))}
    </div>
  );
}

function Post({ post }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const Close = <CloseIcon />;
  const user = useSelector(selectUser);

  const handleQuill = (value) => setAnswer(value);

  const handleSubmit = async () => {
    if (post?._id && answer !== "") {
      const body = { answer, questionId: post?._id, parentAnswerId: null, user };
      try {
        await api.post("/api/answers", body, { headers: { "Content-Type": "application/json" } });
        alert("Answer added successfully");
        setIsModalOpen(false);
        window.location.reload();
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleReplySubmit = async (reply, parentId) => {
    if (!reply) return;
    const body = { answer: reply, questionId: post?._id, parentAnswerId: parentId, user };
    try {
      await api.post("/api/answers", body, { headers: { "Content-Type": "application/json" } });
      alert("Reply added successfully");
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) return;
    try {
      await api.delete(`/api/answers/${answerId}`);
      alert("Answer deleted successfully");
      window.location.reload();
    } catch (e) {
      console.log(e);
      alert("Failed to delete answer");
    }
  };

  const handleDeleteQuestion = async () => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await api.delete(`/api/questions/${post?._id}`);
      alert("Question deleted successfully");
      window.location.reload();
    } catch (e) {
      console.log(e);
      alert("Failed to delete question");
    }
  };

  const buildAnswerTree = (answers) => {
    const map = {};
    const roots = [];
    answers.forEach((a) => { map[a._id] = { ...a, replies: [] }; });
    answers.forEach((a) => {
      if (a.parentAnswerId) map[a.parentAnswerId]?.replies.push(map[a._id]);
      else roots.push(map[a._id]);
    });
    return roots;
  };

  const nestedAnswers = buildAnswerTree(post?.allAnswers || []);

  return (
    <div className="post">
      <div className="post__info">
        <Avatar src={post?.user?.photo} />
        <h4>{post?.user?.userName}</h4>
        <small><LastSeen date={post?.createdAt} /></small>
        {user?.email === post?.user?.email && (
          <DeleteOutline className="delete-icon" onClick={handleDeleteQuestion} />
        )}
      </div>

      <div className="post__body">
        <div className="post__question">
          <p>{post?.questionName}</p>
          <button className="post__btnAnswer" onClick={() => setIsModalOpen(true)}>
            Answer
          </button>
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
              <ReactQuill value={answer} onChange={handleQuill} placeholder="Enter your answer" />
            </div>
            <div className="modal__button">
              <button className="cancle" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="add" onClick={handleSubmit}>Add Answer</button>
            </div>
          </Modal>
        </div>
        {post.questionUrl && <img src={post.questionUrl} alt="url" />}
      </div>

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

      <p className="answers-count">{post?.allAnswers.length} Answer(s)</p>

      <div className="nested-answers">
        {nestedAnswers.map((ans) => (
          <Answer
            key={ans._id}
            answer={ans}
            user={user}
            handleDeleteAnswer={handleDeleteAnswer}
            handleReplySubmit={handleReplySubmit}
          />
        ))}
      </div>
    </div>
  );
}

export default Post;
