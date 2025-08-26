const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

// Get articles with pagination
router.get("/", async (req, res) => {
  try {
    let { page = 1, limit = 5 } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const skip = (page - 1) * limit;

    // Count total docs
    const totalArticles = await Article.countDocuments();

    // Fetch paginated docs (latest first)
    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalArticles / limit);

    res.status(200).json({
      articles,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ message: "Error fetching articles" });
  }
});

module.exports = router;
