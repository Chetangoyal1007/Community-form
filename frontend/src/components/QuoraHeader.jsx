import React, { useState } from "react";
import HomeIcon from "@material-ui/icons/Home";
import FeaturedPlayListOutlinedIcon from "@material-ui/icons/FeaturedPlayListOutlined";
import {
  AssignmentTurnedInOutlined,
  NotificationsOutlined,
  PeopleAltOutlined,
  Search,
  ExpandMore,
} from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import { Avatar, Button, Input } from "@material-ui/core";
import "./css/QuoraHeader.css";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import api from "../api";
import { auth } from "../Firebase";
import { signOut } from "firebase/auth";
import { logout, selectUser } from "../feature/userSlice";
import { useDispatch, useSelector } from "react-redux";

function QuoraHeader({ onHomeClick }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const Close = <CloseIcon />;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleSubmit = async () => {
    if (question.trim() !== "" && category.trim() !== "") {
      const config = { headers: { "Content-Type": "application/json" } };
      const body = {
        questionName: question,
        questionUrl: inputUrl,
        category: category,
        user: user,
      };

      try {
        const res = await api.post("/api/questions", body, config);
        alert(res.data.message);

        setQuestion("");
        setInputUrl("");
        setCategory("");
        setIsModalOpen(false);
      } catch (e) {
        console.error(e);
        alert("Error in adding question");
      }
    } else {
      alert("Please enter a question and select a category before submitting.");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      signOut(auth)
        .then(() => {
          dispatch(logout());
          console.log("Logged out");
        })
        .catch(() => console.log("Error in logout"));
    }
  };

  return (
    <div className="qHeader">
      <div className="qHeader-content">
        {/* Logo */}
        <div className="qHeader__logo">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/18/Wikipedia20_animated_Plane.gif"
            alt="logo"
          />
        </div>

        {/* Header Icons */}
        <div className="qHeader__icons">
          <div className="qHeader__icon" onClick={onHomeClick} style={{ cursor: "pointer" }}>
            <HomeIcon />
          </div>
          <div className="qHeader__icon">
            <FeaturedPlayListOutlinedIcon />
          </div>
          <div className="qHeader__icon">
            <AssignmentTurnedInOutlined />
          </div>
          <div className="qHeader__icon">
            <PeopleAltOutlined />
          </div>
          <div className="qHeader__icon">
            <NotificationsOutlined />
          </div>
        </div>

        {/* Search */}
        <div className="qHeader__input">
          <Search />
          <input type="text" placeholder="Search questions" />
        </div>

        {/* Right Section */}
        <div className="qHeader__Rem">
          <span onClick={handleLogout}>
            <Avatar src={user?.photo} alt={user?.displayName || "User"} />
          </span>
          <Button onClick={() => setIsModalOpen(true)}>Question</Button>

          {/* Modal */}
          <Modal
            open={isModalOpen}
            closeIcon={Close}
            onClose={() => setIsModalOpen(false)}
            closeOnEsc
            center
            closeOnOverlayClick={false}
            styles={{ overlay: { height: "auto" } }}
          >
            <div className="modal__title">
              <h5>Add Question</h5>
              <h5>Share Link</h5>
            </div>

            <div className="modal__info">
              <Avatar src={user?.photo} alt={user?.displayName || "User"} />
              <div className="modal__scope">
                <PeopleAltOutlined />
                <p>Public</p>
                <ExpandMore />
              </div>
            </div>

            <div className="modal__Field">
              <Input
                onChange={(e) => setQuestion(e.target.value)}
                value={question}
                type="text"
                placeholder="Start your question with 'What', 'How', 'Why', etc."
                fullWidth
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  margin: "10px 0",
                  padding: "10px",
                  border: "1px solid lightgray",
                  borderRadius: "5px",
                  outline: "none",
                  width: "100%",
                }}
              >
                <option value="">Select Category</option>
                <option value="Programming">History</option>
                <option value="Science">Business</option>
                <option value="Technology">Psychology</option>
                <option value="Business">Cooking</option>
                <option value="History">Music</option>
                <option value="Psychology">Psychology</option>
                <option value="Movies">Movies</option>
                <option value="Health">Health</option>
                <option value="Others">Others</option>
              </select>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  style={{
                    margin: "5px 0",
                    border: "1px solid lightgray",
                    padding: "10px",
                    outline: "none",
                  }}
                  placeholder="Optional: include a link that gives context"
                />
                {inputUrl && (
                  <img
                    style={{ height: "40vh", objectFit: "contain" }}
                    src={inputUrl}
                    alt="preview"
                  />
                )}
              </div>
            </div>

            <div className="modal__buttons">
              <button className="cancel" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button onClick={handleSubmit} type="submit" className="add">
                Add Question
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default QuoraHeader;
