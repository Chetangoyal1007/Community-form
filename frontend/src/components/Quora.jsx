import React, { useEffect, useState } from 'react';
import QuoraHeader from './QuoraHeader';
import Sidebar from './Sidebar';
import Feed from './Feed';
import Widget from './Widget';
import "./css/Quora.css";
import axios from 'axios';

function Quora() {
  const [questions, setQuestions] = useState([]);

  // Fetch questions (all or filtered) from backend
  const fetchQuestions = async (category = "") => {
    try {
      const res = await axios.get("/api/questions", {
        params: category ? { category } : {}
      });
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuestions(); // fetch all questions on mount
  }, []);

  const handleCategoryClick = (category) => {
    fetchQuestions(category);
  };

  return (
    <div className='quora'>         
      <QuoraHeader />
      <div className="quora__contents">
        <div className="quora__content">
          <Sidebar onCategoryClick={handleCategoryClick} />
          <Feed questions={questions} />
          <Widget />
        </div>
      </div>
    </div>
  );
}

export default Quora;
