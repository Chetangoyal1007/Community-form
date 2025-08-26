import React, { useState, useRef, useEffect } from "react";
import HomeIcon from "@material-ui/icons/Home";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined"; // replaced FeaturedPlayListOutlinedIcon
import {
  AssignmentTurnedInOutlined,
  NotificationsOutlined,
  PeopleAltOutlined,
  Search,
  ExpandMore,
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

function QuoraHeader({ onHomeClick, onSearch, onQuestionAdded }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState("Public");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Search bar state
  const [searchInput, setSearchInput] = useState("");
  const searchTimeout = useRef(null);

  // Handle search input change
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

  const Close = <CloseIcon />;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleSubmit = async () => {
    if (question.trim() === "" || category.trim() === "") {
      alert("Please enter a question and select a category.");
      return;
    }

    const body = {
      questionName: question,
      questionUrl: inputUrl,
      category: category,
      visibility: visibility,
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

      // Reset modal fields
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
            <div className="qHeader__icon" onClick={onHomeClick}>
              <HomeIcon />
            </div>
          </Tooltip>

          <Tooltip title="Articles" arrow>
            <div className="qHeader__icon">
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

            {/* User Info and Visibility */}
            <div className="modal__info">
              <Avatar src={user?.photo} alt={user?.displayName || "User"} />
              <div
                className="visibility-dropdown"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "10px",
                  padding: "8px 15px",
                  borderRadius: "50px",
                  cursor: "pointer",
                  position: "relative",
                  minWidth: "130px",
                  justifyContent: "space-between",
                  background: visibility === "Public" ? "#e1f5fe" : "#fff3e0",
                  border: "1px solid #bdbdbd",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <PeopleAltOutlined
                    style={{
                      marginRight: "8px",
                      color: visibility === "Public" ? "#0277bd" : "#ef6c00",
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      fontWeight: "600",
                      color: visibility === "Public" ? "#0277bd" : "#ef6c00",
                    }}
                  >
                    {visibility}
                  </p>
                </div>
                <ExpandMore style={{ color: "#616161" }} />
                {isDropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50px",
                      left: 0,
                      background: "#fff",
                      border: "1px solid lightgray",
                      borderRadius: "10px",
                      width: "100%",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      zIndex: 10,
                    }}
                  >
                    {["Public", "Private"].map((option) => (
                      <div
                        key={option}
                        onClick={() => {
                          setVisibility(option);
                          setIsDropdownOpen(false);
                        }}
                        style={{
                          padding: "10px 12px",
                          cursor: "pointer",
                          background:
                            visibility === option ? "#e1f5fe" : "white",
                          color: option === "Public" ? "#0277bd" : "#ef6c00",
                          fontWeight: visibility === option ? "600" : "500",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#f1f1f1")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background =
                            visibility === option ? "#e1f5fe" : "white")
                        }
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Question Input */}
            <div className="modal__Field">
              <TextField
                onChange={(e) => setQuestion(e.target.value)}
                value={question}
                type="text"
                placeholder="Start your question with 'What', 'How', 'Why', etc."
                fullWidth
                variant="outlined"
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
                <option value="History">History</option>
                <option value="Business">Business</option>
                <option value="Psychology">Psychology</option>
                <option value="Cooking">Cooking</option>
                <option value="Music">Music</option>
                <option value="Science">Science</option>
                <option value="Health">Health</option>
                <option value="Movies">Movies</option>
                <option value="Technology">Technology</option>
                <option value="Education">Education</option>
              </select>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <TextField
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="Optional: include a link that gives context"
                  fullWidth
                  variant="outlined"
                  style={{ margin: "5px 0" }}
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

            {/* Modal Buttons */}
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
