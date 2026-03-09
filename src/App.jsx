import { useState, useRef, useEffect } from "react";

const CONTACTS = [
  { id: 1, name: "Ayşe Kaya", avatar: "AK", color: "#FF6B6B", lastMsg: "Yarın görüşelim mi?", time: "14:32", unread: 3, online: true, story: true },
  { id: 2, name: "Mert Demir", avatar: "MD", color: "#4ECDC4", lastMsg: "Fotoğrafları gördüm 🔥", time: "13:15", unread: 0, online: true, story: true },
  { id: 3, name: "Selin Yıldız", avatar: "SY", color: "#FFE66D", lastMsg: "Harika bir gündü!", time: "11:02", unread: 1, online: false, story: false },
  { id: 4, name: "Burak Arslan", avatar: "BA", color: "#A8E6CF", lastMsg: "👍", time: "Dün", unread: 0, online: false, story: true },
  { id: 5, name: "Zeynep Çelik", avatar: "ZÇ", color: "#FF8B94", lastMsg: "Nasılsın?", time: "Dün", unread: 0, online: true, story: false },
];

const INITIAL_MESSAGES = {
  1: [
    { id: 1, text: "Merhaba! Nasılsın? 😊", from: "them", time: "14:20" },
    { id: 2, text: "İyiyim teşekkürler! Sen?", from: "me", time: "14:21" },
    { id: 3, text: "Yarın görüşelim mi?", from: "them", time: "14:32" },
  ],
  2: [
    { id: 1, text: "Fotoğrafları paylaştın mı?", from: "them", time: "13:10" },
    { id: 2, text: "Evet az önce attım!", from: "me", time: "13:12" },
    { id: 3, text: "Fotoğrafları gördüm 🔥", from: "them", time: "13:15" },
  ],
};

function Avatar({ contact, size = 42 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${contact.color}, ${contact.color}99)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.33, fontWeight: 700, color: "#fff",
      fontFamily: "'Sora', sans-serif", flexShrink: 0,
      position: "relative",
    }}>
      {contact.avatar}
      {contact.online && (
        <div style={{
          position: "absolute", bottom: 1, right: 1,
          width: size * 0.22, height: size * 0.22,
          borderRadius: "50%", background: "#22C55E",
          border: "2px solid #0F0F1A",
        }} />
      )}
    </div>
  );
}

export default function App() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("chats");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedContact]);

  const sendMessage = () => {
    if (!input.trim() || !selectedContact) return;
    const newMsg = {
      id: Date.now(),
      text: input.trim(),
      from: "me",
      time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsg],
    }));
    setInput("");
  };

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", background: "#0A0A14", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ width: "100%", maxWidth: 430, height: "100vh", background: "#0F0F1A", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "50px 24px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {selectedContact ? (
            <button onClick={() => setSelectedContact(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              <span style={{ fontSize: 16, fontWeight: 600 }}>{selectedContact.name}</span>
            </button>
          ) : (
            <div style={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>Aura ✨</div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            {selectedContact && (
              <>
                <button style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.99 1.17h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                </button>
                <button style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path d="M15 10l4.553-2.069A1 1 0 0121 8.869v6.262a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {selectedContact ? (
            <>
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                {(messages[selectedContact.id] || []).map(msg => (
                  <div key={msg.id} style={{ display: "flex", justifyContent: msg.from === "me" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "72%", padding: "10px 14px",
                      borderRadius: msg.from === "me" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      background: msg.from === "me" ? "linear-gradient(135deg, #7C3AED, #EC4899)" : "rgba(255,255,255,0.08)",
                      color: "#fff", fontSize: 14, lineHeight: 1.5,
                    }}>
                      {msg.text}
                      <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: "right" }}>{msg.time}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div style={{ padding: "12px 16px 40px", display: "flex", gap: 10, alignItems: "center", background: "rgba(0,0,0,0.3)" }}>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 24, padding: "10px 16px" }}>
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder="Mesaj yaz..."
                    style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: 14, width: "100%", fontFamily: "inherit" }}
                  />
                </div>
                <button onClick={sendMessage} style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #EC4899)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                </button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, overflowY: "auto" }}>
              {CONTACTS.map(contact => (
                <div key={contact.id} onClick={() => setSelectedContact(contact)} style={{ padding: "12px 24px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
                  <Avatar contact={contact} size={50} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{contact.name}</span>
                      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{contact.time}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>{contact.lastMsg}</span>
                      {contact.unread > 0 && (
                        <div style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899)", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", fontWeight: 700 }}>{contact.unread}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Nav */}
        {!selectedContact && (
          <div style={{ padding: "12px 30px 40px", display: "flex", justifyContent: "space-around", background: "rgba(0,0,0,0.4)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            {[
              { id: "chats", label: "Sohbet", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
              { id: "feed", label: "Keşfet", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
              { id: "calls", label: "Aramalar", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.99 1.17h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg> },
              { id: "profile", label: "Profil", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: activeTab === tab.id ? "#EC4899" : "rgba(255,255,255,0.35)" }}>
                {tab.icon}
                <span style={{ fontSize: 10, fontWeight: 500 }}>{tab.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
