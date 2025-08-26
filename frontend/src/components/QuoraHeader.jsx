import React, { useState, useRef } from "react";
import HomeIcon from "@material-ui/icons/Home";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import {
  AssignmentTurnedInOutlined,
  NotificationsOutlined,
  PeopleAltOutlined,
  Search,
} from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import { Avatar, Button, Tooltip, TextField, Menu, MenuItem } from "@material-ui/core";
import "./css/QuoraHeader.css";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import api from "../api";
import { auth } from "../Firebase";
import { signOut } from "firebase/auth";
import { logout, selectUser } from "../feature/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // ✅ import router hook

function QuoraHeader({ onHomeClick, onSearch,onQuestionAdded }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState("Public");

  const [searchInput, setSearchInput] = useState("");
  const searchTimeout = useRef(null);

  const navigate = useNavigate(); // ✅ navigation instance
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  // Search debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (onSearch) {
      searchTimeout.current = setTimeout(() => {
        onSearch(value);
      }, 300);
    }
  };

  const handleSubmit = async () => {
    if (question.trim() === "" || category.trim() === "") {
      alert("Please enter a question and select a category.");
      return;
    }

    const body = {
      questionName: question,
      questionUrl: inputUrl,
      category,
      visibility,
      user: {
        uid: user?.uid,
        displayName: user?.displayName,
        email: user?.email,
        photo: user?.photo,
      },
    };

    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const res = await api.post("/api/questions", body, config);
      alert(res.data.message);

      setQuestion("");
      setInputUrl("");
      setCategory("");
      setVisibility("Public");
      setIsModalOpen(false);
      if (onQuestionAdded) {
       onQuestionAdded();
     }
    } catch (e) {
      console.error(e);
      alert("Error posting question");
    }
  };


  // Avatar menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    handleMenuClose();
    signOut(auth)
      .then(() => {
        dispatch(logout());
      })
      .catch(() => console.log("Error logging out"));
  };
  const handleSwitchUser = () => {
    handleMenuClose();
    signOut(auth)
      .then(() => {
        dispatch(logout());
        // Optionally, redirect to login page or show login modal
        window.location.reload();
      })
      .catch(() => console.log("Error switching user"));
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
          <Tooltip title="Home" arrow>
            <div
              className="qHeader__icon"
              onClick={() => {
                if (onHomeClick) onHomeClick(); // ✅ reset to all posts
                navigate("/"); // ✅ navigate to home
              }}
            >
              <HomeIcon />
            </div>
          </Tooltip>

          <Tooltip title="Articles" arrow>
            <div
              className="qHeader__icon"
              onClick={() => navigate("/articles")} // ✅ navigate to articles
            >
              <DescriptionOutlinedIcon />
            </div>
          </Tooltip>

          <Tooltip title="Tasks" arrow>
            <div className="qHeader__icon">
              <AssignmentTurnedInOutlined />
            </div>
          </Tooltip>

          <Tooltip title="Spaces" arrow>
            <div className="qHeader__icon">
              <PeopleAltOutlined />
            </div>
          </Tooltip>

          <Tooltip title="Notifications" arrow>
            <div className="qHeader__icon">
              <NotificationsOutlined />
            </div>
          </Tooltip>
        </div>

        {/* Search */}
        <div className="qHeader__input">
          <Search />
          <input
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={handleSearchChange}
            style={{ width: "200px" }}
          />
        </div>

        {/* Right Section */}
        <div className="qHeader__Rem">
          <Tooltip title={user?.displayName || user?.email || "User"} arrow>
            <span onClick={handleAvatarClick} style={{ cursor: "pointer" }}>
              <Avatar alt={user?.displayName || user?.email || "User"}>
                {((user?.displayName && user.displayName[0].toUpperCase()) ||
                  (user?.email && user.email[0].toUpperCase()) ||
                  "U")}
              </Avatar>
            </span>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
            <MenuItem onClick={handleSwitchUser}>Switch User</MenuItem>
          </Menu>

          <Button onClick={() => setIsModalOpen(true)}>Add Question</Button>

          {/* Modal for Add Question */}
          <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} center>
            <div className="modal__title">
              <h5>Add Question</h5>
            </div>
            <div className="modal__info">
              <Avatar src={user?.photo} alt={user?.displayName || "User"} />
              <div className="modal__scope">
                <p>{visibility}</p>
              </div>
            </div>
            <div className="modal__field">
              <TextField
                fullWidth
                label="Your Question"
                variant="outlined"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <TextField
                fullWidth
                label="Category"
                variant="outlined"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ marginTop: "10px" }}
              />
              <TextField
                fullWidth
                label="Optional URL"
                variant="outlined"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                style={{ marginTop: "10px" }}
              />
            </div>
            <div className="modal__buttons">
              <Button onClick={handleSubmit} color="primary" variant="contained">
                Add
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default QuoraHeader;
