import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hebljdvucansszxhvnfp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlYmxqZHZ1Y2Fuc3N6eGh2bmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwOTQ1MTQsImV4cCI6MjA4ODY3MDUxNH0.nS3J8Z7bNano_z7jdFmIhtmYrOc6HC2FpmBPrtcPZhI";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const LOGO = "https://hebljdvucansszxhvnfp.supabase.co/storage/v1/object/public/post-media/Picsart_26-03-11_18-37-28-244.png";
const MOODS = ["😊", "😎", "🔥", "💫", "❤️", "😂", "😢", "😡", "🥳", "🤔", "💪", "🌙", "⚡", "🎵", "🍕"];
const BG_COLORS = ["transparent", "#0d0d1a", "#1a0a2e", "#0a1a2e", "#1a2e0a", "#2e0a0a", "#2e1a0a", "#1a1a00"];
const QUICK_REACTIONS = ["❤️", "😂", "😮", "😢", "😡", "👍"];
const EMOJIS = ["😊", "😎", "🔥", "💫", "❤️", "😂", "😢", "😡", "🥳", "🤔", "💪", "🌙", "⚡", "🎵", "🍕", "👍", "👎", "🙏", "🎉", "✨", "🌈", "🦋", "🐱", "🐶", "🌸", "🌺", "🍎", "🎮", "🎬", "🤣", "😍", "🥰", "😴", "🤯", "🥹"];
const THEME_COLORS = ["#00f5ff", "#bf5af2", "#ff2d78", "#ff9500", "#39ff14", "#00d4ff", "#ff6b9d", "#ffd700"];
const COLORS = ["#00f5ff", "#ff2d78", "#bf5af2", "#ff9500", "#39ff14", "#ff6b9d", "#00d4ff", "#ff4500"];

const getColor = n => COLORS[(n || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];
const getInitials = n => (n || "?").slice(0, 2).toUpperCase();
const timeAgo = d => { const s = (Date.now() - new Date(d)) / 1000; if (s < 60) return "şimdi"; if (s < 3600) return `${Math.floor(s / 60)}dk`; if (s < 86400) return `${Math.floor(s / 3600)}sa`; return `${Math.floor(s / 86400)}g`; };
const fmtTime = d => new Date(d).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

const pCache = new Map();
const fetchProf = async id => {
  if (pCache.has(id)) return pCache.get(id);
  const { data } = await supabase.from("profiles").select("username,avatar_url").eq("id", id).single();
  if (data) pCache.set(id, data);
  return data;
};

const lsGet = (k, d = null) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } };

const convertFile = async f => {
  if (!f) return f;
  const nm = f.name.toLowerCase();
  if (!nm.endsWith(".heic") && !nm.endsWith(".heif") && !f.type.includes("heic")) return f;
  return new Promise(res => {
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
      c.getContext("2d").drawImage(img, 0, 0);
      c.toBlob(b => { URL.revokeObjectURL(url); res(b ? new File([b], nm.replace(/\.(heic|heif)$/, ".jpg"), { type: "image/jpeg" }) : f); }, "image/jpeg", 0.92);
    };
    img.onerror = () => { URL.revokeObjectURL(url); res(f); };
    img.src = url;
  });
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
  body{background:#050508;overscroll-behavior:none;}
  ::-webkit-scrollbar{display:none;}
  @keyframes shimmer{0%{background-position:0%}100%{background-position:200%}}
  @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(0,245,255,0.3)}50%{box-shadow:0 0 40px rgba(0,245,255,0.6),0 0 60px rgba(191,90,242,0.3)}}
  @keyframes pulse{0%,100%{opacity:0.4}50%{opacity:1}}
  @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  input,textarea,button{font-family:'DM Sans',sans-serif;}
`;

const Avatar = memo(({ name, url, size = 40, online }) => {
  const c = getColor(name);
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `${c}22`, border: `1.5px solid ${c}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * .36, fontWeight: 700, color: "#fff", flexShrink: 0, overflow: "hidden", position: "relative" }}>
      {url && <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} onError={e => e.target.remove()} />}
      {!url && getInitials(name)}
      {online && <div style={{ position: "absolute", bottom: 1, right: 1, width: size * .22, height: size * .22, borderRadius: "50%", background: "#39ff14", border: "1.5px solid #050508", zIndex: 1 }} />}
    </div>
  );
});

function AuthScreen({ onAuth }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [uname, setUname] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [forgot, setForgot] = useState(false);

  const submit = async () => {
    if (!email.trim() || (!forgot && !pass.trim())) return;
    setLoading(true); setMsg({ type: "", text: "" });
    try {
      if (forgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
        if (error) setMsg({ type: "err", text: error.message });
        else setMsg({ type: "ok", text: "Şifre sıfırlama e-postası gönderildi!" });
      } else if (tab === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pass });
        if (error) setMsg({ type: "err", text: "E-posta veya şifre hatalı!" });
        else onAuth(data.user);
      } else {
        if (!uname.trim()) { setMsg({ type: "err", text: "Kullanıcı adı gerekli!" }); setLoading(false); return; }
        const { data: ex } = await supabase.from("profiles").select("id").eq("username", uname.trim()).maybeSingle();
        if (ex) { setMsg({ type: "err", text: "Bu kullanıcı adı alınmış!" }); setLoading(false); return; }
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password: pass });
        if (error) setMsg({ type: "err", text: error.message });
        else if (data.user) {
          await supabase.from("profiles").upsert({ id: data.user.id, email: email.trim(), username: uname.trim() });
          onAuth(data.user);
        }
      }
    } finally { setLoading(false); }
  };

  const inp = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "14px 18px", color: "#fff", fontSize: 15, outline: "none", width: "100%" };

  return (
    <div style={{ minHeight: "100vh", background: "#050508", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'DM Sans',sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{css}</style>
      <div style={{ position: "fixed", width: 500, height: 500, borderRadius: "50%", background: "#bf5af2", filter: "blur(100px)", opacity: 0.12, top: -150, left: -150, pointerEvents: "none" }} />
      <div style={{ position: "fixed", width: 400, height: 400, borderRadius: "50%", background: "#00f5ff", filter: "blur(100px)", opacity: 0.08, bottom: -100, right: -100, pointerEvents: "none" }} />
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(0,245,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.02) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
      <div style={{ width: "100%", maxWidth: 380, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img src={LOGO} style={{ width: 80, height: 80, borderRadius: 20, objectFit: "cover", animation: "glow 2s ease-in-out infinite", marginBottom: 16 }} alt="" />
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 44, letterSpacing: 4, background: "linear-gradient(135deg,#00f5ff,#bf5af2,#ff2d78)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>AURA</span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 16, color: "#00f5ff", marginBottom: 4 }}>sc</span>
          </div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, letterSpacing: 1, marginTop: 4 }}>Sosyal medyanın yeni yüzü</div>
        </div>
        {!forgot && (
          <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: 4, marginBottom: 24, border: "1px solid rgba(255,255,255,0.06)" }}>
            {["login", "register"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px", borderRadius: 12, border: "none", background: tab === t ? "rgba(0,245,255,0.1)" : "transparent", color: tab === t ? "#00f5ff" : "rgba(255,255,255,0.4)", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                {t === "login" ? "Giriş Yap" : "Kayıt Ol"}
              </button>
            ))}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {forgot && <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 4 }}>Şifre sıfırlama bağlantısı gönderilecek.</div>}
          {!forgot && tab === "register" && <input value={uname} onChange={e => setUname(e.target.value)} placeholder="Kullanıcı adı" style={inp} />}
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-posta" type="email" style={inp} />
          {!forgot && <input value={pass} onChange={e => setPass(e.target.value)} placeholder="Şifre" type="password" onKeyDown={e => e.key === "Enter" && submit()} style={inp} />}
          {msg.text && <div style={{ padding: "10px 14px", borderRadius: 12, background: msg.type === "ok" ? "rgba(57,255,20,0.1)" : "rgba(255,45,120,0.1)", border: `1px solid ${msg.type === "ok" ? "rgba(57,255,20,0.3)" : "rgba(255,45,120,0.3)"}`, color: msg.type === "ok" ? "#39ff14" : "#ff6b9d", fontSize: 13 }}>{msg.text}</div>}
          <button onClick={submit} disabled={loading} style={{ border: "none", borderRadius: 16, background: "linear-gradient(135deg,#00f5ff,#bf5af2,#ff2d78)", backgroundSize: "200%", color: "#fff", fontWeight: 700, cursor: "pointer", padding: 16, fontSize: 15, marginTop: 4, animation: "gradShift 4s ease infinite", boxShadow: "0 8px 32px rgba(0,245,255,0.2)", opacity: loading ? 0.7 : 1 }}>
            {loading ? "⏳ Bekle..." : (forgot ? "Sıfırlama Gönder" : tab === "login" ? "Giriş Yap" : "Kayıt Ol")}
          </button>
          {!forgot && tab === "login" && <button onClick={() => { setForgot(true); setMsg({ type: "", text: "" }); }} style={{ background: "none", border: "none", color: "rgba(0,245,255,0.5)", cursor: "pointer", fontSize: 12, marginTop: 4 }}>Şifremi unuttum</button>}
          {forgot && <button onClick={() => { setForgot(false); setMsg({ type: "", text: "" }); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 12, marginTop: 4 }}>← Geri dön</button>}
        </div>
      </div>
    </div>
  );
}

function NotificationsPanel({ user, onClose, accent }) {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(30).then(({ data }) => {
      setNotifs(data || []); setLoading(false);
      supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false).then();
    });
  }, [user]);

  const icons = { like: "❤️", comment: "💬", follow: "👤", mention: "@" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", flexDirection: "column" }} onClick={onClose}>
      <div style={{ height: 120 }} />
      <div style={{ background: "rgba(10,10,20,0.98)", flex: 1, borderRadius: "24px 24px 0 0", border: "1px solid rgba(255,255,255,0.08)", animation: "slideUp 0.3s ease", backdropFilter: "blur(20px)" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>🔔 Bildirimler</div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "50%", width: 32, height: 32, color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 18 }}>×</button>
        </div>
        <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}>
          {loading && <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.3)" }}>Yükleniyor...</div>}
          {!loading && notifs.length === 0 && <div style={{ textAlign: "center", padding: 60 }}><div style={{ fontSize: 40, marginBottom: 12 }}>🔔</div><div style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Henüz bildirim yok</div></div>}
          {notifs.map(n => (
            <div key={n.id} style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", gap: 12, alignItems: "center", background: n.read ? "transparent" : `${accent}08` }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${accent}22`, border: `1px solid ${accent}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{icons[n.type] || "🔔"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#fff", fontSize: 13 }}><span style={{ color: accent, fontWeight: 700 }}>{n.from_username}</span> {n.message}</div>
                <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, marginTop: 2 }}>{timeAgo(n.created_at)}</div>
              </div>
              {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: accent, flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const menuItem = color => ({ display: "block", width: "100%", padding: "11px 16px", background: "none", border: "none", color, cursor: "pointer", textAlign: "left", fontSize: 13 });

const PostCard = memo(function PostCard({ post, user, onDelete, onUpdate, accent = "#00f5ff" }) {
  const [liked, setLiked] = useState((post.likes || []).includes(user.id));
  const [likeCount, setLikeCount] = useState((post.likes || []).length);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [commentInput, setCommentInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || "");
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const isOwner = post.user_id === user.id;
  const color = getColor(post.profiles?.username);

  useEffect(() => {
    supabase.from("saved_posts").select("id").eq("user_id", user.id).eq("post_id", post.id).maybeSingle().then(({ data }) => setSaved(!!data));
    supabase.from("comments").select("id", { count: "exact", head: true }).eq("post_id", post.id).then(({ count }) => setCommentCount(count || 0));
  }, [post.id, user.id]);

  const loadComments = useCallback(async () => {
    const { data } = await supabase.from("comments").select("*").eq("post_id", post.id).order("created_at");
    if (!data) return;
    const withP = await Promise.all(data.map(async c => { const p = await fetchProf(c.user_id); return { ...c, profiles: p }; }));
    setComments(withP); setCommentCount(withP.length);
  }, [post.id]);

  const toggleLike = async () => {
    const nl = !liked; setLiked(nl); setLikeCount(p => nl ? p + 1 : p - 1);
    const newLikes = nl ? [...(post.likes || []), user.id] : (post.likes || []).filter(id => id !== user.id);
    post.likes = newLikes;
    await supabase.from("posts").update({ likes: newLikes }).eq("id", post.id);
    if (nl && post.user_id !== user.id) await supabase.from("notifications").insert({ user_id: post.user_id, from_user_id: user.id, from_username: user.email, type: "like", message: "gönderini beğendi", read: false });
  };

  const toggleSave = async () => {
    if (saved) { await supabase.from("saved_posts").delete().eq("user_id", user.id).eq("post_id", post.id); setSaved(false); }
    else { await supabase.from("saved_posts").insert({ user_id: user.id, post_id: post.id }); setSaved(true); }
  };

  const addComment = async () => {
    if (!commentInput.trim()) return;
    const text = commentInput.trim(); setCommentInput("");
    await supabase.from("comments").insert({ post_id: post.id, user_id: user.id, content: text });
    if (post.user_id !== user.id) await supabase.from("notifications").insert({ user_id: post.user_id, from_user_id: user.id, from_username: user.email, type: "comment", message: "gönderine yorum yaptı", read: false });
    loadComments();
  };

  const saveEditComment = async id => {
    if (!editCommentText.trim()) return;
    await supabase.from("comments").update({ content: editCommentText.trim() }).eq("id", id);
    setComments(prev => prev.map(c => c.id === id ? { ...c, content: editCommentText.trim() } : c));
    setEditingComment(null); setEditCommentText("");
  };

  const deletePost = async () => { await supabase.from("posts").delete().eq("id", post.id); onDelete(post.id); };
  const saveEdit = async () => { await supabase.from("posts").update({ content: editContent }).eq("id", post.id); onUpdate(post.id, editContent); setEditing(false); };

  return (
    <div style={{ margin: "0 14px 12px", borderRadius: 22, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden", background: post.bg_color && post.bg_color !== "transparent" ? post.bg_color : "rgba(255,255,255,0.03)", animation: "fadeIn 0.3s ease" }}>
      <div style={{ padding: "12px 14px 8px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 4, height: 36, borderRadius: 2, background: `linear-gradient(to bottom,${color},${color}44)`, flexShrink: 0 }} />
        <Avatar name={post.profiles?.username} url={post.profiles?.avatar_url} size={38} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
            {post.profiles?.username || "Kullanıcı"}
            {post.mood && <span style={{ fontSize: 16 }}>{post.mood}</span>}
            {post.pinned && <span style={{ fontSize: 10, background: `${accent}18`, color: accent, padding: "2px 6px", borderRadius: 6 }}>📌</span>}
          </div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 1 }}>{timeAgo(post.created_at)}{post.location && ` · 📍 ${post.location}`}</div>
        </div>
        {isOwner && (
          <div style={{ position: "relative" }}>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 20, padding: "4px 8px" }}>⋯</button>
            {menuOpen && (
              <div style={{ position: "absolute", right: 0, top: 32, background: "rgba(15,15,25,0.98)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, overflow: "hidden", zIndex: 50, minWidth: 150, boxShadow: "0 16px 40px rgba(0,0,0,0.6)", backdropFilter: "blur(20px)" }}>
                <button onClick={() => { setEditing(true); setMenuOpen(false); }} style={menuItem("#818CF8")}>✏️ Düzenle</button>
                <button onClick={async () => { await supabase.from("posts").update({ pinned: !post.pinned }).eq("id", post.id); setMenuOpen(false); }} style={menuItem(accent)}>{post.pinned ? "📌 Sabitlemeyi Kaldır" : "📌 Sabitle"}</button>
                <button onClick={() => { deletePost(); setMenuOpen(false); }} style={menuItem("#ff6b9d")}>🗑️ Sil</button>
              </div>
            )}
          </div>
        )}
      </div>
      {editing ? (
        <div style={{ padding: "0 14px 12px" }}>
          <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={3} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none", width: "100%", resize: "none" }} />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={saveEdit} style={{ border: "none", borderRadius: 14, background: `linear-gradient(135deg,${accent},#bf5af2)`, color: "#fff", fontWeight: 600, cursor: "pointer", padding: "7px 16px", fontSize: 12 }}>Kaydet</button>
            <button onClick={() => setEditing(false)} style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, background: "rgba(255,255,255,0.06)", color: "#fff", cursor: "pointer", padding: "7px 16px", fontSize: 12 }}>İptal</button>
          </div>
        </div>
      ) : post.content && <div style={{ padding: "0 14px 10px", color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.65 }}>{post.content}</div>}
      {post.media_url && (post.media_type === "video" ? <video src={post.media_url} style={{ width: "100%", maxHeight: 320, objectFit: "cover" }} controls /> : <img src={post.media_url} alt="" style={{ width: "100%", maxHeight: 320, objectFit: "cover" }} />)}
      <div style={{ padding: "10px 14px", display: "flex", gap: 16, borderTop: "1px solid rgba(255,255,255,0.05)", alignItems: "center" }}>
        <button onClick={toggleLike} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: liked ? "#ff2d78" : "rgba(255,255,255,0.35)", fontSize: 13, padding: 0 }}>
          <svg width="19" height="19" fill={liked ? "#ff2d78" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
          {likeCount > 0 && likeCount}
        </button>
        <button onClick={() => { if (!showComments) loadComments(); setShowComments(!showComments); }} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: showComments ? accent : "rgba(255,255,255,0.35)", fontSize: 13, padding: 0 }}>
          <svg width="19" height="19" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
          {commentCount > 0 ? commentCount : "Yorum"}
        </button>
        <button onClick={toggleSave} style={{ background: "none", border: "none", cursor: "pointer", color: saved ? "#ff9500" : "rgba(255,255,255,0.35)", marginLeft: "auto", padding: 0 }}>
          <svg width="19" height="19" fill={saved ? "#ff9500" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>
        </button>
      </div>
      {showComments && (
        <div style={{ padding: "0 14px 14px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {comments.length === 0 && <div style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 12, padding: "10px 0" }}>İlk yorumu yap!</div>}
          {comments.map(c => (
            <div key={c.id} style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "flex-start" }}>
              <Avatar name={c.profiles?.username} url={c.profiles?.avatar_url} size={28} />
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "8px 12px", flex: 1, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                  <div style={{ color: accent, fontSize: 11, fontWeight: 700 }}>{c.profiles?.username}</div>
                  {c.user_id === user.id && (
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => { setEditingComment(c.id); setEditCommentText(c.content); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 11 }}>✏️</button>
                      <button onClick={async () => { await supabase.from("comments").delete().eq("id", c.id); loadComments(); }} style={{ background: "none", border: "none", color: "#ff6b9d", cursor: "pointer", fontSize: 11 }}>🗑️</button>
                    </div>
                  )}
                </div>
                {editingComment === c.id ? (
                  <div>
                    <input value={editCommentText} onChange={e => setEditCommentText(e.target.value)} onKeyDown={e => e.key === "Enter" && saveEditComment(c.id)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "4px 8px", color: "#fff", fontSize: 12, outline: "none", width: "100%" }} />
                    <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                      <button onClick={() => saveEditComment(c.id)} style={{ background: accent, border: "none", borderRadius: 6, color: "#000", fontSize: 10, padding: "3px 8px", cursor: "pointer", fontWeight: 700 }}>Kaydet</button>
                      <button onClick={() => setEditingComment(null)} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 6, color: "rgba(255,255,255,0.4)", fontSize: 10, padding: "3px 8px", cursor: "pointer" }}>İptal</button>
                    </div>
                  </div>
                ) : <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{c.content}</div>}
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <input value={commentInput} onChange={e => setCommentInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addComment()} placeholder="Yorum yaz..." style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "9px 14px", color: "#fff", fontSize: 13, outline: "none", flex: 1 }} />
            <button onClick={addComment} style={{ border: "none", borderRadius: "50%", background: `linear-gradient(135deg,${accent},#bf5af2)`, color: "#fff", cursor: "pointer", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
function FeedScreen({ user, profile, accent, onThemeChange }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [posting, setPosting] = useState(false);
  const [mood, setMood] = useState(null);
  const [bgColor, setBgColor] = useState("transparent");
  const [location, setLocation] = useState(null);
  const [gettingLoc, setGettingLoc] = useState(false);
  const [showMoods, setShowMoods] = useState(false);
  const [showBgs, setShowBgs] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const fileRef = useRef();

  const loadPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false })
        .limit(40);
      
      if (error) throw error;
      if (!data) { setLoading(false); return; }
      
      const formattedPosts = data.map(post => ({
        ...post,
        profiles: post.profiles || { username: "Silinmiş Kullanıcı" }
      }));
      
      const pinned = formattedPosts.filter(p => p.pinned && p.user_id === user.id);
      const rest = formattedPosts.filter(p => !(p.pinned && p.user_id === user.id));
      setPosts([...pinned, ...rest]);
    } catch (error) {
      console.error("Gönderiler yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPosts();
    const ch = supabase.channel("feed_ch").on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, () => loadPosts()).subscribe();
    return () => supabase.removeChannel(ch);
  }, [loadPosts]);

  const getLocation = () => {
    if (!navigator.geolocation) return; setGettingLoc(true);
    navigator.geolocation.getCurrentPosition(async pos => {
      try {
        const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
        const d = await r.json();
        setLocation(d.address?.city || d.address?.town || "Konum alındı");
      } catch { setLocation("Konum alındı"); }
      setGettingLoc(false);
    }, () => setGettingLoc(false));
  };

  const handleFile = async e => {
    const raw = e.target.files[0]; if (!raw) return;
    const f = await convertFile(raw);
    setMediaFile(f); setMediaType(f.type.startsWith("video") ? "video" : "image");
    const r = new FileReader(); r.onload = ev => setMediaPreview(ev.target.result); r.readAsDataURL(f);
  };

  const submit = async () => {
    if (!content.trim() && !mediaFile) return; setPosting(true);
    let media_url = null, media_type = null;
    if (mediaFile) {
      const ext = mediaFile.name.split(".").pop();
      const path = `posts/${user.id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("post-media").upload(path, mediaFile);
      if (!error) { const { data: u } = supabase.storage.from("post-media").getPublicUrl(path); media_url = u.publicUrl; media_type = mediaType; }
    }
    await supabase.from("posts").insert({ user_id: user.id, content: content.trim(), media_url, media_type, mood, bg_color: bgColor, location });
    setContent(""); setMediaFile(null); setMediaPreview(null); setMood(null); setBgColor("transparent"); setLocation(null);
    setPosting(false); loadPosts();
  };

  const trendPost = useMemo(() => posts.find(p => { const diff = (Date.now() - new Date(p.created_at)) / 1000; return diff < 3600 && (p.likes || []).length > 0; }), [posts]);
  const glassBtn = (active, col) => { col = col || accent; return { background: active ? (col + "18") : "rgba(255,255,255,0.04)", border: "1px solid " + (active ? (col + "44") : "rgba(255,255,255,0.08)"), borderRadius: 20, padding: "6px 12px", color: active ? col : "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13 }; };

  return (
    <div style={{ background: "#050508" }}>
      <div style={{ margin: "12px 14px", borderRadius: 20, background: bgColor !== "transparent" ? bgColor : "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", padding: 14 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Avatar name={profile?.username} url={profile?.avatar_url} size={40} />
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={"Ne düşünüyorsun? " + (mood || "")} rows={2} style={{ flex: 1, background: "none", border: "none", outline: "none", color: "rgba(255,255,255,0.7)", fontSize: 14, resize: "none", lineHeight: 1.5, paddingTop: 8 }} />
        </div>
        {(location || gettingLoc) && <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, color: "#39ff14", fontSize: 12 }}>📍 {gettingLoc ? "Konum alınıyor..." : location}{location && <button onClick={() => setLocation(null)} style={{ background: "none", border: "none", color: "#ff6b9d", cursor: "pointer", fontSize: 15 }}>×</button>}</div>}
        {mediaPreview && (
          <div style={{ position: "relative", marginTop: 10, borderRadius: 12, overflow: "hidden" }}>
            {mediaType === "video" ? <video src={mediaPreview} style={{ width: "100%", maxHeight: 200 }} controls /> : <img src={mediaPreview} alt="" style={{ width: "100%", maxHeight: 200, objectFit: "cover" }} />}
            <button onClick={() => { setMediaFile(null); setMediaPreview(null); }} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: 28, height: 28, color: "#fff", cursor: "pointer", fontSize: 16 }}>×</button>
          </div>
        )}
        {showMoods && <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>{MOODS.map(m => <button key={m} onClick={() => { setMood(m); setShowMoods(false); }} style={{ fontSize: 22, background: mood === m ? (accent + "22") : "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "4px 8px", cursor: "pointer" }}>{m}</button>)}</div>}
        {showBgs && <div style={{ marginTop: 10 }}><div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginBottom: 6 }}>Kart rengi:</div><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{BG_COLORS.map(c => <button key={c} onClick={() => { setBgColor(c); setShowBgs(false); }} style={{ width: 32, height: 32, borderRadius: 8, background: c === "transparent" ? "rgba(255,255,255,0.06)" : c, border: bgColor === c ? ("2px solid " + accent) : "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }} />)}</div></div>}
        {showTheme && <div style={{ marginTop: 10 }}><div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginBottom: 6 }}>🌈 Tema rengi:</div><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{THEME_COLORS.map(c => <button key={c} onClick={() => { onThemeChange(c); setShowTheme(false); }} style={{ width: 32, height: 32, borderRadius: "50%", background: c, border: accent === c ? "3px solid #fff" : "2px solid rgba(255,255,255,0.15)", cursor: "pointer" }} />)}</div></div>}
        <div style={{ display: "flex", gap: 6, justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button onClick={() => fileRef.current.click()} style={glassBtn(!!mediaFile)}>📷</button>
            <input ref={fileRef} type="file" accept="image/*,.heic,.heif,video/*" onChange={handleFile} style={{ display: "none" }} />
            <button onClick={() => { setShowMoods(!showMoods); setShowBgs(false); setShowTheme(false); }} style={glassBtn(!!mood)}>{mood || "😊"}</button>
            <button onClick={() => { setShowBgs(!showBgs); setShowMoods(false); setShowTheme(false); }} style={glassBtn(bgColor !== "transparent")}>🎨</button>
            <button onClick={() => { setShowTheme(!showTheme); setShowMoods(false); setShowBgs(false); }} style={glassBtn(false)}>🌈</button>
            <button onClick={getLocation} style={glassBtn(!!location)}>📍</button>
          </div>
          <button onClick={submit} disabled={posting || (!content.trim() && !mediaFile)} style={{ border: "none", borderRadius: 14, background: `linear-gradient(135deg,${accent},#bf5af2)`, color: "#fff", fontWeight: 600, cursor: "pointer", padding: "8px 20px", fontSize: 13, opacity: (!content.trim() && !mediaFile) ? 0.4 : 1 }}>
            {posting ? "⏳" : "Paylaş"}
          </button>
        </div>
      </div>
      {trendPost && (
        <div style={{ margin: "0 14px 12px", borderRadius: 16, background: "rgba(255,45,120,0.06)", border: "1px solid rgba(255,45,120,0.2)", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>🔥</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "rgba(255,45,120,0.8)", fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 2 }}>SON 1 SAATİN TRENDİ</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{trendPost.profiles?.username}: {trendPost.content || "📷 Medya"}</div>
          </div>
          <div style={{ color: "#ff2d78", fontSize: 12, fontWeight: 700 }}>❤️ {(trendPost.likes || []).length}</div>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 14px 8px" }}>
        <button onClick={loadPosts} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "6px 12px", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 12 }}>🔄 Yenile</button>
      </div>
      {loading && <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.3)" }}>Yükleniyor...</div>}
      {!loading && posts.length === 0 && <div style={{ textAlign: "center", padding: 60 }}><div style={{ fontSize: 48, marginBottom: 12 }}>🌀</div><div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Henüz gönderi yok</div></div>}
      {posts.map(p => (
        <PostCard key={p.id} post={p} user={user} accent={accent}
          onDelete={id => setPosts(prev => prev.filter(x => x.id !== id))}
          onUpdate={(id, c) => setPosts(prev => prev.map(x => x.id === id ? { ...x, content: c } : x))} />
      ))}
    </div>
  );
}

function PostScreen({ user, profile, onPosted, accent }) {
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [posting, setPosting] = useState(false);
  const [mood, setMood] = useState(null);
  const [bgColor, setBgColor] = useState("transparent");
  const [location, setLocation] = useState(null);
  const [gettingLoc, setGettingLoc] = useState(false);
  const [showMoods, setShowMoods] = useState(false);
  const [showBgs, setShowBgs] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const fileRef = useRef();

  const loadMyPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      
      if (error) throw error;
      if (!data) { setLoadingPosts(false); return; }
      
      const formattedPosts = data.map(post => ({
        ...post,
        profiles: post.profiles || { username: profile?.username, avatar_url: profile?.avatar_url }
      }));
      
      setMyPosts(formattedPosts);
    } catch (error) {
      console.error("Gönderiler yüklenirken hata:", error);
    } finally {
      setLoadingPosts(false);
    }
  }, [user, profile]);

  useEffect(() => { loadMyPosts(); }, [loadMyPosts]);

  const getLocation = () => {
    if (!navigator.geolocation) return; setGettingLoc(true);
    navigator.geolocation.getCurrentPosition(async pos => {
      try {
        const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
        const d = await r.json();
        setLocation(d.address?.city || d.address?.town || "Konum alındı");
      } catch { setLocation("Konum alındı"); }
      setGettingLoc(false);
    }, () => setGettingLoc(false));
  };

  const handleFile = async e => {
    const raw = e.target.files[0]; if (!raw) return;
    const f = await convertFile(raw);
    setMediaFile(f); setMediaType(f.type.startsWith("video") ? "video" : "image");
    const r = new FileReader(); r.onload = ev => setMediaPreview(ev.target.result); r.readAsDataURL(f);
  };

  const submit = async () => {
    if (!content.trim() && !mediaFile) return; setPosting(true);
    let media_url = null, media_type = null;
    if (mediaFile) {
      const ext = mediaFile.name.split(".").pop();
      const path = `posts/${user.id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("post-media").upload(path, mediaFile);
      if (!error) { const { data: u } = supabase.storage.from("post-media").getPublicUrl(path); media_url = u.publicUrl; media_type = mediaType; }
    }
    await supabase.from("posts").insert({ user_id: user.id, content: content.trim(), media_url, media_type, mood, bg_color: bgColor, location });
    setContent(""); setMediaFile(null); setMediaPreview(null); setMood(null); setBgColor("transparent"); setLocation(null);
    setPosting(false); loadMyPosts();
    if (onPosted) onPosted();
  };

  const glassBtn = (active, col = accent) => ({ background: active ? `${col}18` : "rgba(255,255,255,0.04)", border: `1px solid ${active ? col + "44" : "rgba(255,255,255,0.08)"}`, borderRadius: 20, padding: "6px 12px", color: active ? col : "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13 });

  return (
    <div style={{ padding: 16, background: "#050508", minHeight: "100%" }}>
      <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>YENİ GÖNDERİ</div>
      <div style={{ borderRadius: 20, background: bgColor !== "transparent" ? bgColor : "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", padding: 16, marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
          <Avatar name={profile?.username} url={profile?.avatar_url} size={44} />
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={`Ne düşünüyorsun? ${mood || ""}`} rows={4} style={{ flex: 1, background: "none", border: "none", outline: "none", color: "rgba(255,255,255,0.8)", fontSize: 15, resize: "none", lineHeight: 1.6 }} />
        </div>
        {(location || gettingLoc) && <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, color: "#39ff14", fontSize: 12 }}>📍 {gettingLoc ? "Konum alınıyor..." : location}{location && <button onClick={() => setLocation(null)} style={{ background: "none", border: "none", color: "#ff6b9d", cursor: "pointer", fontSize: 15 }}>×</button>}</div>}
        {mediaPreview && (
          <div style={{ position: "relative", marginBottom: 10, borderRadius: 12, overflow: "hidden" }}>
            {mediaType === "video" ? <video src={mediaPreview} style={{ width: "100%", maxHeight: 240, objectFit: "cover" }} controls /> : <img src={mediaPreview} alt="" style={{ width: "100%", maxHeight: 240, objectFit: "cover" }} />}
            <button onClick={() => { setMediaFile(null); setMediaPreview(null); }} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: 28, height: 28, color: "#fff", cursor: "pointer", fontSize: 16 }}>×</button>
          </div>
        )}
        {showMoods && <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>{MOODS.map(m => <button key={m} onClick={() => { setMood(m); setShowMoods(false); }} style={{ fontSize: 22, background: mood === m ? `${accent}22` : "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "4px 8px", cursor: "pointer" }}>{m}</button>)}</div>}
        {showBgs && <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>{BG_COLORS.map(c => <button key={c} onClick={() => { setBgColor(c); setShowBgs(false); }} style={{ width: 36, height: 36, borderRadius: 10, background: c === "transparent" ? "rgba(255,255,255,0.06)" : c, border: bgColor === c ? `2px solid ${accent}` : "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }} />)}</div>}
        <div style={{ display: "flex", gap: 8, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12, flexWrap: "wrap" }}>
          <button onClick={() => fileRef.current.click()} style={glassBtn(!!mediaFile)}>📷 Fotoğraf</button>
          <input ref={fileRef} type="file" accept="image/*,.heic,.heif,video/*" onChange={handleFile} style={{ display: "none" }} />
          <button onClick={() => { setShowMoods(!showMoods); setShowBgs(false); }} style={glassBtn(!!mood)}>{mood || "😊"} Mood</button>
          <button onClick={() => { setShowBgs(!showBgs); setShowMoods(false); }} style={glassBtn(bgColor !== "transparent")}>🎨</button>
          <button onClick={getLocation} style={glassBtn(!!location)}>📍</button>
        </div>
      </div>
      <button onClick={submit} disabled={posting || (!content.trim() && !mediaFile)} style={{ border: "none", borderRadius: 14, background: `linear-gradient(135deg,${accent},#bf5af2,#ff2d78)`, backgroundSize: "200%", color: "#fff", fontWeight: 600, cursor: "pointer", width: "100%", padding: 16, fontSize: 16, animation: "gradShift 4s ease infinite", boxShadow: `0 8px 32px ${accent}33`, opacity: (!content.trim() && !mediaFile) ? 0.4 : 1 }}>
        {posting ? "⏳ Paylaşılıyor..." : "✨ Paylaş"}
      </button>
      <div style={{ marginTop: 24 }}>
        <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>SON GÖNDERİLERİM</div>
        {loadingPosts && <div style={{ textAlign: "center", padding: 20, color: "rgba(255,255,255,0.3)" }}>Yükleniyor...</div>}
        {!loadingPosts && myPosts.length === 0 && <div style={{ textAlign: "center", padding: 20, color: "rgba(255,255,255,0.3)" }}>Henüz gönderi yok</div>}
        {myPosts.map(p => (
          <PostCard key={p.id} post={p} user={user} accent={accent}
            onDelete={id => setMyPosts(prev => prev.filter(x => x.id !== id))}
            onUpdate={(id, c) => setMyPosts(prev => prev.map(x => x.id === id ? { ...x, content: c } : x))} />
        ))}
      </div>
    </div>
  );
}

function ExploreScreen({ user, allProfiles, accent }) {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    supabase.from("follows").select("following_id").eq("follower_id", user.id).then(({ data }) => { if (data) setFollowingIds(data.map(f => f.following_id)); });
  }, [user]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select(`
            *,
            profiles:user_id (
              username,
              avatar_url
            )
          `)
          .not("media_url", "is", null)
          .order("created_at", { ascending: false })
          .limit(30);
        
        if (error) throw error;
        if (!data) return;
        
        const formattedPosts = data.map(post => ({
          ...post,
          profiles: post.profiles || { username: "Silinmiş Kullanıcı" }
        }));
        
        setPosts(formattedPosts);
      } catch (error) {
        console.error("Keşfet gönderileri yüklenirken hata:", error);
      }
    };
    load();
  }, []);
  
function ProfileScreen({ user, profile, onLogout, onUpdateProfile, accent }) {
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(profile?.username || "");
  const [newBio, setNewBio] = useState(profile?.bio || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const avatarRef = useRef();

  useEffect(() => { setNewUsername(profile?.username || ""); setNewBio(profile?.bio || ""); }, [profile]);

  useEffect(() => {
    Promise.all([
      supabase.from("posts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("follows").select("*").eq("following_id", user.id),
      supabase.from("follows").select("*").eq("follower_id", user.id),
      supabase.from("saved_posts").select("*,posts(*)").eq("user_id", user.id)
    ]).then(([{ data: p }, { data: f1 }, { data: f2 }, { data: s }]) => {
      if (p) setPosts(p); if (f1) setFollowers(f1); if (f2) setFollowing(f2);
      if (s) setSavedPosts(s.map(x => x.posts).filter(Boolean));
    });
  }, [user]);

  const saveProfile = async () => {
    if (!newUsername.trim()) return; setSaving(true); setError("");
    const { data: ex } = await supabase.from("profiles").select("id").eq("username", newUsername.trim()).neq("id", user.id).maybeSingle();
    if (ex) { setError("Bu kullanıcı adı alınmış!"); setSaving(false); return; }
    const { error: err } = await supabase.from("profiles").update({ username: newUsername.trim(), bio: newBio.trim() }).eq("id", user.id);
    if (err) { setError("Kaydetme hatası!"); setSaving(false); return; }
    const updated = { ...profile, username: newUsername.trim(), bio: newBio.trim() };
    lsSet("aura_profile", updated);
    pCache.set(user.id, { username: updated.username, avatar_url: updated.avatar_url });
    onUpdateProfile(updated);
    setEditing(false); setSaving(false);
  };

  const uploadAvatar = async e => {
    const raw = e.target.files[0]; if (!raw) return; setUploadingAvatar(true);
    const f = await convertFile(raw);
    const ext = f.name.split(".").pop();
    const path = `avatars/${user.id}_${Date.now()}.${ext}`;
    const { error: err } = await supabase.storage.from("post-media").upload(path, f, { upsert: true });
    if (err) { setUploadingAvatar(false); return; }
    const { data } = supabase.storage.from("post-media").getPublicUrl(path);
    const newUrl = data.publicUrl + "?v=" + Date.now();
    await supabase.from("profiles").update({ avatar_url: newUrl }).eq("id", user.id);
    const updated = { ...profile, avatar_url: newUrl };
    lsSet("aura_profile", updated);
    pCache.set(user.id, { username: profile?.username, avatar_url: newUrl });
    onUpdateProfile(updated);
    setUploadingAvatar(false);
  };

  const allPosts = activeTab === "posts" ? posts : savedPosts;
  const mediaPosts = allPosts.filter(p => p?.media_url);
  const textPosts = allPosts.filter(p => !p?.media_url && p?.content);

  return (
    <div style={{ background: "#050508", minHeight: "100%" }}>
      {selectedPost && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 300, display: "flex", flexDirection: "column", backdropFilter: "blur(12px)" }} onClick={() => setSelectedPost(null)}>
          <div style={{ background: "rgba(10,10,20,0.98)", flex: 1, overflowY: "auto", borderRadius: "24px 24px 0 0", marginTop: 60, border: "1px solid rgba(255,255,255,0.08)", animation: "slideUp 0.3s ease" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: 16, display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <button onClick={() => setSelectedPost(null)} style={{ background: "rgba(255,255,255,0.06)", border: "none", cursor: "pointer", color: accent, width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
              </button>
              <div style={{ color: "#fff", fontWeight: 700 }}>Gönderi</div>
            </div>
            <PostCard post={{ ...selectedPost, profiles: { username: profile?.username, avatar_url: profile?.avatar_url } }} user={user} accent={accent}
              onDelete={id => { setPosts(prev => prev.filter(x => x.id !== id)); setSelectedPost(null); }}
              onUpdate={(id, c) => { setPosts(prev => prev.map(x => x.id === id ? { ...x, content: c } : x)); setSelectedPost(prev => prev?.id === id ? { ...prev, content: c } : prev); }} />
          </div>
        </div>
      )}
      <div style={{ padding: "24px 20px 16px", display: "flex", flexDirection: "column", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ position: "relative", marginBottom: 16 }}>
          <Avatar name={profile?.username} url={profile?.avatar_url} size={96} />
          <button onClick={() => avatarRef.current.click()} style={{ position: "absolute", bottom: 0, right: 0, width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${accent},#bf5af2)`, border: "2.5px solid #050508", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
            {uploadingAvatar ? "⏳" : "📷"}
          </button>
          <input ref={avatarRef} type="file" accept="image/*,.heic,.heif" onChange={uploadAvatar} style={{ display: "none" }} />
        </div>
        {editing ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%" }}>
            <input value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="Kullanıcı adı" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "13px 16px", color: "#fff", fontSize: 14, outline: "none", width: "80%", textAlign: "center" }} />
            <textarea value={newBio} onChange={e => setNewBio(e.target.value)} placeholder="Hakkında..." rows={2} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "13px 16px", color: "#fff", fontSize: 14, outline: "none", width: "80%", resize: "none" }} />
            {error && <div style={{ color: "#ff6b9d", fontSize: 12 }}>{error}</div>}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={saveProfile} disabled={saving} style={{ border: "none", borderRadius: 14, background: `linear-gradient(135deg,${accent},#bf5af2)`, color: "#fff", fontWeight: 600, cursor: "pointer", padding: "8px 20px", fontSize: 13 }}>{saving ? "⏳" : "Kaydet"}</button>
              <button onClick={() => setEditing(false)} style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, background: "rgba(255,255,255,0.06)", color: "#fff", cursor: "pointer", padding: "8px 20px", fontSize: 13 }}>İptal</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>{profile?.username || "Kullanıcı"}</div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, marginTop: 3 }}>{user?.email}</div>
            {profile?.bio && <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 8, textAlign: "center", maxWidth: 280, lineHeight: 1.5 }}>{profile.bio}</div>}
            <button onClick={() => setEditing(true)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "8px 20px", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13, marginTop: 12 }}>✏️ Profili Düzenle</button>
          </>
        )}
        <div style={{ display: "flex", gap: 32, marginTop: 20 }}>
          {[[posts.length, "Gönderi"], [followers.length, "Takipçi"], [following.length, "Takip"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ color: "#fff", fontSize: 20, fontWeight: 800 }}>{n}</div>
              <div style={{ color: `${accent}99`, fontSize: 12, marginTop: 1 }}>{l}</div>
            </div>
          ))}
        </div>
        <button onClick={onLogout} style={{ marginTop: 16, padding: "9px 28px", borderRadius: 20, background: "rgba(255,45,120,0.08)", border: "1px solid rgba(255,45,120,0.25)", color: "#ff6b9d", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Çıkış Yap</button>
      </div>
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {[["posts", "📷 Gönderiler"], ["saved", "🔖 Kaydedilenler"]].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{ flex: 1, padding: 12, background: "none", border: "none", borderBottom: activeTab === id ? `2px solid ${accent}` : "2px solid transparent", color: activeTab === id ? accent : "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{label}</button>
        ))}
      </div>
      {mediaPosts.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, padding: 2 }}>
          {mediaPosts.map(p => (
            <div key={p.id} style={{ aspectRatio: "1", overflow: "hidden", cursor: "pointer", position: "relative" }} onClick={() => setSelectedPost(p)}>
              {p.media_type === "video" ? <video src={p.media_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <img src={p.media_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              {p.pinned && <div style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.6)", borderRadius: 6, padding: "2px 4px", fontSize: 10 }}>📌</div>}
            </div>
          ))}
        </div>
      )}
      {textPosts.map(p => (
        <div key={p.id} onClick={() => setSelectedPost(p)} style={{ margin: "0 14px 10px", padding: "14px 16px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer" }}>
          {p.mood && <span style={{ fontSize: 18, marginRight: 6 }}>{p.mood}</span>}
          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.6 }}>{p.content}</span>
          <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, marginTop: 8 }}>{timeAgo(p.created_at)} · ❤️ {(p.likes || []).length}</div>
        </div>
      ))}
      {allPosts.length === 0 && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{activeTab === "saved" ? "🔖" : "🌀"}</div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>{activeTab === "saved" ? "Kaydedilen gönderi yok" : "Henüz paylaşım yok"}</div>
        </div>
      )}
    </div>
  );
}

function MessagesScreen({ user, profile, allProfiles, accent }) {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [unread, setUnread] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [followingIds, setFollowingIds] = useState([]);
  const [showAttach, setShowAttach] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [ctxMenu, setCtxMenu] = useState(null);
  const [reactions, setReactions] = useState({});
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    supabase.from("follows").select("following_id").eq("follower_id", user.id).then(({ data }) => { if (data) setFollowingIds(data.map(f => f.following_id)); });
  }, [user]);

  useEffect(() => {
    const ch = supabase.channel("unread_g").on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (p) => {
      const msg = p.new;
      if (msg.receiver_id === user.id) { setUnread(prev => ({ ...prev, [msg.sender_id]: (prev[msg.sender_id] || 0) + 1 })); setLastMessages(prev => ({ ...prev, [msg.sender_id]: msg })); }
      if (msg.sender_id === user.id) setLastMessages(prev => ({ ...prev, [msg.receiver_id]: msg }));
    }).subscribe();
    return () => supabase.removeChannel(ch);
  }, [user]);

  useEffect(() => {
    if (!selectedUser) return;
    setUnread(prev => ({ ...prev, [selectedUser.id]: 0 }));
    supabase.from("messages").select("*").or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${user.id})`).order("created_at").then(({ data }) => { if (data) setMessages(data); });
    const ch = supabase.channel("chat_" + selectedUser.id).on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (p) => {
      const msg = p.new;
      if ((msg.sender_id === user.id && msg.receiver_id === selectedUser.id) || (msg.sender_id === selectedUser.id && msg.receiver_id === user.id)) {
        setMessages(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg]);
      }
    }).subscribe();
    return () => supabase.removeChannel(ch);
  }, [selectedUser, user]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async (content, type = "text") => {
    const text = content || input.trim(); if (!text || !selectedUser) return;
    const temp = { id: "tmp_" + Date.now(), sender_id: user.id, receiver_id: selectedUser.id, content: text, type, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, temp]); if (!content) setInput("");
    setShowAttach(false); setShowEmoji(false);
    await supabase.from("messages").insert({ sender_id: user.id, receiver_id: selectedUser.id, content: text, type });
  };

  const sendFile = async e => {
    const raw = e.target.files[0]; if (!raw) return;
    const f = await convertFile(raw);
    const ext = f.name.split(".").pop();
    const path = `messages/${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("post-media").upload(path, f);
    if (error) return;
    const { data } = supabase.storage.from("post-media").getPublicUrl(path);
    sendMessage(data.publicUrl, f.type.startsWith("video") ? "video" : "image");
  };

  const handleInput = e => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
  };

  const grouped = useMemo(() => messages.reduce((g, msg) => {
    const date = new Date(msg.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
    if (!g[date]) g[date] = []; g[date].push(msg); return g;
  }, {}), [messages]);

  const followedUsers = useMemo(() => allProfiles.filter(u => u.id !== user.id && followingIds.includes(u.id)), [allProfiles, user, followingIds]);
  const filtered = useMemo(() => followedUsers.filter(u => (u.username || u.email || "").toLowerCase().includes(search.toLowerCase())), [followedUsers, search]);
  const sorted = useMemo(() => [...filtered].sort((a, b) => (lastMessages[b.id]?.created_at || "").localeCompare(lastMessages[a.id]?.created_at || "")), [filtered, lastMessages]);
  const totalUnread = useMemo(() => Object.values(unread).reduce((a, b) => a + b, 0), [unread]);

  if (selectedUser) return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#050508" }}>
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, background: "rgba(5,5,8,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <button onClick={() => { setSelectedUser(null); setMessages([]); }} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={accent} strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
        </button>
        <Avatar name={selectedUser.username} url={selectedUser.avatar_url} size={40} online />
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{selectedUser.username || selectedUser.email}</div>
          <div style={{ color: "#39ff14", fontSize: 11 }}>● çevrimiçi</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>📞</div>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>🎥</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 4, scrollbarWidth: "none" }} onClick={() => setCtxMenu(null)}>
        {messages.length === 0 && <div style={{ textAlign: "center", padding: "40px 20px" }}><div style={{ fontSize: 48, marginBottom: 12 }}>👋</div><div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>İlk mesajı sen at!</div></div>}
        {Object.entries(grouped).map(([date, msgs]) => (
          <div key={date}>
            <div style={{ textAlign: "center", margin: "12px 0" }}><span style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)", fontSize: 11, padding: "4px 12px", borderRadius: 20 }}>{date}</span></div>
            {msgs.map((msg, i) => {
              const isMe = msg.sender_id === user.id;
              const isImg = msg.type === "image", isVid = msg.type === "video";
              const showAv = !isMe && (i === msgs.length - 1 || msgs[i + 1]?.sender_id !== msg.sender_id);
              return (
                <div key={msg.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8, marginBottom: 2 }}
                  onContextMenu={e => { e.preventDefault(); setCtxMenu({ msg, x: e.clientX, y: e.clientY }); }}>
                  {!isMe && (showAv ? <Avatar name={selectedUser.username} url={selectedUser.avatar_url} size={28} /> : <div style={{ width: 28, flexShrink: 0 }} />)}
                  <div style={{ display: "flex", flexDirection: "column", maxWidth: "72%", alignItems: isMe ? "flex-end" : "flex-start" }}>
                    <div style={{ padding: isImg || isVid ? "4px" : "10px 14px", borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: isMe ? `linear-gradient(135deg,${accent}cc,#7b2ff7)` : "rgba(255,255,255,0.07)", border: isMe ? "none" : "1px solid rgba(255,255,255,0.08)", color: "#F1F5F9", fontSize: 14, lineHeight: 1.5, opacity: msg.id?.startsWith("tmp_") ? 0.6 : 1, overflow: "hidden" }}>
                      {isImg && <img src={msg.content} alt="" style={{ width: "100%", maxWidth: 220, borderRadius: 14, display: "block" }} />}
                      {isVid && <video src={msg.content} controls style={{ width: "100%", maxWidth: 220, borderRadius: 14 }} />}
                      {!isImg && !isVid && msg.content}
                    </div>
                    {reactions[msg.id] && <div style={{ marginTop: 3, background: "rgba(255,255,255,0.08)", borderRadius: 20, padding: "2px 8px", fontSize: 13 }}>{reactions[msg.id]}</div>}
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3, flexDirection: isMe ? "row-reverse" : "row" }}>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{fmtTime(msg.created_at)}</span>
                      {isMe && <span style={{ fontSize: 11, color: accent }}>✓✓</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
          {ctxMenu && (
      <div style={{ position: "fixed", top: Math.min(ctxMenu.y, window.innerHeight - 220), left: Math.min(ctxMenu.x, window.innerWidth - 170), background: "rgba(15,15,25,0.98)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 6, zIndex: 1000, minWidth: 160, boxShadow: "0 16px 40px rgba(0,0,0,0.6)", backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", gap: 4, padding: "8px 10px 4px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 4 }}>
          {QUICK_REACTIONS.map(e => <div key={e} style={{ fontSize: 22, cursor: "pointer", padding: 4, borderRadius: 8 }} onClick={() => { setReactions(prev => ({ ...prev, [ctxMenu.msg.id]: e })); setCtxMenu(null); }}>{e}</div>)}
        </div>
        <div onClick={() => { navigator.clipboard?.writeText(ctxMenu.msg.content); setCtxMenu(null); }} style={{ padding: "10px 14px", borderRadius: 10, cursor: "pointer", color: "#fff", fontSize: 13 }}>📋 Kopyala</div>
        {ctxMenu.msg.sender_id === user.id && <div onClick={async () => { setMessages(prev => prev.filter(m => m.id !== ctxMenu.msg.id)); await supabase.from("messages").delete().eq("id", ctxMenu.msg.id); setCtxMenu(null); }} style={{ padding: "10px 14px", borderRadius: 10, cursor: "pointer", color: "#ff6b9d", fontSize: 13 }}>🗑️ Sil</div>}
        <div onClick={() => setCtxMenu(null)} style={{ padding: "10px 14px", borderRadius: 10, cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>✕ Kapat</div>
      </div>
    )}
    {showEmoji && (
      <div style={{ padding: "0 12px 8px" }}>
        <div style={{ background: "rgba(15,15,25,0.98)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 12, display: "flex", flexWrap: "wrap", gap: 4, maxHeight: 160, overflowY: "auto" }}>
          {EMOJIS.map(e => <div key={e} style={{ fontSize: 24, cursor: "pointer", padding: 4, borderRadius: 8 }} onClick={() => { setInput(p => p + e); setShowEmoji(false); textareaRef.current?.focus(); }}>{e}</div>)}
        </div>
      </div>
    )}
    {showAttach && (
      <div style={{ padding: "0 16px 8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", gap: 10, padding: "10px 0 4px" }}>
          {[["📷", "Fotoğraf", `${accent}18`], ["🎥", "Video", "rgba(191,90,242,0.12)"], ["📍", "Konum", "rgba(57,255,20,0.12)"], ["📄", "Dosya", "rgba(255,149,0,0.12)"]].map(([icon, label, bg]) => (
            <div key={label} onClick={label === "Konum" ? () => { navigator.geolocation?.getCurrentPosition(pos => sendMessage(`📍 Konumum: https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`)); setShowAttach(false); } : () => fileRef.current?.click()} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{icon}</div>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{label}</span>
            </div>
          ))}
        </div>
        <input ref={fileRef} type="file" accept="image/*,.heic,.heif,video/*" onChange={sendFile} style={{ display: "none" }} />
      </div>
    )}
    <div style={{ padding: "10px 12px 32px", background: "rgba(5,5,8,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
        <div onClick={() => { setShowAttach(!showAttach); setShowEmoji(false); }} style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18, flexShrink: 0 }}>📎</div>
        <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 22, padding: "11px 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <textarea ref={textareaRef} value={input} onChange={handleInput} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Mesaj yaz..." rows={1} style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: 14, flex: 1, resize: "none", maxHeight: 100, overflowY: "auto", scrollbarWidth: "none", lineHeight: 1.4 }} />
          <span onClick={() => { setShowEmoji(!showEmoji); setShowAttach(false); }} style={{ fontSize: 18, cursor: "pointer", opacity: 0.5, flexShrink: 0 }}>😊</span>
        </div>
        {input.trim()
          ? <button onClick={() => sendMessage()} style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${accent},#bf5af2)`, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 4px 18px ${accent}44` }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
          </button>
          : <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18, flexShrink: 0 }}>🎤</div>
        }
      </div>
    </div>
  </div>
);
    return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 16px 8px", background: "rgba(5,5,8,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <div style={{ color: "#fff", fontSize: 18, fontWeight: 800, marginBottom: 12 }}>
          💬 Mesajlar
          {totalUnread > 0 && <span style={{ marginLeft: 8, background: `linear-gradient(135deg,${accent},#bf5af2)`, borderRadius: 20, padding: "2px 10px", fontSize: 12, color: "#fff" }}>{totalUnread}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "11px 14px" }}>
          <svg width="16" height="16" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Kişi ara..." style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: 14, flex: 1 }} />
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
        {sorted.length === 0
          ? <div style={{ textAlign: "center", padding: 40 }}><div style={{ fontSize: 40, marginBottom: 12 }}>💬</div><div style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Takip ettiğin kişiler burada görünür</div></div>
          : sorted.map(u => {
            const last = lastMessages[u.id], uc = unread[u.id] || 0, isU = uc > 0;
            return (
              <div key={u.id} onClick={() => setSelectedUser(u)} style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)", background: isU ? `${accent}08` : "transparent" }}>
                <Avatar name={u.username || u.email} url={u.avatar_url} size={52} online />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{u.username || u.email}</div>
                  {last && <div style={{ color: isU ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {last.sender_id === user.id && <span style={{ color: `${accent}88` }}>Sen: </span>}
                    {last.type === "image" ? "📷 Fotoğraf" : last.type === "video" ? "🎥 Video" : last.content?.substring(0, 40)}
                  </div>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
                  {last && <div style={{ color: isU ? accent : "rgba(255,255,255,0.25)", fontSize: 11 }}>{fmtTime(last.created_at)}</div>}
                  {isU ? <div style={{ background: `linear-gradient(135deg,${accent},#bf5af2)`, borderRadius: "50%", minWidth: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 700, padding: "0 4px" }}>{uc}</div> : last?.sender_id === user.id ? <span style={{ fontSize: 11, color: accent }}>✓✓</span> : null}
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}
}
export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(() => lsGet("aura_profile"));
  const [allProfiles, setAllProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feed");
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const [accent, setAccent] = useState(() => lsGet("aura_accent", "#00f5ff"));

  useEffect(() => { lsSet("aura_accent", accent); }, [accent]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); loadProfile(session.user.id); }
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) { setUser(session.user); loadProfile(session.user.id); }
      else { setUser(null); setProfile(null); localStorage.removeItem("aura_profile"); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("read", false).then(({ count }) => setUnreadNotifs(count || 0));
    const ch1 = supabase.channel("app_msgs").on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (p) => {
      if (p.new.receiver_id === user.id && activeTab !== "messages") setUnreadMessages(n => n + 1);
    }).subscribe();
    const ch2 = supabase.channel("app_notifs").on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (p) => {
      if (p.new.user_id === user.id) setUnreadNotifs(n => n + 1);
    }).subscribe();
    return () => { supabase.removeChannel(ch1); supabase.removeChannel(ch2); };
  }, [user, activeTab]);

  const loadProfile = async userId => {
    try {
      const [{ data: prof }, { data: all }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).single(),
        supabase.from("profiles").select("*")
      ]);
      if (prof) { setProfile(prof); lsSet("aura_profile", prof); pCache.set(userId, { username: prof.username, avatar_url: prof.avatar_url }); }
      if (all) setAllProfiles(all);
    } finally { setLoading(false); }
  };

  const handleUpdateProfile = useCallback(p => {
    setProfile(p); lsSet("aura_profile", p);
    pCache.set(p.id || user?.id, { username: p.username, avatar_url: p.avatar_url });
    setAllProfiles(prev => prev.map(u => u.id === p.id ? p : u));
  }, [user]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#050508", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20, fontFamily: "'DM Sans',sans-serif" }}>
      <style>{css}</style>
      <div style={{ position: "fixed", width: 400, height: 400, borderRadius: "50%", background: "#bf5af2", filter: "blur(80px)", opacity: 0.13, top: -100, left: -100, pointerEvents: "none" }} />
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(0,245,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.025) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
      <img src={LOGO} style={{ width: 88, height: 88, borderRadius: 22, objectFit: "cover", animation: "glow 2s ease-in-out infinite", position: "relative", zIndex: 1 }} alt="" />
      <div style={{ display: "flex", alignItems: "baseline", position: "relative", zIndex: 1 }}>
        <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 38, letterSpacing: 3, background: "linear-gradient(135deg,#00f5ff,#bf5af2,#ff2d78)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>AURA</span>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 14, color: "#00f5ff", marginBottom: 4 }}>sc</span>
      </div>
      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, letterSpacing: 2, position: "relative", zIndex: 1, animation: "pulse 1.5s ease-in-out infinite" }}>Yükleniyor...</div>
    </div>
  );

  if (!user) return <><style>{css}</style><AuthScreen onAuth={u => { setUser(u); loadProfile(u.id); }} /></>;

  const tabs = [
    { id: "feed", label: "Akış", icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg> },
    { id: "explore", label: "Keşfet", icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg> },
    { id: "post", label: "Paylaş", icon: null },
    { id: "messages", label: "Mesajlar", badge: unreadMessages, icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg> },
    { id: "profile", label: "Profil", icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
  ];

  return (
    <>
      <style>{css}</style>
      {showNotifs && <NotificationsPanel user={user} accent={accent} onClose={() => { setShowNotifs(false); setUnreadNotifs(0); }} />}
      <div style={{ minHeight: "100vh", background: "#050508", display: "flex", justifyContent: "center", fontFamily: "'DM Sans',sans-serif", position: "relative" }}>
        <div style={{ position: "fixed", width: 400, height: 400, borderRadius: "50%", background: accent, filter: "blur(100px)", opacity: 0.1, top: -100, left: -100, pointerEvents: "none" }} />
        <div style={{ position: "fixed", width: 300, height: 300, borderRadius: "50%", background: "#bf5af2", filter: "blur(80px)", opacity: 0.08, bottom: -80, right: -80, pointerEvents: "none" }} />
        <div style={{ position: "fixed", inset: 0, backgroundImage: `linear-gradient(${accent}15 1px,transparent 1px),linear-gradient(90deg,${accent}15 1px,transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none", opacity: 0.4 }} />
        <div style={{ width: "100%", maxWidth: 430, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
          <div style={{ padding: "48px 18px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(5,5,8,0.92)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, position: "relative", zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, letterSpacing: 2, background: `linear-gradient(90deg,${accent},#bf5af2,#ff2d78,${accent})`, backgroundSize: "300%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmer 3s linear infinite", filter: `drop-shadow(0 0 10px ${accent}55)` }}>AURA</span>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: accent, marginBottom: 2, filter: `drop-shadow(0 0 5px ${accent})` }}>sc</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div onClick={() => setShowNotifs(true)} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, position: "relative" }}>
                🔔
                {unreadNotifs > 0 && <div style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, borderRadius: "50%", background: "#ff2d78", border: "1.5px solid #050508" }} />}
              </div>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${getColor(profile?.username)},${getColor(profile?.username)}88)`, border: `2px solid ${getColor(profile?.username)}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", overflow: "hidden" }} onClick={() => setActiveTab("profile")}>
                {profile?.avatar_url ? <img src={profile.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> : getInitials(profile?.username)}
              </div>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none" }}>
            {activeTab === "feed" && <FeedScreen user={user} profile={profile} accent={accent} onThemeChange={setAccent} />}
            {activeTab === "explore" && <ExploreScreen user={user} allProfiles={allProfiles} accent={accent} />}
            {activeTab === "post" && <PostScreen user={user} profile={profile} accent={accent} onPosted={() => setActiveTab("feed")} />}
            {activeTab === "messages" && <MessagesScreen user={user} profile={profile} allProfiles={allProfiles} accent={accent} />}
            {activeTab === "profile" && <ProfileScreen user={user} profile={profile} accent={accent} onLogout={() => { supabase.auth.signOut(); setUser(null); setProfile(null); localStorage.removeItem("aura_profile"); }} onUpdateProfile={handleUpdateProfile} />}
          </div>
          <div style={{ padding: "8px 6px 32px", display: "flex", justifyContent: "space-around", background: "rgba(5,5,8,0.95)", backdropFilter: "blur(24px)", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, zIndex: 10 }}>
            {tabs.map(tab => {
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); if (tab.id === "messages") setUnreadMessages(0); }} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", padding: "7px 4px", borderRadius: 14, border: "none", background: active ? `${accent}14` : "none", position: "relative", transition: "all 0.2s" }}>
                  {tab.id === "post" ? (
                    <>
                      <div style={{ width: 44, height: 44, borderRadius: 14, background: `linear-gradient(135deg,${accent},#bf5af2,#ff2d78)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 20px ${accent}44`, marginTop: -14 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                      </div>
                      <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>{tab.label}</span>
                    </>
                  ) : (
                    <>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? accent : "rgba(255,255,255,0.25)"} strokeWidth="2" style={{ filter: active ? `drop-shadow(0 0 6px ${accent})` : "none", transition: "all 0.2s" }}>
                        {tab.icon.props.children}
                      </svg>
                      <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, color: active ? accent : "rgba(255,255,255,0.2)" }}>{tab.label}</span>
                      {tab.badge > 0 && <div style={{ position: "absolute", top: 4, right: 8, background: "#ff2d78", borderRadius: "50%", minWidth: 15, height: 15, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff", fontWeight: 700, border: "1.5px solid #050508" }}>{tab.badge}</div>}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
