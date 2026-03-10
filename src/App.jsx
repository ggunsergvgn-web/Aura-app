import { useState, useRef, useEffect } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://hebljdvucansszxhvnfp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlYmxqZHZ1Y2Fuc3N6eGh2bmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwOTQ1MTQsImV4cCI6MjA4ODY3MDUxNH0.nS3J8Z7bNano_z7jdFmIhtmYrOc6HC2FpmBPrtcPZhI"
);

const CONTACTS = [
  { id: 1, name: "Ayşe Kaya", avatar: "AK", color: "#9B59B6", lastMsg: "Yarın görüşelim mi?", time: "1h", unread: 3, online: true },
  { id: 2, name: "Mert Demir", avatar: "MD", color: "#8E44AD", lastMsg: "Fotoğrafları gördüm 🔥", time: "2h", unread: 0, online: true },
  { id: 3, name: "Selin Yıldız", avatar: "SY", color: "#6C3483", lastMsg: "Harika bir gündü!", time: "3h", unread: 1, online: false },
  { id: 4, name: "Burak Arslan", avatar: "BA", color: "#7D3C98", lastMsg: "👍", time: "5h", unread: 0, online: false },
  { id: 5, name: "Zeynep Çelik", avatar: "ZÇ", color: "#A569BD", lastMsg: "Nasılsın?", time: "1d", unread: 0, online: true },
];

const POSTS = [
  { id: 1, user: "Ayşe Kaya", avatar: "AK", color: "#9B59B6", time: "2 saat önce", image: "https://picsum.photos/seed/post1/400/400", caption: "Harika bir gün ☀️", likes: 142, comments: 18, liked: false },
  { id: 2, user: "Mert Demir", avatar: "MD", color: "#8E44AD", time: "4 saat önce", image: "https://picsum.photos/seed/post2/400/400", caption: "İstanbul gecesi 🌙", likes: 89, comments: 7, liked: false },
  { id: 3, user: "Selin Yıldız", avatar: "SY", color: "#6C3483", time: "Dün", image: "https://picsum.photos/seed/post3/400/400", caption: "Kahve molası ☕", likes: 203, comments: 24, liked: false },
];

const INITIAL_MESSAGES = {
  1: [{ id: 1, text: "Merhaba! Nasılsın? 😊", from: "them", time: "14:20" }, { id: 2, text: "İyiyim teşekkürler!", from: "me", time: "14:21" }, { id: 3, text: "Yarın görüşelim mi?", from: "them", time: "14:32" }],
  2: [{ id: 1, text: "Fotoğrafları paylaştın mı?", from: "them", time: "13:10" }, { id: 2, text: "Evet az önce attım!", from: "me", time: "13:12" }, { id: 3, text: "Fotoğrafları gördüm 🔥", from: "them", time: "13:15" }],
};

const TRENDING = ["AI", "Party", "Zen", "Career", "Travel", "Music"];

function Avatar({ name, color, size = 42, online }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2);
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, ${color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.3, fontWeight: 700, color: "#fff", border: "2px solid rgba(255,255,255,0.15)" }}>
        {initials}
      </div>
      {online && <div style={{ position: "absolute", bottom: 1, right: 1, width: size * 0.22, height: size * 0.22, borderRadius: "50%", background: "#A855F7", border: "2px solid #1a0533" }} />}
    </div>
  );
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess("Kayıt başarılı! E-postanı kontrol et.");
      }
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 30px", background: "radial-gradient(ellipse at top, #2d0b5e 0%, #1a0533 50%, #0d0018 100%)" }}>
      <div style={{ width: 80, height: 80, borderRadius: "24px", background: "linear-gradient(135deg, #A855F7, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, marginBottom: 16, boxShadow: "0 20px 40px rgba(168,85,247,0.4)" }}>🌀</div>
      <div style={{ color: "#fff", fontSize: 34, fontWeight: 800, marginBottom: 4, letterSpacing: -1 }}>Aura</div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 40 }}>Sosyal platformun</div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-posta" type="email" style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 16, padding: "14px 18px", color: "#fff", fontSize: 15, outline: "none", fontFamily: "inherit" }} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Şifre" type="password" style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 16, padding: "14px 18px", color: "#fff", fontSize: 15, outline: "none", fontFamily: "inherit" }} />
        {error && <div style={{ color: "#F87171", fontSize: 13, textAlign: "center" }}>{error}</div>}
        {success && <div style={{ color: "#A855F7", fontSize: 13, textAlign: "center" }}>{success}</div>}
        <button onClick={handle} disabled={loading} style={{ background: "linear-gradient(135deg, #A855F7, #7C3AED)", border: "none", borderRadius: 16, padding: "16px", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 8, fontFamily: "inherit", boxShadow: "0 10px 30px rgba(168,85,247,0.4)" }}>
          {loading ? "⏳" : mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
        </button>
        <button onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
          {mode === "login" ? "Hesabın yok mu? Kayıt ol" : "Zaten hesabın var mı? Giriş yap"}
        </button>
      </div>
    </div>
  );
}

function MessagesScreen({ contacts, messages, setMessages }) {
  const [selectedContact, setSelectedContact] = useState(null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, selectedContact]);

  const sendMessage = () => {
    if (!input.trim() || !selectedContact) return;
    const newMsg = { id: Date.now(), text: input.trim(), from: "me", time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) };
    setMessages(prev => ({ ...prev, [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsg] }));
    setInput("");
  };

  const filtered = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {selectedContact ? (
        <>
          <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, background: "rgba(168,85,247,0.1)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(168,85,247,0.2)" }}>
            <button onClick={() => setSelectedContact(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#A855F7" }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            </button>
            <Avatar name={selectedContact.name} color={selectedContact.color} size={38} online={selectedContact.online} />
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{selectedContact.name}</div>
              <div style={{ color: selectedContact.online ? "#A855F7" : "rgba(255,255,255,0.3)", fontSize: 11 }}>{selectedContact.online ? "● Çevrimiçi" : "Çevrimdışı"}</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              {[<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.99 1.17h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>, <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path d="M15 10l4.553-2.069A1 1 0 0121 8.869v6.262a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>].map((icon, i) => (
                <button key={i} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(168,85,247,0.2)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8, background: "linear-gradient(180deg, #1a0533 0%, #0d0018 100%)" }}>
            {(messages[selectedContact.id] || []).map(msg => (
              <div key={msg.id} style={{ display: "flex", justifyContent: msg.from === "me" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "72%", padding: "10px 14px", borderRadius: msg.from === "me" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: msg.from === "me" ? "linear-gradient(135deg, #A855F7, #7C3AED)" : "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", color: "#fff", fontSize: 14, lineHeight: 1.5 }}>
                  {msg.text}
                  <div style={{ fontSize: 10, opacity: 0.5, marginTop: 4, textAlign: "right" }}>{msg.time}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding: "12px 16px 40px", display: "flex", gap: 10, alignItems: "center", background: "rgba(168,85,247,0.1)", backdropFilter: "blur(20px)" }}>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.07)", borderRadius: 24, padding: "10px 16px", border: "1px solid rgba(168,85,247,0.2)" }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Mesaj yaz..." style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: 14, width: "100%", fontFamily: "inherit" }} />
            </div>
            <button onClick={sendMessage} style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #A855F7, #7C3AED)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(168,85,247,0.4)" }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, overflowY: "auto", background: "linear-gradient(180deg, #1a0533 0%, #0d0018 100%)" }}>
          <div style={{ padding: "12px 20px 8px" }}>
            <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 20, padding: "10px 16px", display: "flex", gap: 8, alignItems: "center", border: "1px solid rgba(168,85,247,0.2)" }}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="rgba(168,85,247,0.8)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Discover — Find people or topics" style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: 13, width: "100%", fontFamily: "inherit" }} />
            </div>
          </div>
          {filtered.map(contact => (
            <div key={contact.id} onClick={() => setSelectedContact(contact)} style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <Avatar name={contact.name} color={contact.color} size={50} online={contact.online} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{contact.name}</span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{contact.time}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>{contact.lastMsg}</span>
                  {contact.unread > 0 && <div style={{ background: "#A855F7", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", fontWeight: 700 }}>{contact.unread}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FeedScreen() {
  const [posts, setPosts] = useState(POSTS);
  const toggleLike = (id) => setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  return (
    <div style={{ flex: 1, overflowY: "auto", background: "linear-gradient(180deg, #1a0533 0%, #0d0018 100%)" }}>
      {posts.map(post => (
        <div key={post.id} style={{ marginBottom: 2, borderBottom: "1px solid rgba(168,85,247,0.1)" }}>
          <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar name={post.user} color={post.color} size={40} />
            <div><div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{post.user}</div><div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{post.time}</div></div>
          </div>
          <img src={post.image} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
          <div style={{ padding: "12px 16px" }}>
            <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
              <button onClick={() => toggleLike(post.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="22" height="22" fill={post.liked ? "#A855F7" : "none"} viewBox="0 0 24 24" stroke={post.liked ? "#A855F7" : "rgba(255,255,255,0.7)"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{post.likes}</span>
              </button>
              <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{post.comments}</span>
              </button>
            </div>
            <div style={{ color: "#fff", fontSize: 13 }}><span style={{ fontWeight: 700 }}>{post.user}</span> {post.caption}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AuraZoneScreen() {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", background: "linear-gradient(180deg, #1a0533 0%, #0d0018 100%)" }}>
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 600, letterSpacing: 2, marginBottom: 12 }}>TRENDING (4)</div>
      {TRENDING.slice(0, 4).map((topic, i) => (
        <div key={topic} style={{ padding: "14px 0", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg, #A855F7${Math.floor(40 + i * 20).toString(16)}, #7C3AED${Math.floor(40 + i * 20).toString(16)})`, border: "1px solid rgba(168,85,247,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            {["🤖", "🎉", "🧘", "💼"][i]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{topic}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Trending topic</div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)" }}>🔔</button>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)" }}>—</button>
          </div>
        </div>
      ))}
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 600, letterSpacing: 2, marginTop: 20, marginBottom: 12 }}>TRENDING TOPICS</div>
      {TRENDING.slice(4).map((topic, i) => (
        <div key={topic} style={{ padding: "14px 0", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            {["✈️", "🎵"][i]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{topic}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Trending topic</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileScreen({ user, onLogout }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: "linear-gradient(180deg, #1a0533 0%, #0d0018 100%)" }}>
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", borderBottom: "1px solid rgba(168,85,247,0.2)" }}>
        <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg, #A855F7, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#fff", border: "3px solid rgba(168,85,247,0.5)", boxShadow: "0 0 30px rgba(168,85,247,0.3)", marginBottom: 14 }}>
          {user?.email?.[0]?.toUpperCase() || "U"}
        </div>
        <div style={{ color: "#fff", fontSize: 20, fontWeight: 800 }}>{user?.email?.split("@")[0] || "Kullanıcı"}</div>
        <div style={{ color: "rgba(168,85,247,0.8)", fontSize: 13, marginTop: 4 }}>Aura kullanıcısı 🌀</div>
        <div style={{ display: "flex", gap: 32, marginTop: 20 }}>
          {[["0", "Gönderi"], ["0", "Takipçi"], ["0", "Takip"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ color: "#fff", fontSize: 20, fontWeight: 800 }}>{num}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{label}</div>
            </div>
          ))}
        </div>
        <button onClick={onLogout} style={{ marginTop: 16, padding: "10px 32px", borderRadius: 20, background: "rgba(168,85,247,0.2)", border: "1px solid rgba(168,85,247,0.4)", color: "#A855F7", fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>Çıkış Yap</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, padding: "2px" }}>
        {[1,2,3,4,5,6].map(i => (
          <img key={i} src={`https://picsum.photos/seed/profile${i}/200/200`} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("messages");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user ?? null); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user ?? null); });
    return () => subscription.unsubscribe();
  }, []);

  const tabs = [
    { id: "messages", label: "Messages", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
    { id: "feed", label: "Feed", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
    { id: "aura", label: "Aura Zone", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> },
    { id: "profile", label: "Profil", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ];

  if (loading) return (
    <div style={{ background: "radial-gradient(ellipse at top, #2d0b5e 0%, #0d0018 100%)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 48 }}>🌀</div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", background: "#0d0018", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ width: "100%", maxWidth: 430, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        
        {/* Background blobs */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 100, left: -100, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Header */}
        <div style={{ padding: "50px 20px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(13,0,24,0.8)", backdropFilter: "blur(20px)", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "10px", background: "linear-gradient(135deg, #A855F7, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌀</div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Aura</div>
          </div>
          {user && (
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="rgba(168,85,247,0.9)" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
              </button>
              <button style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #A855F7, #7C3AED)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              </button>
            </div>
          )}
        </div>

        {!user ? (
          <AuthScreen onAuth={setUser} />
        ) : (
          <>
            {activeTab === "messages" && <MessagesScreen contacts={CONTACTS} messages={messages} setMessages={setMessages} />}
            {activeTab === "feed" && <FeedScreen />}
            {activeTab === "aura" && <AuraZoneScreen />}
            {activeTab === "profile" && <ProfileScreen user={user} onLogout={() => { supabase.auth.signOut(); setUser(null); }} />}

            <div style={{ padding: "10px 20px 34px", display: "flex", justifyContent: "space-around", background: "rgba(13,0,24,0.9)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(168,85,247,0.15)", zIndex: 10 }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: activeTab === tab.id ? "#A855F7" : "rgba(255,255,255,0.3)", transition: "color 0.2s" }}>
                  {tab.icon}
                  <span style={{ fontSize: 10, fontWeight: 600 }}>{tab.label}</span>
                  {activeTab === tab.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#A855F7" }} />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
