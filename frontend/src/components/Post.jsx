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
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { selectUser } from "../feature/userSlice";

function LastSeen({ date }) {
  return (
    <ReactTimeAgo date={new Date(date)} locale="en-US" timeStyle="round" />
  );
}

// ✅ Answer Component with inline Voting (upVotes + downVotes)
function Answer({
  answer,
  user,
  handleDeleteAnswer,
  handleReplySubmit,
  handleVote,
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [reply, setReply] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const MAX_LENGTH = 200;
  const answerText = answer?.answer || "";
  const shouldTruncate = answerText.length > MAX_LENGTH;

  return (
    <div style={{ marginLeft: answer.parentAnswerId ? "30px" : "0px" }}>
      {/* Header with inline voting */}
      <div className="answer-header">
        <div className="answer-user">
          <Avatar src={answer?.user?.photo} />
          <div className="answer-user-info">
            <p>{answer?.user?.userName}</p>
            <span>
              <LastSeen date={answer?.createdAt} />
            </span>
          </div>
        </div>

        {/* Voting inline with user info */}
        <div className="vote-box-inline">
          <ArrowUpwardOutlined
            className="vote-btn"
            onClick={() => handleVote(answer._id, "answer", "up")}
          />
          <span className="vote-count">{answer.upVotes || 0}</span>
          <ArrowDownwardOutlined
            className="vote-btn"
            onClick={() => handleVote(answer._id, "answer", "down")}
          />
          <span className="vote-count">{answer.downVotes || 0}</span>
        </div>

        {user?.email === answer?.user?.email && (
          <DeleteOutline
            className="delete-icon"
            onClick={() => handleDeleteAnswer(answer?._id)}
          />
        )}
      </div>

      {/* Answer Text */}
      <div className="post-answer">
        {isExpanded || !shouldTruncate
          ? parse(answerText)
          : parse(answerText.substring(0, MAX_LENGTH) + "...")}
      </div>

      {/* Actions */}
      <div className="post-actions">
        {shouldTruncate && (
          <button
            type="button"
            className="read-more-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        )}

        <button
          type="button"
          className="reply-btn"
          onClick={() => setIsReplying(!isReplying)}
        >
          Reply
        </button>
      </div>

      {/* Reply Box */}
      {isReplying && (
        <div className="reply-box">
          <ReactQuill
            value={reply}
            onChange={setReply}
            placeholder="Write a reply..."
          />
          <button
            type="button"
            className="submit-reply"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              const cleanedReply = reply.replace(/<(.|\n)*?>/g, "").trim();
              if (!cleanedReply) {
                alert("Reply cannot be empty!");
                return;
              }
              handleReplySubmit(reply, answer._id);
              setIsReplying(false);
              setReply("");
            }}
          >
            Submit
          </button>
        </div>
      )}

      {/* Recursive Replies */}
      {answer.replies &&
        answer.replies.map((child) => (
          <Answer
            key={child._id}
            answer={child}
            user={user}
            handleDeleteAnswer={handleDeleteAnswer}
            handleReplySubmit={handleReplySubmit}
            handleVote={handleVote}
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

  // Submit new Answer
  const handleSubmit = async () => {
    const cleanedAnswer = answer.replace(/<(.|\n)*?>/g, "").trim();
    if (post?._id && cleanedAnswer !== "") {
      const body = {
        answer,
        questionId: post?._id,
        parentAnswerId: null,
        user,
      };
      try {
        await api.post("/api/answers", body, {
          headers: { "Content-Type": "application/json" },
        });
        alert("Answer added successfully");
        setIsModalOpen(false);
        window.location.reload();
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("Answer cannot be empty!");
    }
  };

  // Submit Reply
  const handleReplySubmit = async (reply, parentId) => {
    const cleanedReply = reply.replace(/<(.|\n)*?>/g, "").trim();
    if (!cleanedReply) {
      alert("Reply cannot be empty!");
      return;
    }
    const body = {
      answer: reply,
      questionId: post?._id,
      parentAnswerId: parentId,
      user,
    };
    try {
      await api.post("/api/answers", body, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Reply added successfully");
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  // Delete Answer
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

  // Delete Question
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

  // ✅ Vote Function
  const handleVote = async (id, type, direction) => {
    try {
      const body = {
        targetId: id,
        targetType: type,
        direction,
        userId: user?.email, // ✅ using email for uniqueness
      };

      await api.post("/api/votes", body, {
        headers: { "Content-Type": "application/json" },
      });
      window.location.reload(); // reload so updated counts show
    } catch (e) {
      console.log(e);
      alert("Voting failed");
    }
  };

  // Build nested tree
  const buildAnswerTree = (answers) => {
    const map = {};
    const roots = [];
    answers.forEach((a) => {
      map[a._id] = { ...a, replies: [] };
    });
    answers.forEach((a) => {
      if (a.parentAnswerId) map[a.parentAnswerId]?.replies.push(map[a._id]);
      else roots.push(map[a._id]);
    });
    return roots;
  };

  const nestedAnswers = buildAnswerTree(post?.allAnswers || []);

  return (
    <div className="post">
      {/* Question Info with inline votes */}
      <div className="post__info">
        <div className="post-user">
          <Avatar src={post?.user?.photo} />
          <h4>{post?.user?.userName}</h4>
          <small>
            <LastSeen date={post?.createdAt} />
          </small>
        </div>

        <div className="vote-box-inline">
          <ArrowUpwardOutlined
            className="vote-btn"
            onClick={() => handleVote(post._id, "question", "up")}
          />
          <span className="vote-count">{post.upVotes || 0}</span>
          <ArrowDownwardOutlined
            className="vote-btn"
            onClick={() => handleVote(post._id, "question", "down")}
          />
          <span className="vote-count">{post.downVotes || 0}</span>
        </div>

        {user?.email === post?.user?.email && (
          <DeleteOutline
            className="delete-icon"
            onClick={handleDeleteQuestion}
          />
        )}
      </div>

      {/* Question Body */}
      <div className="post__body">
        <div className="post__question">
          <p>{post?.questionName}</p>
          <button
            type="button"
            className="post__btnAnswer"
            onClick={() => setIsModalOpen(true)}
          >
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
                <span className="name">
                  {new Date(post?.createdAt).toLocaleString()}
                </span>
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
              <button
                type="button"
                className="cancle"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button type="button" className="add" onClick={handleSubmit}>
                Add Answer
              </button>
            </div>
          </Modal>
        </div>
        {post.questionUrl && <img src={post.questionUrl} alt="url" />}
      </div>

      {/* Footer icons */}
      <div className="post__footer">
        <RepeatOneOutlined />
        <ChatBubbleOutlined />
        <div className="post__footerLeft">
          <ShareOutlined className="MuiSvgIcon-root" />
          <MoreHorizOutlined className="MuiSvgIcon-root" />
        </div>
      </div>

      {/* Answers */}
      <p className="answers-count">{post?.allAnswers.length} Answer(s)</p>
      <div className="nested-answers">
        {nestedAnswers.map((ans) => (
          <Answer
            key={ans._id}
            answer={ans}
            user={user}
            handleDeleteAnswer={handleDeleteAnswer}
            handleReplySubmit={handleReplySubmit}
            handleVote={handleVote}
          />
        ))}
      </div>
    </div>
  );
}

export default Post;
