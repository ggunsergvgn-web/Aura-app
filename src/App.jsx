import { useState, useRef, useEffect } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://hebljdvucansszxhvnfp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlYmxqZHZ1Y2Fuc3N6eGh2bmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwOTQ1MTQsImV4cCI6MjA4ODY3MDUxNH0.nS3J8Z7bNano_z7jdFmIhtmYrOc6HC2FpmBPrtcPZhI"
);

const POSTS = [
  { id: 1, user: "Ayşe Kaya", avatar: "AK", color: "#9B59B6", time: "2 saat önce", image: "https://picsum.photos/seed/post1/400/400", caption: "Harika bir gün ☀️", likes: 142, comments: 18, liked: false },
  { id: 2, user: "Mert Demir", avatar: "MD", color: "#8E44AD", time: "4 saat önce", image: "https://picsum.photos/seed/post2/400/400", caption: "İstanbul gecesi 🌙", likes: 89, comments: 7, liked: false },
  { id: 3, user: "Selin Yıldız", avatar: "SY", color: "#6C3483", time: "Dün", image: "https://picsum.photos/seed/post3/400/400", caption: "Kahve molası ☕", likes: 203, comments: 24, liked: false },
];

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
      <div style={{ color: "#fff", fontSize: 34, fontWeight: 800, marginBottom: 4 }}>Aura</div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 40 }}>Sosyal platformun</div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-posta" type="email" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 16, padding: "14px 18px", color: "#fff", fontSize: 15, outline: "none", fontFamily: "inherit" }} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Şifre" type="password" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 16, padding: "14px 18px", color: "#fff", fontSize: 15, outline: "none", fontFamily: "inherit" }} />
        {error && <div style={{ color: "#F87171", fontSize: 13, textAlign: "center" }}>{error}</div>}
        {success && <div style={{ color: "#A855F7", fontSize: 13, textAlign: "center" }}>{success}</div>}
        <button onClick={handle} disabled={loading} style={{ background: "linear-gradient(135deg, #A855F7, #7C3AED)", border: "none", borderRadius: 16, padding: "16px", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 8, fontFamily: "inherit" }}>
          {loading ? "⏳" : mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
        </button>
        <button onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
          {mode === "login" ? "Hesabın yok mu? Kayıt ol" : "Zaten hesabın var mı? Giriş yap"}
        </button>
      </div>
    </div>
  );
}

function MessagesScreen({ user }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    supabase.from("profiles").select("*").neq("id", user.id).then(({ data }) => { if (data) setUsers(data); });
  }, [user]);

  useEffect(() => {
    if (!selectedUser) return;
    supabase.from("messages").select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${user.id})`)
      .order("created_at").then(({ data }) => { if (data) setMessages(data); });

    const channel = supabase.channel("messages").on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
      const msg = payload.new;
      if ((msg.sender_id === user.id && msg.receiver_id === selectedUser.id) || (msg.sender_id === selectedUser.id && msg.receiver_id === user.id)) {
        setMessages(prev => [...prev, msg]);
      }
    }).subscribe();
    return () => supabase.removeChannel(channel);
  }, [selectedUser, user]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return;
    await supabase.from("messages").insert({ sender_id: user.id, receiver_id: selectedUser.id, content: input.trim() });
    setInput("");
  };

  const filtered = users.filter(u => (u.username || u.email || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {selectedUser ? (
        <>
          <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, background: "rgba(168,85,247,0.1)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(168,85,247,0.2)" }}>
            <button onClick={() => setSelectedUser(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#A855F7" }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            </button>
            <Avatar name={selectedUser.username || selectedUser.email || "U"} color="#9B59B6" size={38} />
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{selectedUser.username || selectedUser.email}</div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8, background: "linear-gradient(180deg, #1a0533 0%, #0d0018 100%)" }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: "flex", justifyContent: msg.sender_id === user.id ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "72%", padding: "10px 14px", borderRadius: msg.sender_id === user.id ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: msg.sender_id === user.id ? "linear-gradient(135deg, #A855F7, #7C3AED)" : "rgba(255,255,255,0.08)", color: "#fff", fontSize: 14, lineHeight: 1.5 }}>
                  {msg.content}
                  <div style={{ fontSize: 10, opacity: 0.5, marginTop: 4, textAlign: "right" }}>
                    {new Date(msg.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding: "12px 16px 40px", display: "flex", gap: 10, alignItems: "center", background: "rgba(168,85,247,0.1)", backdropFilter: "blur(20px)" }}>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.07)", borderRadius: 24, padding: "10px 16px", border: "1px solid rgba(168,85,247,0.2)" }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Mesaj yaz..." style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: 14, width: "100%", fontFamily: "inherit" }} />
            </div>
            <button onClick={sendMessage} style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #A855F7, #7C3AED)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, overflowY: "auto", background: "linear-gradient(180deg, #1a0533 0%, #0d0018 100%)" }}>
          <div style={{ padding: "12px 20px 8px" }}>
            <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 20, padding: "10px 16px", display: "flex", gap: 8, alignItems: "center", border: "1px solid rgba(168,85,247,0.2)" }}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="rgba(168,85,247,0.8)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Kişi ara..." style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: 13, width: "100%", fontFamily: "inherit" }} />
            </div>
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 40, fontSize: 14 }}>
              Henüz kayıtlı kullanıcı yok 😊{"\n"}Arkadaşlarını davet et!
            </div>
          ) : filtered.map(u => (
            <div key={u.id} onClick={() => setSelectedUser(u)} style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <Avatar name={u.username || u.email || "U"} color="#9B59B6" size={50} />
              <div style={{ flex: 1 }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{u.username || u.email}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Mesaj gönder</div>
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
        <div key={post.id} style={{ borderBottom: "1px solid rgba(168,85,247,0.1)" }}>
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
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 600, letterSpacing: 2, marginBottom: 12 }}>TRENDING</div>
      {TRENDING.map((topic, i) => (
        <div key={topic} style={{ padding: "14px 0", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            {["🤖", "🎉", "🧘", "💼", "✈️", "🎵"][i]}
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
        <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg, #A855F7, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#fff", border: "3px solid rgba(168,85,247,0.5)", marginBottom: 14 }}>
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
      <div style={{ width: "100%", maxWidth: 430, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "50px 20px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(13,0,24,0.8)", backdropFilter: "blur(20px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "10px", background: "linear-gradient(135deg, #A855F7, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌀</div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>Aura</div>
          </div>
        </div>

        {!user ? (
          <AuthScreen onAuth={setUser} />
        ) : (
          <>
            {activeTab === "messages" && <MessagesScreen user={user} />}
            {activeTab === "feed" && <FeedScreen />}
            {activeTab === "aura" && <AuraZoneScreen />}
            {activeTab === "profile" && <ProfileScreen user={user} onLogout={() => { supabase.auth.signOut(); setUser(null); }} />}
            <div style={{ padding: "10px 20px 34px", display: "flex", justifyContent: "space-around", background: "rgba(13,0,24,0.9)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(168,85,247,0.15)" }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: activeTab === tab.id ? "#A855F7" : "rgba(255,255,255,0.3)" }}>
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
