
import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Fab,
} from "@material-ui/core";
import { KeyboardArrowUp } from "@material-ui/icons";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import api from "../api"; 
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
  const [showScroll, setShowScroll] = useState(false);

  
  const user = useSelector(selectUser) || null;

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/articles");
      const data = res.data;
      
      if (data) {
        if (Array.isArray(data)) setArticles(data);
        else if (Array.isArray(data.articles)) setArticles(data.articles);
        else setArticles([]); 
      } else {
        setArticles([]);
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

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

      alert(res.data?.message || "Article published!");
      setTitle("");
      setContent("");
      setCategory("");
      setImageUrl("");
      setIsModalOpen(false);
      fetchArticles();
    } catch (err) {
      console.error("Error posting article:", err);
      alert(err?.response?.data?.message || "Error posting article");
    }
  };

  const handleDelete = async (articleId) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    try {
      const res = await api.delete(`/api/articles/${articleId}`, {
        data: { uid: user?.uid },
      });
      alert(res.data?.message || "Deleted");
      fetchArticles();
    } catch (err) {
      console.error("Error deleting article:", err);
      alert(err?.response?.data?.message || "Error deleting article");
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div style={{ padding: 20, background: "#ffffff", minHeight: "100vh", color: "#111" }}>
      
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 16,
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#111" }}>
          📰 Articles
        </h1>

        <Button
          variant="contained"
          onClick={() => setIsModalOpen(true)}
          style={{
            background: "linear-gradient(135deg, #6C63FF, #8A5CFF)",
            borderRadius: 12,
            padding: "10px 18px",
            fontWeight: 700,
            textTransform: "none",
            color: "#fff",
            boxShadow: "0 6px 18px rgba(108,99,255,0.18)",
            cursor: "pointer",
          }}
        >
          ✍️ Write Article
        </Button>
      </div>

      
      <div style={{ maxWidth: 1000, margin: "18px auto", display: "flex", flexDirection: "column", gap: 18 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <CircularProgress />
            <Typography style={{ marginTop: 12, color: "#666" }}>Loading articles...</Typography>
          </div>
        ) : articles && articles.length > 0 ? (
          articles.map((article) => (
            <Card
              key={article._id || article.id || Math.random()}
              style={{
                background: "#fff",
                borderRadius: 14,
                boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
                transition: "transform 0.18s ease, box-shadow 0.18s ease",
                cursor: "pointer",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 14px 30px rgba(15,23,42,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(15,23,42,0.06)";
              }}
            >
              <CardContent style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar src={article.user?.photo} />
                  <div>
                    <Typography style={{ fontWeight: 600, color: "#222" }}>
                      {article.user?.userName || article.author || "Anonymous"}
                    </Typography>
                    <Typography style={{ fontSize: 12, color: "#666" }}>
                      {new Date(article.createdAt || article.date || Date.now()).toLocaleString?.() || ""}
                    </Typography>
                  </div>
                  
                  <div style={{ marginLeft: "auto" }}>
                    {user?.uid === article.user?.uid && (
                      <Button
                        variant="outlined"
                        onClick={() => handleDelete(article._id)}
                        style={{
                          color: "#e53935",
                          borderColor: "rgba(229,57,53,0.12)",
                          textTransform: "none",
                          borderRadius: 10,
                          minWidth: 72,
                        }}
                      >
                        🗑 Delete
                      </Button>
                    )}
                  </div>
                </div>

                <Typography style={{ marginTop: 14, fontSize: 20, fontWeight: 700, color: "#111" }}>
                  {article.title}
                </Typography>

                <Typography style={{ marginTop: 6, fontSize: 13, color: "#666" }}>
                  Category: {article.category || "Uncategorized"}
                </Typography>

                {article.imageUrl && (
                  <div style={{ marginTop: 12 }}>
                    <img
                      src={article.imageUrl}
                      alt="article"
                      style={{ width: "100%", maxHeight: 360, objectFit: "cover", borderRadius: 10 }}
                    />
                  </div>
                )}

                <Typography style={{ marginTop: 12, color: "#333", lineHeight: 1.6 }}>
                  {article.content}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <div style={{ padding: 36, textAlign: "center", color: "#666", background: "#fff", borderRadius: 12, boxShadow: "0 6px 18px rgba(15,23,42,0.04)" }}>
            <Typography style={{ fontWeight: 600, color: "#222" }}>No articles published yet</Typography>
            <Typography style={{ marginTop: 8, color: "#777" }}>Click "Write Article" to add the first article.</Typography>
          </div>
        )}
      </div>

      
      <Fab
        onClick={scrollToTop}
        style={{
          position: "fixed",
          bottom: 30,
          right: 30,
          background: "linear-gradient(135deg, #6C63FF, #8A5CFF)",
          color: "#fff",
          boxShadow: "0 8px 24px rgba(108,99,255,0.18)",
          cursor: "pointer",
          opacity: showScroll ? 1 : 0,
          transform: showScroll ? "scale(1)" : "scale(0.85)",
          transition: "opacity 0.28s ease, transform 0.28s ease",
          pointerEvents: showScroll ? "auto" : "none",
        }}
      >
        <KeyboardArrowUp />
      </Fab>

      
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
