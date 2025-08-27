const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
router.post("/", async (req, res) => {
  try {
    const { title, content, category, imageUrl, user } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: "Title, content, and category are required" });
    }

    const newArticle = new Article({
      title,
      content,
      category,
      imageUrl,
      user,
    });

    await newArticle.save();

    res.status(201).json({
      message: "Article created successfully",
      article: newArticle,
    });
  } catch (err) {
    console.error("Error creating article:", err);
    res.status(500).json({ message: "Server error" });
  }
});
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
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedArticle = await Article.findByIdAndDelete(id);

    if (!deletedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({
      message: "Article deleted successfully",
      article: deletedArticle,
    });
  } catch (err) {
    console.error("Error deleting article:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
