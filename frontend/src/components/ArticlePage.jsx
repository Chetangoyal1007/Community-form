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
        userName: user?.displayName || user?.email?.split("@")[0] || "Anonymous",
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

  // ✅ Delete Article
  const handleDelete = async (articleId) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    try {
      const res = await api.delete(`/api/articles/${articleId}`, {
        data: { uid: user?.uid }, // ✅ send user.uid for ownership check
      });

      alert(res.data.message);
      fetchArticles(page); // reload current page
    } catch (err) {
      console.error("Error deleting article", err);
      alert(err.response?.data?.message || "Error deleting article");
    }
  };

return (
  <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen text-white">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold tracking-wide">📰 Articles</h2>
      <Button
        variant="contained"
        onClick={() => setIsModalOpen(true)}
        style={{
          background: "linear-gradient(135deg, #4f46e5, #9333ea)",
          borderRadius: "12px",
          padding: "10px 20px",
          fontWeight: "600",
          textTransform: "none",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        }}
      >
        ✍️ Write Article
      </Button>
    </div>

    {/* Articles List */}
    <div>
      {loading ? (
        <div className="text-center mt-10">
          <CircularProgress style={{ color: "#9333ea" }} />
          <Typography className="mt-2 text-gray-300">Loading articles...</Typography>
        </div>
      ) : articles.length === 0 ? (
        <Typography className="text-center text-gray-400 mt-6">
          No articles found
        </Typography>
      ) : (
        articles.map((article) => (
          <Card
            key={article._id}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "20px",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              marginBottom: "20px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <CardContent>
              {/* User info + Delete */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar src={article.user?.photo} />
                  <Typography className="font-semibold text-sm text-gray-300">
                    {article.user?.userName || "Anonymous"}
                  </Typography>
                </div>
                {user?.uid === article.user?.uid && (
                  <Button
                    variant="outlined"
                    onClick={() => handleDelete(article._id)}
                    style={{
                      color: "#ef4444",
                      borderColor: "#ef4444",
                      textTransform: "none",
                      borderRadius: "10px",
                    }}
                  >
                    🗑 Delete
                  </Button>
                )}
              </div>

              {/* Title */}
              <Typography
                variant="h5"
                style={{ marginTop: "12px", fontWeight: "bold" }}
                className="text-white"
              >
                {article.title}
              </Typography>

              {/* Category */}
              <Typography className="text-xs text-gray-400 mt-1">
                Category: {article.category}
              </Typography>

              {/* Image */}
              {article.imageUrl && (
                <img
                  src={article.imageUrl}
                  alt="article"
                  loading="lazy"
                  className="w-full max-h-72 object-cover rounded-xl mt-3 shadow-md"
                />
              )}

              {/* Content */}
              <Typography className="mt-4 text-gray-200 leading-relaxed">
                {article.content}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </div>

    {/* Pagination */}
<div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "20px" }}>
  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
    <Button
      variant="outlined"
      disabled={page <= 1}
      onClick={() => setPage((prev) => prev - 1)}
      style={{
        borderRadius: "10px",
        borderColor: "#9333ea",
        color: "#9333ea",
        textTransform: "none",
        minWidth: "120px",
      }}
    >
      ⬅ Previous
    </Button>

    <span style={{ color: "#9CA3AF", fontSize: "16px", fontWeight: "500" }}>
      Page {page} of {totalPages}
    </span>

    <Button
      variant="outlined"
      disabled={page >= totalPages}
      onClick={() => setPage((prev) => prev + 1)}
      style={{
        borderRadius: "10px",
        borderColor: "#9333ea",
        color: "#9333ea",
        textTransform: "none",
        minWidth: "120px",
      }}
    >
      Next ➡
    </Button>
  </div>
</div>


    {/* Modal */}
    <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} center>
      <div className="p-4 w-[400px]">
        <h3 className="text-xl font-bold mb-4">✍️ Write an Article</h3>
        <TextField
          label="Title"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-3"
        />
        <TextField
          label="Category"
          fullWidth
          variant="outlined"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mb-3"
        />
        <TextField
          label="Content"
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-3"
        />
        <TextField
          label="Image URL (optional)"
          fullWidth
          variant="outlined"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="mb-3"
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          style={{
            background: "linear-gradient(135deg, #4f46e5, #9333ea)",
            borderRadius: "12px",
            fontWeight: "600",
            textTransform: "none",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          }}
        >
          🚀 Publish
        </Button>
      </div>
    </Modal>
  </div>
);
}
export default ArticlePage;
