import { useState, useRef, useEffect } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://hebljdvucansszxhvnfp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlYmxqZHZ1Y2Fuc3N6eGh2bmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwOTQ1MTQsImV4cCI6MjA4ODY3MDUxNH0.nS3J8Z7bNano_z7jdFmIhtmYrOc6HC2FpmBPrtcPZhI"
);

const LOGO = "https://hebljdvucansszxhvnfp.supabase.co/storage/v1/object/public/post-media/image-4.jpg";
const COLORS = ["#3B82F6","#6366F1","#8B5CF6","#EC4899","#14B8A6","#F59E0B"];
const getColor = (str) => COLORS[(str || "").charCodeAt(0) % COLORS.length];

function Avatar({ name, url, size = 42, online }) {
  const initials = (name || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{ width: size, height: size, borderRadius: "50%", background: url ? "transparent" : `linear-gradient(135deg, ${getColor(name)}, ${getColor(name)}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.32, fontWeight: 700, color: "#fff", border: "2px solid rgba(99,102,241,0.3)", overflow: "hidden" }}>
        {url ? <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
      </div>
      {online && <div style={{ position: "absolute", bottom: 1, right: 1, width: size * 0.24, height: size * 0.24, borderRadius: "50%", background: "#22C55E", border: "2px solid #0a0a1a" }} />}
    </div>
  );
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handle = async () => {
    setLoading(true); setError(""); setSuccess("");
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuth(data.user);
      } else {
        if (!username.trim()) throw new Error("Kullanıcı adı gerekli!");
        const { data: ex } = await supabase.from("profiles").select("id").eq("username", username.trim()).maybeSingle();
        if (ex) throw new Error("Bu kullanıcı adı alınmış!");
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) await supabase.from("profiles").upsert({ id: data.user.id, email, username: username.trim() });
        setSuccess("Kayıt başarılı! E-postanı doğrula.");
      }
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const inp = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 16, padding: "14px 18px", color: "#fff", fontSize: 15, outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px", background: "linear-gradient(160deg, #0a0a1a 0%, #0d0d2b 50%, #0a0a1a 100%)" }}>
      <img src={LOGO} alt="Aura SC" style={{ width: 110, height: 110, borderRadius: 28, marginBottom: 20, objectFit: "cover", boxShadow: "0 0 60px rgba(99,102,241,0.5), 0 0 120px rgba(236,72,153,0.3)" }} />
      <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 4, letterSpacing: -1, background: "linear-gradient(90deg, #60A5FA, #A78BFA, #F472B6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AURA SC</div>
      <div style={{ color: "rgba(148,163,184,0.7)", fontSize: 14, marginBottom: 36 }}>Sosyal platformun</div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
        {mode === "register" && <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Kullanıcı adı" style={inp} />}
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-posta" type="email" style={inp} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Şifre" type="password" style={inp} />
        {error && <div style={{ color: "#F87171", fontSize: 13, textAlign: "center", padding: 8, background: "rgba(248,113,113,0.1)", borderRadius: 10 }}>{error}</div>}
        {success && <div style={{ color: "#60A5FA", fontSize: 13, textAlign: "center", padding: 8, background: "rgba(96,165,250,0.1)", borderRadius: 10 }}>{success}</div>}
        <button onClick={handle} disabled={loading} style={{ background: "linear-gradient(135deg, #6366F1, #EC4899)", border: "none", borderRadius: 16, padding: 16, color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer", marginTop: 4, fontFamily: "inherit", boxShadow: "0 8px 30px rgba(99,102,241,0.4)" }}>
          {loading ? "⏳" : mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
        </button>
        <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} style={{ background: "none", border: "none", color: "rgba(148,163,184,0.6)", fontSize: 14, cursor: "pointer", fontFamily: "inherit", marginTop: 4 }}>
          {mode === "login" ? "Hesabın yok mu? Kayıt ol →" : "Zaten hesabın var mı? Giriş yap →"}
        </button>
      </div>
    </div>
  );
}

function MessagesScreen({ user, allProfiles }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser) return;
    supabase.from("messages").select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${user.id})`)
      .order("created_at").then(({ data }) => { if (data) setMessages(data); });
    const channel = supabase.channel("msg_" + selectedUser.id)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const msg = payload.new;
        if ((msg.sender_id === user.id && msg.receiver_id === selectedUser.id) || (msg.sender_id === selectedUser.id && msg.receiver_id === user.id)) {
          setMessages(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg]);
        }
      }).subscribe();
    return () => supabase.removeChannel(channel);
  }, [selectedUser, user]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return;
    const temp = { id: "tmp_" + Date.now(), sender_id: user.id, receiver_id: selectedUser.id, content: input.trim(), created_at: new Date().toISOString() };
    setMessages(prev => [...prev, temp]);
    setInput("");
    await supabase.from("messages").insert({ sender_id: user.id, receiver_id: selectedUser.id, content: temp.content });
  };

  const filtered = allProfiles.filter(u => u.id !== user.id && (u.username || u.email || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {selectedUser ? (
        <>
          <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, background: "rgba(10,10,26,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(99,102,241,0.15)" }}>
            <button onClick={() => { setSelectedUser(null); setMessages([]); }} style={{ background: "rgba(99,102,241,0.15)", border: "none", cursor: "pointer", color: "#818CF8", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            </button>
            <Avatar name={selectedUser.username || selectedUser.email} url={selectedUser.avatar_url} size={40} online />
            <div>
              <div style={{ color: "#F1F5F9", fontWeight: 700, fontSize: 15 }}>{selectedUser.username || selectedUser.email}</div>
              <div style={{ color: "#22C55E", fontSize: 11 }}>● çevrimiçi</div>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10, background: "linear-gradient(180deg, #0d0d2b 0%, #0a0a1a 100%)" }}>
            {messages.length === 0 && <div style={{ textAlign: "center", color: "rgba(148,163,184,0.4)", fontSize: 13, marginTop: 40 }}>Henüz mesaj yok 👋</div>}
            {messages.map(msg => {
              const isMe = msg.sender_id === user.id;
              return (
                <div key={msg.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8 }}>
                  {!isMe && <Avatar name={selectedUser.username} url={selectedUser.avatar_url} size={28} />}
                  <div style={{ maxWidth: "72%", padding: "10px 14px", borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: isMe ? "linear-gradient(135deg, #6366F1, #EC4899)" : "rgba(255,255,255,0.06)", border: isMe ? "none" : "1px solid rgba(99,102,241,0.2)", color: "#F1F5F9", fontSize: 14, lineHeight: 1.5, opacity: msg.id?.startsWith("tmp_") ? 0.7 : 1 }}>
                    {msg.content}
                    <div style={{ fontSize: 10, opacity: 0.45, marginTop: 3, textAlign: "right" }}>{new Date(msg.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding: "10px 12px 36px", display: "flex", gap: 8, alignItems: "center", background: "rgba(10,10,26,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(99,102,241,0.1)" }}>
            <div style={{ flex: 1, background: "rgba(99,102,241,0.08)", borderRadius: 24, padding: "11px 16px", border: "1px solid rgba(99,102,241,0.2)" }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Mesaj yaz..." style={{ background: "none", border: "none", outline: "none", color: "#F1F5F9", fontSize: 14, width: "100%", fontFamily: "inherit" }} />
            </div>
            <button onClick={sendMessage} style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #6366F1, #EC4899)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(99,102,241,0.4)", flexShrink: 0 }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, overflowY: "auto", background: "linear-gradient(180deg, #0d0d2b 0%, #0a0a1a 100%)" }}>
          <div style={{ padding: "12px 16px 8px" }}>
            <div style={{ background: "rgba(99,102,241,0.08)", borderRadius: 20, padding: "10px 16px", display: "flex", gap: 8, alignItems: "center", border: "1px solid rgba(99,102,241,0.2)" }}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="rgba(129,140,248,0.8)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Kişi ara..." style={{ background: "none", border: "none", outline: "none", color: "#F1F5F9", fontSize: 13, width: "100%", fontFamily: "inherit" }} />
            </div>
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", color: "rgba(148,163,184,0.3)", padding: 40, fontSize: 14 }}>Henüz kullanıcı yok 😊</div>
          ) : filtered.map(u => (
            <div key={u.id} onClick={() => setSelectedUser(u)} style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <Avatar name={u.username || u.email} url={u.avatar_url} size={52} />
              <div style={{ flex: 1 }}>
                <div style={{ color: "#F1F5F9", fontWeight: 700, fontSize: 15 }}>{u.username || u.email}</div>
                <div style={{ color: "rgba(129,140,248,0.5)", fontSize: 12, marginTop: 2 }}>Mesaj gönder →</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PostCard({ post, user, onDelete, onUpdate }) {
  const [liked, setLiked] = useState((post.likes || []).includes(user.id));
  const [likeCount, setLikeCount] = useState((post.likes || []).length);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || "");
  const isOwner = post.user_id === user.id;

  const loadComments = async () => {
    const { data } = await supabase.from("comments").select("*, profiles(username, avatar_url)").eq("post_id", post.id).order("created_at");
    if (data) setComments(data);
  };

  const toggleComments = () => {
    if (!showComments) loadComments();
    setShowComments(!showComments);
  };

  const toggleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
    const newLikes = newLiked ? [...(post.likes || []), user.id] : (post.likes || []).filter(id => id !== user.id);
    await supabase.from("posts").update({ likes: newLikes }).eq("id", post.id);
  };

  const addComment = async () => {
    if (!commentInput.trim()) return;
    await supabase.from("comments").insert({ post_id: post.id, user_id: user.id, content: commentInput.trim() });
    setCommentInput("");
    loadComments();
  };

  const deletePost = async () => {
    await supabase.from("posts").delete().eq("id", post.id);
    onDelete(post.id);
  };

  const saveEdit = async () => {
    await supabase.from("posts").update({ content: editContent }).eq("id", post.id);
    onUpdate(post.id, editContent);
    setEditing(false);
  };

  return (
    <div style={{ margin: "0 16px 12px", borderRadius: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(99,102,241,0.12)", overflow: "hidden" }}>
      <div style={{ padding: "12px 14px 8px", display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar name={post.profiles?.username || "?"} url={post.profiles?.avatar_url} size={40} />
        <div style={{ flex: 1 }}>
          <div style={{ color: "#F1F5F9", fontWeight: 700, fontSize: 14 }}>{post.profiles?.username || "Kullanıcı"}</div>
          <div style={{ color: "rgba(129,140,248,0.4)", fontSize: 11 }}>{new Date(post.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</div>
        </div>
        {isOwner && (
          <div style={{ position: "relative" }}>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(148,163,184,0.5)", padding: 4 }}>⋯</button>
            {menuOpen && (
              <div style={{ position: "absolute", right: 0, top: 28, background: "#1a1a3e", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 12, overflow: "hidden", zIndex: 10, minWidth: 120 }}>
                <button onClick={() => { setEditing(true); setMenuOpen(false); }} style={{ display: "block", width: "100%", padding: "10px 16px", background: "none", border: "none", color: "#818CF8", cursor: "pointer", textAlign: "left", fontSize: 13, fontFamily: "inherit" }}>✏️ Düzenle</button>
                <button onClick={deletePost} style={{ display: "block", width: "100%", padding: "10px 16px", background: "none", border: "none", color: "#F87171", cursor: "pointer", textAlign: "left", fontSize: 13, fontFamily: "inherit" }}>🗑️ Sil</button>
              </div>
            )}
          </div>
        )}
      </div>

      {editing ? (
        <div style={{ padding: "0 14px 10px" }}>
          <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={3} style={{ width: "100%", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 12, padding: "10px 14px", color: "#F1F5F9", fontSize: 14, fontFamily: "inherit", outline: "none", resize: "none", boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={saveEdit} style={{ padding: "7px 16px", borderRadius: 10, background: "linear-gradient(135deg, #6366F1, #EC4899)", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>Kaydet</button>
            <button onClick={() => setEditing(false)} style={{ padding: "7px 16px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "none", color: "#F1F5F9", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>İptal</button>
          </div>
        </div>
      ) : post.content && <div style={{ padding: "0 14px 10px", color: "#CBD5E1", fontSize: 14, lineHeight: 1.6 }}>{post.content}</div>}

      {post.media_url && (post.media_type === "video" ?
        <video src={post.media_url} style={{ width: "100%", maxHeight: 320, objectFit: "cover" }} controls /> :
        <img src={post.media_url} alt="" style={{ width: "100%", maxHeight: 320, objectFit: "cover" }} />
      )}

      <div style={{ padding: "10px 14px", display: "flex", gap: 20, borderTop: "1px solid rgba(99,102,241,0.08)" }}>
        <button onClick={toggleLike} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: liked ? "#EC4899" : "rgba(148,163,184,0.5)", fontSize: 13, fontFamily: "inherit" }}>
          <svg width="18" height="18" fill={liked ? "#EC4899" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          {likeCount}
        </button>
        <button onClick={toggleComments} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: showComments ? "#818CF8" : "rgba(148,163,184,0.5)", fontSize: 13, fontFamily: "inherit" }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          {comments.length > 0 ? comments.length : "Yorum"}
        </button>
      </div>

      {showComments && (
        <div style={{ padding: "0 14px 14px", borderTop: "1px solid rgba(99,102,241,0.08)" }}>
          {comments.map(c => (
            <div key={c.id} style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "flex-start" }}>
              <Avatar name={c.profiles?.username} url={c.profiles?.avatar_url} size={28} />
              <div style={{ background: "rgba(99,102,241,0.08)", borderRadius: 12, padding: "8px 12px", flex: 1 }}>
                <div style={{ color: "#818CF8", fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{c.profiles?.username}</div>
                <div style={{ color: "#CBD5E1", fontSize: 13 }}>{c.content}</div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <input value={commentInput} onChange={e => setCommentInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addComment()} placeholder="Yorum yaz..." style={{ flex: 1, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 20, padding: "8px 14px", color: "#F1F5F9", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
            <button onClick={addComment} style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #6366F1, #EC4899)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FeedScreen({ user, profile }) {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [posting, setPosting] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    loadPosts();
    const channel = supabase.channel("posts_feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => loadPosts())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const loadPosts = async () => {
    const { data } = await supabase.from("posts").select("*, profiles(username, avatar_url)").order("created_at", { ascending: false }).limit(50);
    if (data) setPosts(data);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMediaFile(file);
    setMediaType(file.type.startsWith("video") ? "video" : "image");
    const reader = new FileReader();
    reader.onload = (ev) => setMediaPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const submitPost = async () => {
    if (!content.trim() && !mediaFile) return;
    setPosting(true);
    let media_url = null, media_type = null;
    if (mediaFile) {
      const ext = mediaFile.name.split(".").pop();
      const path = `posts/${user.id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("post-media").upload(path, mediaFile);
      if (!error) {
        const { data: urlData } = supabase.storage.from("post-media").getPublicUrl(path);
        media_url = urlData.publicUrl;
        media_type = mediaType;
      }
    }
    await supabase.from("posts").insert({ user_id: user.id, content: content.trim(), media_url, media_type });
    setContent(""); setMediaFile(null); setMediaPreview(null); setMediaType(null);
    setPosting(false);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ overflowY: "auto", flex: 1, background: "linear-gradient(180deg, #0d0d2b 0%, #0a0a1a 100%)" }}>
        <div style={{ margin: "12px 16px", borderRadius: 20, background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", padding: 14 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Avatar name={profile?.username || "?"} url={profile?.avatar_url} size={40} />
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Ne düşünüyorsun?" rows={2} style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#F1F5F9", fontSize: 14, fontFamily: "inherit", resize: "none", lineHeight: 1.5, paddingTop: 8 }} />
          </div>
          {mediaPreview && (
            <div style={{ position: "relative", marginTop: 10, borderRadius: 12, overflow: "hidden" }}>
              {mediaType === "video" ? <video src={mediaPreview} style={{ width: "100%", maxHeight: 200, objectFit: "cover" }} controls /> : <img src={mediaPreview} alt="" style={{ width: "100%", maxHeight: 200, objectFit: "cover" }} />}
              <button onClick={() => { setMediaFile(null); setMediaPreview(null); }} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: 28, height: 28, color: "#fff", cursor: "pointer", fontSize: 16 }}>×</button>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
            <button onClick={() => fileRef.current.click()} style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, padding: "6px 14px", color: "#818CF8", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>📷 Medya</button>
            <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFile} style={{ display: "none" }} />
            <button onClick={submitPost} disabled={posting || (!content.trim() && !mediaFile)} style={{ background: "linear-gradient(135deg, #6366F1, #EC4899)", border: "none", borderRadius: 20, padding: "8px 20px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: (!content.trim() && !mediaFile) ? 0.4 : 1 }}>
              {posting ? "⏳" : "Paylaş"}
            </button>
          </div>
        </div>
        {posts.map(post => (
          <PostCard key={post.id} post={post} user={user}
            onDelete={(id) => setPosts(prev => prev.filter(p => p.id !== id))}
            onUpdate={(id, content) => setPosts(prev => prev.map(p => p.id === id ? { ...p, content } : p))}
          />
        ))}
      </div>
    </div>
  );
}

function KesfetScreen({ user, allProfiles }) {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    supabase.from("posts").select("*, profiles(username, avatar_url)").order("created_at", { ascending: false }).limit(30).then(({ data }) => { if (data) setPosts(data); });
  }, []);

  const filtered = allProfiles.filter(u => u.id !== user.id && (u.username || "").toLowerCase().includes(search.toLowerCase()) && search.length > 0);

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "linear-gradient(180deg, #0d0d2b 0%, #0a0a1a 100%)" }}>
      <div style={{ padding: "12px 16px 8px", position: "sticky", top: 0, background: "rgba(10,10,26,0.95)", backdropFilter: "blur(20px)", zIndex: 5 }}>
        <div style={{ background: "rgba(99,102,241,0.08)", borderRadius: 20, padding: "10px 16px", display: "flex", gap: 8, alignItems: "center", border: "1px solid rgba(99,102,241,0.2)" }}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="rgba(129,140,248,0.8)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Kullanıcı ara..." style={{ background: "none", border: "none", outline: "none", color: "#F1F5F9", fontSize: 13, width: "100%", fontFamily: "inherit" }} />
        </div>
      </div>
      {search.length > 0 ? (
        filtered.length === 0 ? <div style={{ textAlign: "center", color: "rgba(148,163,184,0.4)", padding: 30, fontSize: 14 }}>Kullanıcı bulunamadı</div> :
        filtered.map(u => (
          <div key={u.id} style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <Avatar name={u.username || u.email} url={u.avatar_url} size={48} />
            <div style={{ flex: 1 }}>
              <div style={{ color: "#F1F5F9", fontWeight: 700 }}>{u.username || u.email}</div>
              <div style={{ color: "rgba(129,140,248,0.5)", fontSize: 12 }}>{u.email}</div>
            </div>
          </div>
        ))
      ) : (
        <div>
          <div style={{ padding: "16px 16px 8px", color: "rgba(129,140,248,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>POPÜLER GÖNDERİLER</div>
          {posts.length === 0 ? <div style={{ textAlign: "center", color: "rgba(148,163,184,0.3)", padding: 40, fontSize: 14 }}>Henüz gönderi yok 🌀</div> :
          posts.map(post => (
            <div key={post.id} style={{ margin: "0 16px 12px", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(99,102,241,0.15)", background: "rgba(99,102,241,0.04)" }}>
              {post.media_url && (post.media_type === "video" ? <video src={post.media_url} style={{ width: "100%", maxHeight: 250, objectFit: "cover" }} controls /> : <img src={post.media_url} alt="" style={{ width: "100%", maxHeight: 250, objectFit: "cover" }} />)}
              <div style={{ padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <Avatar name={post.profiles?.username} url={post.profiles?.avatar_url} size={30} />
                  <span style={{ color: "#818CF8", fontWeight: 700, fontSize: 13 }}>{post.profiles?.username}</span>
                </div>
                {post.content && <div style={{ color: "#CBD5E1", fontSize: 13, lineHeight: 1.5 }}>{post.content}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileScreen({ user, profile, onLogout, onUpdateProfile, allProfiles }) {
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(profile?.username || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const avatarRef = useRef();

  useEffect(() => {
    supabase.from("posts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => { if (data) setUserPosts(data); });
    supabase.from("follows").select("*").eq("following_id", user.id).then(({ data }) => { if (data) setFollowers(data); });
    supabase.from("follows").select("*").eq("follower_id", user.id).then(({ data }) => { if (data) setFollowing(data); });
  }, [user]);

  const saveUsername = async () => {
    if (!newUsername.trim()) return;
    setSaving(true); setError("");
    const { data: ex } = await supabase.from("profiles").select("id").eq("username", newUsername.trim()).neq("id", user.id).maybeSingle();
    if (ex) { setError("Bu kullanıcı adı alınmış!"); setSaving(false); return; }
    await supabase.from("profiles").update({ username: newUsername.trim() }).eq("id", user.id);
    onUpdateProfile({ ...profile, username: newUsername.trim() });
    setEditing(false); setSaving(false);
  };

  const uploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAvatar(true);
    const ext = file.name.split(".").pop();
    const path = `avatars/${user.id}_${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("post-media").upload(path, file, { upsert: true });
    if (error) { setUploadingAvatar(false); return; }
    const { data } = supabase.storage.from("post-media").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", user.id);
    onUpdateProfile({ ...profile, avatar_url: data.publicUrl });
    setUploadingAvatar(false);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "linear-gradient(180deg, #0d0d2b 0%, #0a0a1a 100%)" }}>
      <div style={{ padding: "24px 20px 16px", display: "flex", flexDirection: "column", alignItems: "center", borderBottom: "1px solid rgba(99,102,241,0.15)" }}>
        <div style={{ position: "relative", marginBottom: 16 }}>
          <Avatar name={profile?.username || "?"} url={profile?.avatar_url} size={96} />
          <button onClick={() => avatarRef.current.click()} style={{ position: "absolute", bottom: 0, right: 0, width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #6366F1, #EC4899)", border: "2px solid #0a0a1a", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
            {uploadingAvatar ? "⏳" : "📷"}
          </button>
          <input ref={avatarRef} type="file" accept="image/*" onChange={uploadAvatar} style={{ display: "none" }} />
        </div>
        {editing ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%" }}>
            <input value={newUsername} onChange={e => setNewUsername(e.target.value)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 12, padding: "10px 16px", color: "#F1F5F9", fontSize: 15, outline: "none", fontFamily: "inherit", textAlign: "center", width: "70%", boxSizing: "border-box" }} />
            {error && <div style={{ color: "#F87171", fontSize: 12 }}>{error}</div>}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={saveUsername} disabled={saving} style={{ padding: "8px 20px", borderRadius: 12, background: "linear-gradient(135deg, #6366F1, #EC4899)", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{saving ? "⏳" : "Kaydet"}</button>
              <button onClick={() => setEditing(false)} style={{ padding: "8px 20px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "none", color: "#F1F5F9", cursor: "pointer", fontFamily: "inherit" }}>İptal</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ color: "#F1F5F9", fontSize: 22, fontWeight: 800 }}>{profile?.username || "Kullanıcı"}</div>
            <div style={{ color: "rgba(129,140,248,0.6)", fontSize: 13, marginTop: 3 }}>{user?.email}</div>
            <button onClick={() => setEditing(true)} style={{ marginTop: 10, padding: "7px 20px", borderRadius: 20, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", color: "#818CF8", fontWeight: 600, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>Kullanıcı adını değiştir</button>
          </>
        )}
        <div style={{ display: "flex", gap: 36, marginTop: 20 }}>
          {[[userPosts.length, "Gönderi"], [followers.length, "Takipçi"], [following.length, "Takip"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ color: "#F1F5F9", fontSize: 22, fontWeight: 800 }}>{num}</div>
              <div style={{ color: "rgba(129,140,248,0.5)", fontSize: 12 }}>{label}</div>
            </div>
          ))}
        </div>
        <button onClick={onLogout} style={{ marginTop: 16, padding: "9px 28px", borderRadius: 20, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#F87171", fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Çıkış Yap</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, padding: "2px" }}>
        {userPosts.filter(p => p.media_url).map(post => (
          <div key={post.id} style={{ aspectRatio: "1", overflow: "hidden" }}>
            {post.media_type === "video" ? <video src={post.media_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <img src={post.media_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          </div>
        ))}
        {userPosts.filter(p => p.media_url).length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", color: "rgba(148,163,184,0.3)", padding: 40, fontSize: 14 }}>Henüz gönderi yok 🌀</div>}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("feed");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [allProfiles, setAllProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); loadProfile(session.user.id); }
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) { setUser(session.user); loadProfile(session.user.id); }
      else { setUser(null); setProfile(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId) => {
    try {
      const [{ data: prof }, { data: all }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).single(),
        supabase.from("profiles").select("*")
      ]);
      setProfile(prof);
      if (all) setAllProfiles(all);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "messages", label: "Mesajlar", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
    { id: "kesfet", label: "Keşfet", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg> },
    { id: "feed", label: "Akış", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg> },
    { id: "profile", label: "Profil", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ];

  if (loading) return (
    <div style={{ background: "linear-gradient(160deg, #0a0a1a 0%, #0d0d2b 50%, #0a0a1a 100%)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
      <img src={LOGO} alt="Aura SC" style={{ width: 100, height: 100, borderRadius: 25, objectFit: "cover", boxShadow: "0 0 60px rgba(99,102,241,0.6), 0 0 120px rgba(236,72,153,0.3)" }} />
      <div style={{ color: "rgba(148,163,184,0.6)", fontSize: 14 }}>Yükleniyor...</div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", background: "#0a0a1a", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 4px; }`}</style>
      <div style={{ width: "100%", maxWidth: 430, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "48px 18px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(10,10,26,0.9)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(99,102,241,0.1)", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={LOGO} alt="Aura SC" style={{ width: 34, height: 34, borderRadius: 10, objectFit: "cover", boxShadow: "0 0 15px rgba(99,102,241,0.5)" }} />
            <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.5, background: "linear-gradient(90deg, #60A5FA, #A78BFA, #F472B6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AURA SC</div>
          </div>
          {profile && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ color: "rgba(129,140,248,0.7)", fontSize: 13, fontWeight: 600 }}>{profile.username}</div>
              <Avatar name={profile.username} url={profile.avatar_url} size={32} />
            </div>
          )}
        </div>

        {!user ? <AuthScreen onAuth={(u) => { setUser(u); loadProfile(u.id); }} /> : (
          <>
            {activeTab === "messages" && <MessagesScreen user={user} allProfiles={allProfiles} />}
            {activeTab === "kesfet" && <KesfetScreen user={user} allProfiles={allProfiles} />}
            {activeTab === "feed" && <FeedScreen user={user} profile={profile} />}
            {activeTab === "profile" && <ProfileScreen user={user} profile={profile} allProfiles={allProfiles} onLogout={() => { supabase.auth.signOut(); setUser(null); setProfile(null); }} onUpdateProfile={(p) => { setProfile(p); setAllProfiles(prev => prev.map(u => u.id === p.id ? p : u)); }} />}
            <div style={{ padding: "8px 8px 32px", display: "flex", justifyContent: "space-around", background: "rgba(10,10,26,0.95)", backdropFilter: "blur(24px)", borderTop: "1px solid rgba(99,102,241,0.12)", zIndex: 10 }}>
              {tabs.map(tab => {
                const active = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: active ? "rgba(99,102,241,0.15)" : "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: active ? "#818CF8" : "rgba(148,163,184,0.3)", padding: "8px 16px", borderRadius: 16, transition: "all 0.2s" }}>
                    {tab.icon}
                    <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
