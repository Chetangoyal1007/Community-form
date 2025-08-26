import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import Login from "./components/auth/Login";
import Quora from "./components/Quora";
import QuoraHeader from "./components/QuoraHeader";
import ArticlePage from "./components/ArticlePage";

import { login, logout, selectUser } from "./feature/userSlice";
import { auth } from "./Firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  // ✅ API base URL (local if available, else production)
  const API_BASE =
    import.meta.env.VITE_API_BASE ||
    "https://community-form-backend.onrender.com";

  // ✅ State for questions
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // ✅ Fetch questions (with optional category)
  const fetchQuestions = async (category = "") => {
    try {
      const params = category ? { category } : {};
      const response = await axios.get(`${API_BASE}/api/questions`, { params });

      // reverse so latest posts come first
      const data = Array.isArray(response.data)
        ? [...response.data].reverse()
        : [];
      setQuestions(data);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setQuestions([]);
    }
  };

  // ✅ Search handler
  const handleSearch = async (searchText) => {
    if (!searchText.trim()) {
      fetchQuestions(selectedCategory); // reload if empty search
      return;
    }
    try {
      const response = await axios.get(
        `${API_BASE}/api/questions/search?query=${encodeURIComponent(
          searchText
        )}`
      );
      if (response.data?.status && Array.isArray(response.data?.data)) {
        setQuestions(response.data.data.reverse());
      } else {
        setQuestions([]);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setQuestions([]);
    }
  };

  // ✅ Home button handler → just reset category
  const handleHomeClick = () => {
    setSelectedCategory("");
  };

  // ✅ Effect will always fetch based on category ("" = all posts)
  useEffect(() => {
    fetchQuestions(selectedCategory);
  }, [selectedCategory]);

  // ✅ Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        dispatch(
          login({
            userName: authUser.displayName,
            photo: authUser.photoURL,
            email: authUser.email,
            uid: authUser.uid,
          })
        );
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  // ✅ If no user, show login
  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      {/* ✅ Global header (always visible) */}
      <QuoraHeader
        onHomeClick={handleHomeClick}
        onSearch={handleSearch}
        onQuestionAdded={() => fetchQuestions(selectedCategory)}
      />

      <Routes>
        {/* ✅ Main feed */}
        <Route
          path="/"
          element={
            <Quora
              questions={questions}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              fetchQuestions={fetchQuestions}
            />
          }
        />

        {/* ✅ Articles page */}
        <Route path="/articles" element={<ArticlePage />} />

        {/* ✅ 404 fallback */}
        <Route path="*" element={<div>❌ Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
