import { Avatar } from "@material-ui/core";
import {
  ThumbUpAltOutlined,
  ThumbUpAlt,
  ThumbDownAltOutlined,
  ThumbDownAlt,
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
  if (!date) return null; // ✅ prevent crash
  const validDate = new Date(date);
  if (isNaN(validDate)) return null; // ✅ prevent NaN error
  return <ReactTimeAgo date={validDate} locale="en-US" timeStyle="round" />;
}

// ✅ Answer Component with inline Voting
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
      {/* Header */}
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

        {/* Voting */}
        <div className="vote-box-inline">
          <button onClick={() => handleVote(answer._id, "answer", "up")}>
            {answer.userVote === "up" ? <ThumbUpAlt /> : <ThumbUpAltOutlined />}
          </button>
          <span className="vote-count">{answer.upVotes || 0}</span>
          <button onClick={() => handleVote(answer._id, "answer", "down")}>
            {answer.userVote === "down" ? (
              <ThumbDownAlt />
            ) : (
              <ThumbDownAltOutlined />
            )}
          </button>
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
            key={child._id} // ✅ unique key
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

function Post({ post: initialPost }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [post, setPost] = useState(initialPost);
  const user = useSelector(selectUser);

  const Close = <CloseIcon />;
  const handleQuill = (value) => setAnswer(value);

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

  // ✅ Add Answer
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
        const res = await api.post("/api/answers", body);
        alert("Answer added successfully");

        setPost((prev) => ({
          ...prev,
          allAnswers: [...prev.allAnswers, res.data],
        }));

        setIsModalOpen(false);
        setAnswer("");
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("Answer cannot be empty!");
    }
  };

  // ✅ Reply
  const handleReplySubmit = async (reply, parentId) => {
    const cleanedReply = reply.replace(/<(.|\n)*?>/g, "").trim();
    if (!cleanedReply) return alert("Reply cannot be empty!");
    const body = { answer: reply, questionId: post?._id, parentAnswerId: parentId, user };
    try {
      const res = await api.post("/api/answers", body);
      alert("Reply added successfully");

      setPost((prev) => ({
        ...prev,
        allAnswers: [...prev.allAnswers, res.data],
      }));
    } catch (e) {
      console.log(e);
    }
  };

  // ✅ Delete Answer
  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm("Delete this answer?")) return;
    try {
      await api.delete(`/api/answers/${answerId}`);
      setPost((prev) => ({
        ...prev,
        allAnswers: prev.allAnswers.filter((a) => a._id !== answerId),
      }));
    } catch (e) {
      console.log(e);
      alert("Failed to delete answer");
    }
  };

  // ✅ Delete Question
  const handleDeleteQuestion = async () => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await api.delete(`/api/questions/${post?._id}`);
      alert("Question deleted successfully");
      // TODO: navigate away instead of reload
    } catch (e) {
      console.log(e);
      alert("Failed to delete question");
    }
  };

  // ✅ Voting
  const handleVote = async (id, type, direction) => {
    try {
      const body = {
        targetId: id,
        targetType: type,
        direction,
        userId: user?.email,
      };

      const res = await api.post("/api/votes", body);

      // update state locally (no reload)
      if (type === "question") {
        setPost((prev) => {
          let upVotes = prev.upVotes || 0;
          let downVotes = prev.downVotes || 0;

          if (res.data.message === "Vote added") {
            if (direction === "up") upVotes++;
            else downVotes++;
          }
          if (res.data.message === "Vote switched") {
            if (direction === "up") {
              upVotes++;
              downVotes = Math.max(0, downVotes - 1);
            } else {
              downVotes++;
              upVotes = Math.max(0, upVotes - 1);
            }
          }

          return { ...prev, upVotes, downVotes, userVote: direction };
        });
      } else {
        setPost((prev) => {
          const updatedAnswers = prev.allAnswers.map((ans) => {
            if (ans._id !== id) return ans;
            let upVotes = ans.upVotes || 0;
            let downVotes = ans.downVotes || 0;

            if (res.data.message === "Vote added") {
              if (direction === "up") upVotes++;
              else downVotes++;
            }
            if (res.data.message === "Vote switched") {
              if (direction === "up") {
                upVotes++;
                downVotes = Math.max(0, downVotes - 1);
              } else {
                downVotes++;
                upVotes = Math.max(0, upVotes - 1);
              }
            }

            return { ...ans, upVotes, downVotes, userVote: direction };
          });
          return { ...prev, allAnswers: updatedAnswers };
        });
      }
    } catch (e) {
      console.log(e);
      alert("Voting failed");
    }
  };

  return (
    <div className="post">
      {/* Question Info */}
      <div className="post__info">
        <div className="post-user">
          <Avatar src={post?.user?.photo} />
          <h4>{post?.user?.userName}</h4>
          <small>
            <LastSeen date={post?.createdAt} />
          </small>
        </div>

        <div className="vote-box-inline">
          <button onClick={() => handleVote(post._id, "question", "up")}>
            {post.userVote === "up" ? <ThumbUpAlt /> : <ThumbUpAltOutlined />}
          </button>
          <span className="vote-count">{post.upVotes || 0}</span>
          <button onClick={() => handleVote(post._id, "question", "down")}>
            {post.userVote === "down" ? <ThumbDownAlt /> : <ThumbDownAltOutlined />}
          </button>
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

      {/* Footer */}
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
            key={ans._id} // ✅ unique key
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
