import { useState } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://hebljdvucansszxhvnfp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlYmxqZHZ1Y2Fuc3N6eGh2bmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwOTQ1MTQsImV4cCI6MjA4ODY3MDUxNH0.nS3J8Z7bNano_z7jdFmIhtmYrOc6HC2FpmBPrtcPZhI"
);

const LOGO = "https://hebljdvucansszxhvnfp.supabase.co/storage/v1/object/public/post-media/Picsart_26-03-11_18-37-28-244.png";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=Space+Mono&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .aura-root {
    min-height: 100vh;
    background: #050508;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.18;
    animation: drift 12s ease-in-out infinite;
    pointer-events: none;
  }
  .orb1 { width:400px; height:400px; background:#bf5af2; top:-100px; left:-100px; animation-delay:0s; }
  .orb2 { width:300px; height:300px; background:#00f5ff; bottom:-80px; right:-80px; animation-delay:-4s; }
  .orb3 { width:200px; height:200px; background:#ff2d78; top:50%; left:50%; animation-delay:-8s; }

  @keyframes drift {
    0%,100% { transform:translate(0,0) scale(1); }
    33% { transform:translate(30px,-20px) scale(1.05); }
    66% { transform:translate(-20px,30px) scale(0.95); }
  }

  .grid-bg {
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }

  .scanline {
    position: fixed; top:-100%; left:0; right:0; height:200%;
    background: linear-gradient(transparent 50%, rgba(0,245,255,0.012) 50%);
    background-size: 100% 4px;
    pointer-events: none;
    animation: scan 8s linear infinite;
    opacity: 0.5;
  }
  @keyframes scan { to { transform: translateY(50%); } }

  .auth-card {
    position: relative; z-index: 1;
    width: 100%; max-width: 390px; margin: 20px;
    padding: 44px 36px 40px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 28px;
    backdrop-filter: blur(40px);
    box-shadow: 0 0 0 1px rgba(0,245,255,0.05), 0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06);
    animation: fadeUp 0.6s ease both;
  }

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(24px); }
    to { opacity:1; transform:translateY(0); }
  }

  .corner { position:absolute; width:20px; height:20px; border-color:rgba(0,245,255,0.3); border-style:solid; }
  .c-tl { top:12px; left:12px; border-width:2px 0 0 2px; border-radius:4px 0 0 0; }
  .c-tr { top:12px; right:12px; border-width:2px 2px 0 0; border-radius:0 4px 0 0; }
  .c-bl { bottom:12px; left:12px; border-width:0 0 2px 2px; border-radius:0 0 0 4px; }
  .c-br { bottom:12px; right:12px; border-width:0 2px 2px 0; border-radius:0 0 4px 0; }

  .logo-area {
    display:flex; flex-direction:column; align-items:center;
    margin-bottom:36px;
    animation: fadeUp 0.6s 0.1s ease both;
  }

  .logo-ring-wrap { position:relative; margin-bottom:20px; }

  .logo-ring-wrap::before {
    content:'';
    position:absolute; inset:-10px; border-radius:50%;
    background: conic-gradient(from 0deg, #00f5ff, #ff2d78, #bf5af2, #00f5ff);
    animation: spin 4s linear infinite;
    filter: blur(8px); opacity:0.7;
  }
  @keyframes spin { to { transform:rotate(360deg); } }

  .logo-img {
    width:88px; height:88px; border-radius:22px; object-fit:cover;
    border:2px solid rgba(255,255,255,0.1);
    position:relative; z-index:1; display:block;
  }

  .brand-wrap { display:flex; align-items:baseline; line-height:1; }

  .brand-aura {
    font-family:'Bebas Neue',sans-serif; font-size:42px; letter-spacing:3px;
    background:linear-gradient(135deg,#00f5ff 0%,#bf5af2 50%,#ff2d78 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    filter:drop-shadow(0 0 20px rgba(0,245,255,0.4));
  }

  .brand-sc {
    font-family:'Space Mono',monospace; font-size:15px;
    color:#00f5ff; letter-spacing:1px; margin-bottom:4px;
    opacity:0.85; filter:drop-shadow(0 0 8px #00f5ff);
  }

  .tagline {
    font-size:10px; color:rgba(255,255,255,0.25);
    letter-spacing:3px; text-transform:uppercase; margin-top:6px;
  }

  .tabs {
    display:flex; background:rgba(255,255,255,0.03);
    border:1px solid rgba(255,255,255,0.08); border-radius:14px;
    padding:4px; margin-bottom:28px;
    animation: fadeUp 0.6s 0.2s ease both;
  }

  .tab-btn {
    flex:1; padding:10px; border:none; border-radius:10px;
    background:transparent; color:rgba(255,255,255,0.3);
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
    cursor:pointer; transition:all 0.25s;
  }

  .tab-btn.active {
    background:linear-gradient(135deg,rgba(0,245,255,0.15),rgba(191,90,242,0.15));
    color:#fff; border:1px solid rgba(0,245,255,0.2);
    box-shadow:0 0 20px rgba(0,245,255,0.08);
  }

  .form-area { animation: fadeUp 0.6s 0.3s ease both; }

  .field { position:relative; margin-bottom:12px; }

  .field-icon {
    position:absolute; left:14px; top:50%; transform:translateY(-50%);
    font-size:15px; opacity:0.4; pointer-events:none;
  }

  .field input {
    width:100%; padding:14px 16px 14px 42px;
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
    border-radius:14px; color:#fff;
    font-family:'DM Sans',sans-serif; font-size:14px; outline:none; transition:all 0.25s;
  }

  .field input::placeholder { color:rgba(255,255,255,0.22); }

  .field input:focus {
    border-color:rgba(0,245,255,0.4); background:rgba(0,245,255,0.04);
    box-shadow:0 0 0 3px rgba(0,245,255,0.06);
  }

  .forgot-row { text-align:right; margin-bottom:18px; margin-top:-4px; }

  .forgot-btn {
    background:none; border:none; font-family:'DM Sans',sans-serif;
    font-size:12px; color:rgba(0,245,255,0.6); cursor:pointer; padding:0; transition:color 0.2s;
  }
  .forgot-btn:hover { color:#00f5ff; }

  .submit-btn {
    width:100%; padding:15px; border:none; border-radius:14px;
    background:linear-gradient(135deg,#00f5ff,#bf5af2,#ff2d78);
    background-size:200%; color:#fff;
    font-family:'DM Sans',sans-serif; font-size:15px; font-weight:600;
    cursor:pointer; letter-spacing:0.5px; transition:all 0.3s;
    box-shadow:0 8px 32px rgba(0,245,255,0.2);
    animation: gradShift 4s ease infinite;
  }

  @keyframes gradShift {
    0%,100% { background-position:0% 50%; }
    50% { background-position:100% 50%; }
  }

  .submit-btn:hover { transform:translateY(-2px); box-shadow:0 12px 40px rgba(0,245,255,0.3); }
  .submit-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }

  .divider { display:flex; align-items:center; gap:12px; margin:20px 0; }
  .divider::before,.divider::after { content:''; flex:1; height:1px; background:rgba(255,255,255,0.08); }
  .divider span { font-size:11px; color:rgba(255,255,255,0.2); }

  .switch-text { text-align:center; font-size:13px; color:rgba(255,255,255,0.3); }

  .switch-link {
    background:none; border:none; font-family:'DM Sans',sans-serif;
    font-size:13px; font-weight:500; color:#00f5ff; cursor:pointer; padding:0;
    filter:drop-shadow(0 0 6px rgba(0,245,255,0.4));
  }

  .msg-box { padding:10px 14px; border-radius:10px; font-size:13px; margin-bottom:14px; }
  .msg-error { background:rgba(255,45,120,0.12); border:1px solid rgba(255,45,120,0.3); color:#ff6b9d; }
  .msg-success { background:rgba(57,255,20,0.08); border:1px solid rgba(57,255,20,0.25); color:#39ff14; }
`;

export default function App() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username:"", email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [user, setUser] = useState(null);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const switchMode = (m) => { setMode(m); setError(""); setSuccess(""); setShowForgot(false); };

  const handleSubmit = async () => {
    setLoading(true); setError(""); setSuccess("");
    try {
      if (mode === "login") {
        const {data,error} = await supabase.auth.signInWithPassword({email:form.email,password:form.password});
        if (error) throw error;
        setUser(data.user);
      } else {
        if (!form.username.trim()) throw new Error("Kullanıcı adı gerekli!");
        if (form.password.length < 6) throw new Error("Şifre en az 6 karakter olmalı!");
        const {data:ex} = await supabase.from("profiles").select("id").eq("username",form.username.trim()).maybeSingle();
        if (ex) throw new Error("Bu kullanıcı adı zaten alınmış!");
        const {data,error} = await supabase.auth.signUp({email:form.email,password:form.password});
        if (error) throw error;
        if (data.user) await supabase.from("profiles").upsert({id:data.user.id,email:form.email,username:form.username.trim()});
        setSuccess("✅ Kayıt başarılı! Şimdi giriş yapabilirsin.");
        switchMode("login");
      }
    } catch(e) { setError(e.message); }
    setLoading(false);
  };

  const handleForgot = async () => {
    if (!forgotEmail.trim()) { setError("E-posta adresini gir!"); return; }
    setLoading(true);
    const {error} = await supabase.auth.resetPasswordForEmail(forgotEmail.trim());
    setLoading(false);
    if (error) { setError(error.message); return; }
    setForgotSent(true);
  };

  const BG = () => (
    <>
      <div className="orb orb1"/>
      <div className="orb orb2"/>
      <div className="orb orb3"/>
      <div className="grid-bg"/>
      <div className="scanline"/>
    </>
  );

  const LogoArea = () => (
    <div className="logo-area">
      <div className="logo-ring-wrap">
        <img className="logo-img" src={LOGO} alt="AURAsc"/>
      </div>
      <div className="brand-wrap">
        <span className="brand-aura">AURA</span>
        <span className="brand-sc">sc</span>
      </div>
      <div className="tagline">sosyal platformun</div>
    </div>
  );

  // Giriş başarılıysa (sonraki adımda ana ekran buraya gelecek)
  if (user) {
    return (
      <>
        <style>{styles}</style>
        <div className="aura-root">
          <BG/>
          <div className="auth-card">
            <div className="corner c-tl"/><div className="corner c-tr"/>
            <div className="corner c-bl"/><div className="corner c-br"/>
            <LogoArea/>
            <div style={{textAlign:"center",color:"#00f5ff",fontSize:16,fontWeight:600,marginBottom:8}}>
              ✅ Hoş geldin!
            </div>
            <div style={{textAlign:"center",color:"rgba(255,255,255,0.35)",fontSize:13,marginBottom:24}}>
              Ana ekran bir sonraki adımda gelecek...
            </div>
            <button onClick={()=>{supabase.auth.signOut();setUser(null);}} style={{width:"100%",padding:12,border:"1px solid rgba(255,45,120,0.3)",borderRadius:12,background:"rgba(255,45,120,0.08)",color:"#ff6b9d",fontFamily:"'DM Sans',sans-serif",fontSize:13,cursor:"pointer"}}>
              Çıkış Yap
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="aura-root">
        <BG/>
        <div className="auth-card">
          <div className="corner c-tl"/><div className="corner c-tr"/>
          <div className="corner c-bl"/><div className="corner c-br"/>

          <LogoArea/>

          {/* ŞİFREMİ UNUTTUM EKRANI */}
          {showForgot ? (
            <div className="form-area">
              <div style={{color:"#fff",fontWeight:600,fontSize:15,marginBottom:16,textAlign:"center"}}>
                🔑 Şifre Sıfırla
              </div>
              {forgotSent ? (
                <div className="msg-box msg-success">
                  📧 Sıfırlama bağlantısı e-postana gönderildi!
                </div>
              ) : (
                <>
                  {error && <div className="msg-box msg-error">{error}</div>}
                  <div className="field">
                    <span className="field-icon">✉️</span>
                    <input type="email" placeholder="E-posta adresin" value={forgotEmail} onChange={e=>setForgotEmail(e.target.value)}/>
                  </div>
                  <button className="submit-btn" onClick={handleForgot} disabled={loading} style={{marginBottom:14}}>
                    {loading ? "⏳ Gönderiliyor..." : "Bağlantı Gönder"}
                  </button>
                </>
              )}
              <div className="switch-text">
                <button className="switch-link" onClick={()=>{setShowForgot(false);setError("");setForgotSent(false);}}>
                  ← Geri dön
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* TABS */}
              <div className="tabs">
                <button className={`tab-btn ${mode==="login"?"active":""}`} onClick={()=>switchMode("login")}>Giriş Yap</button>
                <button className={`tab-btn ${mode==="register"?"active":""}`} onClick={()=>switchMode("register")}>Kayıt Ol</button>
              </div>

              {/* FORM */}
              <div className="form-area">
                {error && <div className="msg-box msg-error">{error}</div>}
                {success && <div className="msg-box msg-success">{success}</div>}

                {mode === "register" && (
                  <div className="field">
                    <span className="field-icon">👤</span>
                    <input type="text" placeholder="Kullanıcı adı" value={form.username} onChange={e=>set("username",e.target.value)}/>
                  </div>
                )}

                <div className="field">
                  <span className="field-icon">✉️</span>
                  <input type="email" placeholder="E-posta adresi" value={form.email} onChange={e=>set("email",e.target.value)}/>
                </div>

                <div className="field">
                  <span className="field-icon">🔒</span>
                  <input type="password" placeholder="Şifre" value={form.password} onChange={e=>set("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
                </div>

                {mode === "login" && (
                  <div className="forgot-row">
                    <button className="forgot-btn" onClick={()=>{setShowForgot(true);setError("");}}>
                      Şifremi unuttum →
                    </button>
                  </div>
                )}

                <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                  {loading ? "⏳ Bekle..." : mode==="login" ? "Giriş Yap" : "Kayıt Ol"}
                </button>

                <div className="divider"><span>veya</span></div>

                <div className="switch-text">
                  {mode==="login" ? (
                    <>Hesabın yok mu? <button className="switch-link" onClick={()=>switchMode("register")}>Kayıt ol →</button></>
                  ) : (
                    <>Zaten hesabın var mı? <button className="switch-link" onClick={()=>switchMode("login")}>Giriş yap →</button></>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
