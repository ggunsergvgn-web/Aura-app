import { useState, useRef, useEffect } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://hebljdvucansszxhvnfp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlYmxqZHZ1Y2Fuc3N6eGh2bmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwOTQ1MTQsImV4cCI6MjA4ODY3MDUxNH0.nS3J8Z7bNano_z7jdFmIhtmYrOc6HC2FpmBPrtcPZhI"
);

const CONTACTS = [
  { id: 1, name: "Ayşe Kaya", avatar: "AK", color: "#FF6B6B", lastMsg: "Yarın görüşelim mi?", time: "14:32", unread: 3, online: true, story: true },
  { id: 2, name: "Mert Demir", avatar: "MD", color: "#4ECDC4", lastMsg: "Fotoğrafları gördüm 🔥", time: "13:15", unread: 0, online: true, story: true },
  { id: 3, name: "Selin Yıldız", avatar: "SY", color: "#FFE66D", lastMsg: "Harika bir gündü!", time: "11:02", unread: 1, online: false, story: false },
  { id: 4, name: "Burak Arslan", avatar: "BA", color: "#A8E6CF", lastMsg: "👍", time: "Dün", unread: 0, online: false, story: true },
  { id: 5, name: "Zeynep Çelik", avatar: "ZÇ", color: "#FF8B94", lastMsg: "Nasılsın?", time: "Dün", unread: 0, online: true, story: false },
];

const POSTS = [
  { id: 1, user: "Ayşe Kaya", avatar: "AK", color: "#FF6B6B", time: "2 saat önce", image: "https://picsum.photos/seed/post1/400/400", caption: "Harika bir gün ☀️", likes: 142, comments: 18, liked: false },
  { id: 2, user: "Mert Demir", avatar: "MD", color: "#4ECDC4", time: "4 saat önce", image: "https://picsum.photos/seed/post2/400/400", caption: "İstanbul gecesi 🌙", likes: 89, comments: 7, liked: false },
  { id: 3, user: "Selin Yıldız", avatar: "SY", color: "#FFE66D", time: "Dün", image: "https://picsum.photos/seed/post3/400/400", caption: "Kahve molası ☕", likes: 203, comments: 24, liked: false },
];

const STORIES = CONTACTS.filter(c => c.story);
const INITIAL_MESSAGES = {
  1: [{ id: 1, text: "Merhaba! Nasılsın? 😊", from: "them", time: "14:20" }, { id: 2, text: "İyiyim teşekkürler! Sen?", from: "me", time: "14:21" }, { id: 3, text: "Yarın görüşelim mi?", from: "them", time: "14:32" }],
  2: [{ id: 1, text: "Fotoğrafları paylaştın mı?", from: "them", time: "13:10" }, { id: 2, text: "Evet az önce attım!", from: "me", time: "13:12" }, { id: 3, text: "Fotoğrafları gördüm 🔥", from: "them", time: "13:15" }],
};

function Avatar({ contact, size = 42 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${contact.color}, ${contact.color}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.33, fontWeight: 700, color: "#fff", flexShrink: 0, position: "relative" }}>
      {contact.avatar}
      {contact.online && <div style={{ position: "absolute", bottom: 1, right: 1, width: size * 0.22, height: size * 0.22, borderRadius: "50%", background: "#22C55E", border: "2px solid #0F0F1A" }} />}
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
        setSuccess("Kayıt başarılı! E-postanı kontrol et ve doğrula.");
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 30px" }}>
      <div style={{ fontSize: 48, marginBottom: 8 }}>✨</div>
      <div style={{ color: "#fff", fontSize: 32, fontWeight: 700, marginBottom: 4 }}>Aura</div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 40 }}>Sosyal platformun</div>

      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-posta" type="email"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "14px 18px", color: "#fff", fontSize: 15, outline: "none", fontFamily: "inherit" }} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Şifre" type="password"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "14px 18px", color: "#fff", fontSize: 15, outline: "none", fontFamily: "inherit" }} />

        {error && <div style={{ color: "#FF6B6B", fontSize: 13, textAlign: "center" }}>{error}</div>}
        {success && <div style={{ color: "#22C55E", fontSize: 13, textAlign: "center" }}>{success}</div>}

        <button onClick={handle} disabled={loading}
          style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899)", border: "none", borderRadius: 16, padding: "16px", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 8, fontFamily: "inherit" }}>
          {loading ? "⏳" : mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
        </button>

        <button onClick={() => setMode(mode === "login" ? "register" : "login")}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
          {mode === "login" ? "Hesabın yok mu? Kayıt ol" : "Zaten hesabın var mı? Giriş yap"}
        </button>
      </div>
    </div>
  );
}

function ChatScreen({ contacts, messages, setMessages }) {
  const [selectedContact, setSelectedContact] = useState(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, selectedContact]);
  const sendMessage = () => {
    if (!input.trim() || !selectedContact) return;
    const newMsg = { id: Date.now(), text: input.trim(), from: "me", time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) };
    setMessages(prev => ({ ...prev, [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsg] }));
    setInput("");
  };
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {selectedContact ? (
        <>
          <div style={{ padding: "10px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <button onClick={() => setSelectedContact(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "white" }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            </button>
            <Avatar contact={selectedContact} size={38} />
            <div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{selectedContact.name}</div>
              <div style={{ color: selectedContact.online ? "#22C55E" : "rgba(255,255,255,0.4)", fontSize: 11 }}>{selectedContact.online ? "● Çevrimiçi" : "Çevrimdışı"}</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.99 1.17h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              </button>
              <button style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path d="M15 10l4.553-2.069A1 1 0 0121 8.869v6.262a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              </button>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
            {(messages[selectedContact.id] || []).map(msg => (
              <div key={msg.id} style={{ display: "flex", justifyContent: msg.from === "me" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "72%", padding: "10px 14px", borderRadius: msg.from === "me" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: msg.from === "me" ? "linear-gradient(135deg, #7C3AED, #EC4899)" : "rgba(255,255,255,0.08)", color: "#fff", fontSize: 14, lineHeight: 1.5 }}>
                  {msg.text}
                  <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: "right" }}>{msg.time}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding: "12px 16px 40px", display: "flex", gap: 10, alignItems: "center", background: "rgba(0,0,0,0.3)" }}>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 24, padding: "10px 16px" }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Mesaj yaz..." style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: 14, width: "100%", fontFamily: "inherit" }} />
            </div>
            <button onClick={sendMessage} style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #EC4899)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ display: "flex", gap: 16, overflowX: "auto", padding: "8px 20px 16px", scrollbarWidth: "none" }}>
            {STORIES.map(contact => (
              <div key={contact.id} style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: `conic-gradient(${contact.color}, #EC4899, #7C3AED, ${contact.color})`, padding: 2.5, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ background: "#0F0F1A", borderRadius: "50%", padding: 2 }}><Avatar contact={contact} size={48} /></div>
                </div>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, maxWidth: 60, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{contact.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
          {contacts.map(contact => (
            <div key={contact.id} onClick={() => setSelectedContact(contact)} style={{ padding: "12px 24px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
              <Avatar contact={contact} size={50} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{contact.name}</span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{contact.time}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>{contact.lastMsg}</span>
                  {contact.unread > 0 && <div style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899)", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", fontWeight: 700 }}>{contact.unread}</div>}
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
  const toggleLike = (id) => { setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p)); };
  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {posts.map(post => (
        <div key={post.id} style={{ marginBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: `conic-gradient(${post.color}, #EC4899, #7C3AED, ${post.color})`, padding: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: "#0F0F1A", borderRadius: "50%", padding: 1.5 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${post.color}, ${post.color}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>{post.avatar}</div>
              </div>
            </div>
            <div><div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{post.user}</div><div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{post.time}</div></div>
          </div>
          <img src={post.image} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
          <div style={{ padding: "12px 16px" }}>
            <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
              <button onClick={() => toggleLike(post.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="22" height="22" fill={post.liked ? "#EC4899" : "none"} viewBox="0 0 24 24" stroke={post.liked ? "#EC4899" : "white"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                <span style={{ color: "white", fontSize: 13 }}>{post.likes}</span>
              </button>
              <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                <span style={{ color: "white", fontSize: 13 }}>{post.comments}</span>
              </button>
            </div>
            <div style={{ color: "#fff", fontSize: 13 }}><span style={{ fontWeight: 600 }}>{post.user}</span> {post.caption}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CallsScreen() {
  const calls = [
    { id: 1, contact: CONTACTS[0], type: "incoming", time: "Bugün 14:20", duration: "5 dk" },
    { id: 2, contact: CONTACTS[1], type: "outgoing", time: "Bugün 11:05", duration: "12 dk" },
    { id: 3, contact: CONTACTS[2], type: "missed", time: "Dün 18:30", duration: "" },
  ];
  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {calls.map(call => (
        <div key={call.id} style={{ padding: "14px 24px", display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar contact={call.contact} size={48} />
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{call.contact.name}</div>
            <div style={{ color: call.type === "missed" ? "#EC4899" : "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 3 }}>{call.time} {call.duration && `· ${call.duration}`}</div>
          </div>
          <button style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.99 1.17h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          </button>
        </div>
      ))}
    </div>
  );
}

function ProfileScreen({ user, onLogout }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ width: 90, height: 90, borderRadius: "50%", background: "conic-gradient(#7C3AED, #EC4899, #FF6B6B, #7C3AED)", padding: 3, marginBottom: 14 }}>
          <div style={{ background: "#0F0F1A", borderRadius: "50%", padding: 3, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #EC4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#fff" }}>
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </div>
        <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>{user?.email || "Kullanıcı"}</div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 4 }}>Aura kullanıcısı ✨</div>
        <div style={{ display: "flex", gap: 32, marginTop: 20 }}>
          {[["0", "Gönderi"], ["0", "Takipçi"], ["0", "Takip"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>{num}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{label}</div>
            </div>
          ))}
        </div>
        <button onClick={onLogout} style={{ marginTop: 16, padding: "8px 32px", borderRadius: 20, background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Çıkış Yap</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, marginTop: 2 }}>
        {[1,2,3,4,5,6].map(i => (
          <img key={i} src={`https://picsum.photos/seed/profile${i}/200/200`} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("chats");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const tabs = [
    { id: "chats", label: "Sohbet", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
    { id: "feed", label: "Keşfet", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
    { id: "calls", label: "Aramalar", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.99 1.17h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg> },
    { id: "profile", label: "Profil", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ];

  if (loading) return (
    <div style={{ fontFamily: "'Sora', sans-serif", background: "#0A0A14", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#fff", fontSize: 32 }}>✨</div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", background: "#0A0A14", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ width: "100%", maxWidth: 430, height: "100vh", background: "#0F0F1A", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "50px 24px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>Aura ✨</div>
          {user && <button style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #EC4899)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          </button>}
        </div>

        {!user ? (
          <AuthScreen onAuth={setUser} />
        ) : (
          <>
            {activeTab === "chats" && <ChatScreen contacts={CONTACTS} messages={messages} setMessages={setMessages} />}
            {activeTab === "feed" && <FeedScreen />}
            {activeTab === "calls" && <CallsScreen />}
            {activeTab === "profile" && <ProfileScreen user={user} onLogout={handleLogout} />}
            <div style={{ padding: "12px 30px 40px", display: "flex", justifyContent: "space-around", background: "rgba(0,0,0,0.4)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: activeTab === tab.id ? "#EC4899" : "rgba(255,255,255,0.35)" }}>
                  {tab.icon}
                  <span style={{ fontSize: 10, fontWeight: 500 }}>{tab.label}</span>
                  {activeTab === tab.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#EC4899" }} />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
