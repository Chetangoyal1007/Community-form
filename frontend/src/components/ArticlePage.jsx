import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import api from "../api"; // ✅ Axios instance
import { useSelector } from "react-redux";
import { selectUser } from "../feature/userSlice";

function ArticlePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const user = useSelector(selectUser);

  // ✅ Fetch articles when component mounts or page changes
  useEffect(() => {
    fetchArticles(page);
  }, [page]);

  const fetchArticles = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/api/articles", {
        params: { page: pageNum, limit: 5 }, // ✅ backend should support pagination
      });

      setArticles(res.data.articles || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (e) {
      console.error("Error fetching articles", e);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Post a new article
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !category.trim()) {
      alert("Please fill all required fields");
      return;
    }

    const body = {
      title,
      content,
      category,
      imageUrl,
      user: {
        uid: user?.uid,
        displayName: user?.displayName,
        email: user?.email,
        photo: user?.photo,
      },
    };

    try {
      const res = await api.post("/api/articles", body, {
        headers: { "Content-Type": "application/json" },
      });

      alert(res.data.message || "Article published!");
      setTitle("");
      setContent("");
      setCategory("");
      setImageUrl("");
      setIsModalOpen(false);
      fetchArticles(1); // reload first page
    } catch (e) {
      console.error("Error posting article", e);
      alert("Error posting article");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Articles</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsModalOpen(true)}
        >
          Write Article
        </Button>
      </div>

      {/* Articles List */}
      <div style={{ marginTop: "20px" }}>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <CircularProgress />
            <Typography>Loading articles...</Typography>
          </div>
        ) : articles.length === 0 ? (
          <Typography>No articles found</Typography>
        ) : (
          articles.map((article) => (
            <Card key={article._id} style={{ marginBottom: "15px" }}>
              <CardContent>
                {/* User info */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={article.user?.photo}
                    style={{ marginRight: "10px" }}
                  />
                  <Typography variant="subtitle2">
                    {article.user?.displayName}
                  </Typography>
                </div>

                {/* Title */}
                <Typography variant="h5" style={{ margin: "10px 0" }}>
                  {article.title}
                </Typography>

                {/* Category */}
                <Typography variant="body2" color="textSecondary">
                  Category: {article.category}
                </Typography>

                {/* Optional Image */}
                {article.imageUrl && (
                  <img
                    src={article.imageUrl}
                    alt="article"
                    loading="lazy" // ✅ Lazy load images
                    style={{
                      width: "100%",
                      maxHeight: "250px",
                      objectFit: "cover",
                      marginTop: "10px",
                    }}
                  />
                )}

                {/* Content */}
                <Typography variant="body1" style={{ marginTop: "10px" }}>
                  {article.content}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination controls */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <Button
          variant="outlined"
          disabled={page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </Button>
        <Typography style={{ alignSelf: "center" }}>
          Page {page} of {totalPages}
        </Typography>
        <Button
          variant="outlined"
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>

      {/* Modal for Writing Article */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        center
        closeOnEsc
      >
        <h3>Write an Article</h3>
        <TextField
          label="Title"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ margin: "10px 0" }}
        />
        <TextField
          label="Category"
          fullWidth
          variant="outlined"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ margin: "10px 0" }}
        />
        <TextField
          label="Content"
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ margin: "10px 0" }}
        />
        <TextField
          label="Image URL (optional)"
          fullWidth
          variant="outlined"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          style={{ margin: "10px 0" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ marginTop: "10px" }}
        >
          Publish
        </Button>
      </Modal>
    </div>
  );
}

export default ArticlePage;
