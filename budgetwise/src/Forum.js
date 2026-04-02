// ─────────────────────────────────────────────────────────────
//  Forum.js — Module 5: Financial Tips Forum
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";

const forumStyles = `
  .forum-container { display: flex; flex-direction: column; gap: 24px; }

  .forum-section { background: #13131a; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 28px; }
  .forum-section-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 20px; letter-spacing: -0.3px; }

  .forum-create { display: flex; flex-direction: column; gap: 12px; }
  .forum-input { padding: 12px 14px; background: #1a1a26; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; color: #fff; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; resize: none; }
  .forum-input:focus { border-color: #00ff88; box-shadow: 0 0 0 3px rgba(0,255,136,0.07); }
  .forum-input::placeholder { color: #33334a; }
  .forum-post-btn { padding: 12px 24px; background: linear-gradient(135deg, #00ff88, #00cc6a); border: none; border-radius: 10px; color: #0a0a0f; font-size: 14px; font-weight: 700; font-family: 'Syne', sans-serif; cursor: pointer; transition: all 0.2s; align-self: flex-end; }
  .forum-post-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,255,136,0.2); }

  .forum-posts { display: flex; flex-direction: column; gap: 16px; }

  .forum-card { background: #1a1a26; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 22px; transition: all 0.2s; }
  .forum-card:hover { border-color: rgba(255,255,255,0.12); }

  .forum-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .forum-card-user { display: flex; align-items: center; gap: 10px; }
  .forum-avatar { width: 36px; height: 36px; background: linear-gradient(135deg, #7c8cf8, #6366f1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: #fff; font-family: 'Syne', sans-serif; }
  .forum-user-info { display: flex; flex-direction: column; }
  .forum-username { font-weight: 600; font-size: 14px; color: #fff; }
  .forum-time { font-size: 11px; color: #666680; }

  .forum-card-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 8px; }
  .forum-card-content { font-size: 14px; color: #999aaa; line-height: 1.6; margin-bottom: 16px; white-space: pre-wrap; }

  .forum-card-actions { display: flex; align-items: center; gap: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05); }

  .forum-action-btn { display: flex; align-items: center; gap: 6px; background: none; border: none; color: #666680; font-size: 13px; font-weight: 500; cursor: pointer; padding: 6px 12px; border-radius: 8px; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
  .forum-action-btn:hover { background: rgba(255,255,255,0.04); color: #ccccdd; }
  .forum-action-btn.liked { color: #ff6b6b; }
  .forum-action-btn.liked:hover { color: #ff4444; }

  .forum-delete-btn { margin-left: auto; display: flex; align-items: center; gap: 4px; background: none; border: none; color: #444460; font-size: 12px; cursor: pointer; padding: 6px 10px; border-radius: 8px; transition: all 0.2s; }
  .forum-delete-btn:hover { background: rgba(255,107,107,0.1); color: #ff6b6b; }

  .forum-comments { margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.05); }
  .forum-comment { display: flex; gap: 10px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.03); }
  .forum-comment:last-child { border-bottom: none; }
  .forum-comment-avatar { width: 28px; height: 28px; background: linear-gradient(135deg, #00ff88, #00cc6a); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: #0a0a0f; flex-shrink: 0; }
  .forum-comment-body { flex: 1; }
  .forum-comment-user { font-size: 12px; font-weight: 600; color: #ccccdd; }
  .forum-comment-text { font-size: 13px; color: #888899; margin-top: 2px; }
  .forum-comment-time { font-size: 10px; color: #444460; margin-top: 4px; }

  .forum-comment-form { display: flex; gap: 10px; margin-top: 12px; }
  .forum-comment-input { flex: 1; padding: 10px 14px; background: #13131a; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; color: #fff; font-size: 13px; font-family: 'DM Sans', sans-serif; outline: none; }
  .forum-comment-input:focus { border-color: #00ff88; }
  .forum-comment-submit { padding: 10px 16px; background: rgba(0,255,136,0.15); border: 1px solid rgba(0,255,136,0.2); border-radius: 10px; color: #00ff88; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .forum-comment-submit:hover { background: rgba(0,255,136,0.25); }

  .forum-empty { text-align: center; padding: 48px 24px; color: #444460; }
  .forum-empty-icon { font-size: 48px; margin-bottom: 12px; }
`;

function ForumModule({ token, username }) {
  const [posts, setPosts] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [expandedPost, setExpandedPost] = useState(null);
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});

  useEffect(() => {
    if (token) loadPosts();
  }, [token]);

  const loadPosts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/forum/posts", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setPosts(await res.json());
    } catch (e) { console.error("Failed to load posts:", e); }
  };

  const createPost = async () => {
    if (!newTitle.trim() || !newContent.trim()) { alert("Please fill title and content"); return; }
    try {
      await fetch("http://localhost:8080/api/forum/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ title: newTitle, content: newContent })
      });
      setNewTitle(""); setNewContent("");
      loadPosts();
    } catch (e) { alert("Failed to create post"); }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await fetch(`http://localhost:8080/api/forum/posts/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      loadPosts();
    } catch (e) { alert("Failed to delete"); }
  };

  const toggleLike = async (postId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/forum/posts/${postId}/like`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) loadPosts();
    } catch (e) { console.error("Failed to toggle like"); }
  };

  const loadComments = async (postId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/forum/posts/${postId}/comments`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setComments(prev => ({ ...prev, [postId]: data }));
      }
    } catch (e) { console.error("Failed to load comments"); }
  };

  const toggleComments = (postId) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      loadComments(postId);
    }
  };

  const addComment = async (postId) => {
    const text = commentInput[postId];
    if (!text || !text.trim()) return;
    try {
      await fetch(`http://localhost:8080/api/forum/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ content: text })
      });
      setCommentInput(prev => ({ ...prev, [postId]: "" }));
      loadComments(postId);
      loadPosts();
    } catch (e) { alert("Failed to add comment"); }
  };

  const formatTime = (dt) => {
    if (!dt) return "";
    const d = new Date(dt);
    const now = new Date();
    const diff = Math.floor((now - d) / 60000);
    if (diff < 1) return "just now";
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <>
      <style>{forumStyles}</style>
      <div className="forum-container">

        {/* ── CREATE POST ── */}
        <div className="forum-section">
          <div className="forum-section-title">💡 Share a Financial Tip</div>
          <div className="forum-create">
            <input
              className="forum-input"
              placeholder="Title — e.g. '5 Ways to Save on Groceries'"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
            <textarea
              className="forum-input"
              rows={4}
              placeholder="Share your money-saving tips, investment advice, or budgeting strategies..."
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
            />
            <button className="forum-post-btn" onClick={createPost}>📝 Post Tip</button>
          </div>
        </div>

        {/* ── POSTS LIST ── */}
        <div className="forum-section" style={{ padding: posts.length > 0 ? 28 : 0 }}>
          {posts.length > 0 && <div className="forum-section-title">🗂️ Community Tips ({posts.length})</div>}

          {posts.length === 0 ? (
            <div className="forum-empty">
              <div className="forum-empty-icon">💬</div>
              <div>No tips yet. Be the first to share!</div>
            </div>
          ) : (
            <div className="forum-posts">
              {posts.map(post => (
                <div key={post.id} className="forum-card">
                  <div className="forum-card-header">
                    <div className="forum-card-user">
                      <div className="forum-avatar">{post.username?.charAt(0).toUpperCase()}</div>
                      <div className="forum-user-info">
                        <span className="forum-username">{post.username}</span>
                        <span className="forum-time">{formatTime(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="forum-card-title">{post.title}</div>
                  <div className="forum-card-content">{post.content}</div>
                  <div className="forum-card-actions">
                    <button
                      className={`forum-action-btn ${post.likedByMe ? "liked" : ""}`}
                      onClick={() => toggleLike(post.id)}
                    >
                      {post.likedByMe ? "❤️" : "🤍"} {post.likeCount || 0}
                    </button>
                    <button className="forum-action-btn" onClick={() => toggleComments(post.id)}>
                      💬 {post.commentCount || 0} {expandedPost === post.id ? "Hide" : "Comments"}
                    </button>
                    {post.username === username && (
                      <button className="forum-delete-btn" onClick={() => deletePost(post.id)}>
                        🗑️ Delete
                      </button>
                    )}
                  </div>

                  {/* ── COMMENTS SECTION ── */}
                  {expandedPost === post.id && (
                    <div className="forum-comments">
                      {(comments[post.id] || []).map(c => (
                        <div key={c.id} className="forum-comment">
                          <div className="forum-comment-avatar">{c.username?.charAt(0).toUpperCase()}</div>
                          <div className="forum-comment-body">
                            <div className="forum-comment-user">{c.username}</div>
                            <div className="forum-comment-text">{c.content}</div>
                            <div className="forum-comment-time">{formatTime(c.createdAt)}</div>
                          </div>
                        </div>
                      ))}
                      <div className="forum-comment-form">
                        <input
                          className="forum-comment-input"
                          placeholder="Write a comment..."
                          value={commentInput[post.id] || ""}
                          onChange={e => setCommentInput(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={e => { if (e.key === "Enter") addComment(post.id); }}
                        />
                        <button className="forum-comment-submit" onClick={() => addComment(post.id)}>
                          Reply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
}

export default ForumModule;
