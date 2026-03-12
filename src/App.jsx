import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://hebljdvucansszxhvnfp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlYmxqZHZ1Y2Fuc3N6eGh2bmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwOTQ1MTQsImV4cCI6MjA4ODY3MDUxNH0.nS3J8Z7bNano_z7jdFmIhtmYrOc6HC2FpmBPrtcPZhI"
);

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadProfile(session.user.id);
      }
    });
  }, []);

  async function loadProfile(userId) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (data) {
      setProfile(data);
      setUsername(data.username || "");
      setBio(data.bio || "");
    }
  }

  async function updateProfile() {
    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from("profiles")
      .update({ 
        username: username, 
        bio: bio 
      })
      .eq("id", user.id);

    if (error) {
      setMessage("Hata: " + error.message);
    } else {
      setMessage("✅ Profil güncellendi!");
      await loadProfile(user.id);
      setEditing(false);
    }
    setLoading(false);
  }

  async function handleLogin() {
    setLoading(true);
    setMessage("");
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setMessage("Hata: " + error.message);
    } else {
      setUser(data.user);
      await loadProfile(data.user.id);
      setEmail("");
      setPassword("");
    }
    setLoading(false);
  }

  async function handleSignUp() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setMessage("Hata: " + error.message);
    } else {
      setMessage("✅ Kayıt başarılı! Şimdi giriş yapabilirsin.");
      setEmail("");
      setPassword("");
    }
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setEditing(false);
    setMessage("Çıkış yapıldı");
  }

  if (user) {
    if (editing) {
      return (
        <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "400px", margin: "auto" }}>
          <h1>Profili Düzenle ✏️</h1>
          
          <div style={{ marginTop: "20px" }}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Kullanıcı Adı:</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                  fontSize: "16px"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Hakkında:</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="4"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                  fontSize: "16px",
                  resize: "vertical"
                }}
              />
            </div>

            {message && (
              <div style={{ 
                padding: "10px", 
                marginBottom: "20px", 
                background: message.includes("✅") ? "#e8f5e9" : "#ffebee",
                borderRadius: "5px",
                color: message.includes("✅") ? "#2e7d32" : "#c62828"
              }}>
                {message}
              </div>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={updateProfile}
                disabled={loading}
                style={{
                  flex: 1,
                  background: "#4caf50",
                  color: "white",
                  border: "none",
                  padding: "12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button
                onClick={() => setEditing(false)}
                style={{
                  flex: 1,
                  background: "#9e9e9e",
                  color: "white",
                  border: "none",
                  padding: "12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px"
                }}
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "400px", margin: "auto" }}>
        <h1>Hoşgeldin! 👋</h1>
        
        <div style={{ 
          background: "#f5f5f5", 
          padding: "20px", 
          borderRadius: "10px",
          marginTop: "20px"
        }}>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Kullanıcı adı:</strong> {profile?.username || "Ayarlanmamış"}</p>
          <p><strong>Hakkında:</strong> {profile?.bio || "Henüz eklenmemiş"}</p>
          <p><strong>Üyelik:</strong> {new Date(user.created_at).toLocaleDateString("tr-TR")}</p>
          
          <button
            onClick={() => {
              setUsername(profile?.username || "");
              setBio(profile?.bio || "");
              setEditing(true);
            }}
            style={{
              background: "#2196f3",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%",
              marginTop: "15px",
              fontSize: "16px"
            }}
          >
            Profili Düzenle
          </button>
        </div>
        
        <button 
          onClick={handleLogout}
          style={{
            background: "#ff4444",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
            width: "100%",
            fontSize: "16px"
          }}
        >
          Çıkış Yap
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "400px", margin: "auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>AURA'ya Giriş</h1>
      
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            fontSize: "16px"
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Şifre:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            fontSize: "16px"
          }}
        />
      </div>

      {message && (
        <div style={{ 
          padding: "10px", 
          marginBottom: "20px", 
          background: message.includes("✅") ? "#e8f5e9" : "#ffebee",
          borderRadius: "5px",
          color: message.includes("✅") ? "#2e7d32" : "#c62828"
        }}>
          {message}
        </div>
      )}

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            flex: 1,
            background: "#2196f3",
            color: "white",
            border: "none",
            padding: "12px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "İşlem..." : "Giriş Yap"}
        </button>
        <button
          onClick={handleSignUp}
          disabled={loading}
          style={{
            flex: 1,
            background: "#4caf50",
            color: "white",
            border: "none",
            padding: "12px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "İşlem..." : "Kayıt Ol"}
        </button>
      </div>
    </div>
  );
}

export default App;
