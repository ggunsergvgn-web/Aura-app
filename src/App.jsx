import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://hebljdvucansszxhvnfp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlYmxqZHZ1Y2Fuc3N6eGh2bmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwOTQ1MTQsImV4cCI6MjA4ODY3MDUxNH0.nS3J8Z7bNano_z7jdFmIhtmYrOc6HC2FpmBPrtcPZhI"
);

const LOGO = "https://hebljdvucansszxhvnfp.supabase.co/storage/v1/object/public/post-media/Picsart_26-03-11_18-37-28-244.png";

const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60) return "az önce";
  if (diff < 3600) return `${Math.floor(diff / 60)}dk`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}sa`;
  return `${Math.floor(diff / 86400)}g`;
};

const formatMsgTime = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 86400) return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  if (diff < 604800) return ["Paz","Pzt","Sal","Çar","Per","Cum","Cmt"][d.getDay()];
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
};

const getInitials = (name) => (name || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

const getColor = (str) => {
  const colors = ["#00f5ff","#bf5af2","#ff2d78","#39ff14","#ff9500","#0a84ff"];
  return colors[(str || "").charCodeAt(0) % colors.length];
};

// =====================
// STYLES
// =====================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #050508; font-family: 'DM Sans', sans-serif; }

  .aura-root {
    min-height: 100vh; background: #050508;
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Sans', sans-serif; position: relative; overflow: hidden;
  }

  .orb {
    position: fixed; border-radius: 50%;
    filter: blur(80px); opacity: 0.15; pointer-events: none;
    animation: drift 12s ease-in-out infinite;
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
    background-image: linear-gradient(rgba(0,245,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.025) 1px, transparent 1px);
    background-size: 40px 40px; pointer-events: none;
  }

  .scanline {
    position: fixed; top:-100%; left:0; right:0; height:200%;
    background: linear-gradient(transparent 50%, rgba(0,245,255,0.01) 50%);
    background-size: 100% 4px; pointer-events: none;
    animation: scan 8s linear infinite; opacity:0.5;
  }
  @keyframes scan { to { transform: translateY(50%); } }

  /* AUTH */
  .auth-card {
    position:relative; z-index:1; width:100%; max-width:390px; margin:20px;
    padding:44px 36px 40px;
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
    border-radius:28px; backdrop-filter:blur(40px);
    box-shadow:0 0 0 1px rgba(0,245,255,0.05),0 40px 80px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.06);
    animation:fadeUp 0.6s ease both;
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

  .corner { position:absolute; width:20px; height:20px; border-color:rgba(0,245,255,0.3); border-style:solid; }
  .c-tl{top:12px;left:12px;border-width:2px 0 0 2px;border-radius:4px 0 0 0}
  .c-tr{top:12px;right:12px;border-width:2px 2px 0 0;border-radius:0 4px 0 0}
  .c-bl{bottom:12px;left:12px;border-width:0 0 2px 2px;border-radius:0 0 0 4px}
  .c-br{bottom:12px;right:12px;border-width:0 2px 2px 0;border-radius:0 0 4px 0}

  .logo-area { display:flex; flex-direction:column; align-items:center; margin-bottom:36px; animation:fadeUp 0.6s 0.1s ease both; }
  .logo-ring-wrap { position:relative; margin-bottom:20px; }
  .logo-ring-wrap::before {
    content:''; position:absolute; inset:-10px; border-radius:50%;
    background:conic-gradient(from 0deg,#00f5ff,#ff2d78,#bf5af2,#00f5ff);
    animation:spin 4s linear infinite; filter:blur(8px); opacity:0.7;
  }
  @keyframes spin { to{transform:rotate(360deg)} }
  .logo-img { width:88px; height:88px; border-radius:22px; object-fit:cover; border:2px solid rgba(255,255,255,0.1); position:relative; z-index:1; display:block; }
  .brand-wrap { display:flex; align-items:baseline; line-height:1; }
  .brand-aura { font-family:'Bebas Neue',sans-serif; font-size:42px; letter-spacing:3px; background:linear-gradient(135deg,#00f5ff,#bf5af2,#ff2d78); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; filter:drop-shadow(0 0 20px rgba(0,245,255,0.4)); }
  .brand-sc { font-family:'Space Mono',monospace; font-size:15px; color:#00f5ff; letter-spacing:1px; margin-bottom:4px; opacity:0.85; filter:drop-shadow(0 0 8px #00f5ff); }
  .tagline { font-size:10px; color:rgba(255,255,255,0.25); letter-spacing:3px; text-transform:uppercase; margin-top:6px; }

  .tabs { display:flex; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:4px; margin-bottom:28px; }
  .tab-btn { flex:1; padding:10px; border:none; border-radius:10px; background:transparent; color:rgba(255,255,255,0.3); font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:all 0.25s; }
  .tab-btn.active { background:linear-gradient(135deg,rgba(0,245,255,0.15),rgba(191,90,242,0.15)); color:#fff; border:1px solid rgba(0,245,255,0.2); }

  .form-area { animation:fadeUp 0.6s 0.3s ease both; }
  .field { position:relative; margin-bottom:12px; }
  .field-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); font-size:15px; opacity:0.4; pointer-events:none; }
  .field input { width:100%; padding:14px 16px 14px 42px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:14px; color:#fff; font-family:'DM Sans',sans-serif; font-size:14px; outline:none; transition:all 0.25s; }
  .field input::placeholder { color:rgba(255,255,255,0.22); }
  .field input:focus { border-color:rgba(0,245,255,0.4); background:rgba(0,245,255,0.04); box-shadow:0 0 0 3px rgba(0,245,255,0.06); }

  .forgot-row { text-align:right; margin-bottom:18px; margin-top:-4px; }
  .forgot-btn { background:none; border:none; font-family:'DM Sans',sans-serif; font-size:12px; color:rgba(0,245,255,0.6); cursor:pointer; padding:0; }

  .submit-btn { width:100%; padding:15px; border:none; border-radius:14px; background:linear-gradient(135deg,#00f5ff,#bf5af2,#ff2d78); background-size:200%; color:#fff; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:600; cursor:pointer; box-shadow:0 8px 32px rgba(0,245,255,0.2); animation:gradShift 4s ease infinite; transition:all 0.3s; }
  .submit-btn:hover { transform:translateY(-2px); box-shadow:0 12px 40px rgba(0,245,255,0.3); }
  .submit-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
  @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

  .divider { display:flex; align-items:center; gap:12px; margin:20px 0; }
  .divider::before,.divider::after { content:''; flex:1; height:1px; background:rgba(255,255,255,0.08); }
  .divider span { font-size:11px; color:rgba(255,255,255,0.2); }

  .switch-text { text-align:center; font-size:13px; color:rgba(255,255,255,0.3); }
  .switch-link { background:none; border:none; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; color:#00f5ff; cursor:pointer; padding:0; filter:drop-shadow(0 0 6px rgba(0,245,255,0.4)); }

  .msg-box { padding:10px 14px; border-radius:10px; font-size:13px; margin-bottom:14px; }
  .msg-error { background:rgba(255,45,120,0.12); border:1px solid rgba(255,45,120,0.3); color:#ff6b9d; }
  .msg-success { background:rgba(57,255,20,0.08); border:1px solid rgba(57,255,20,0.25); color:#39ff14; }

  /* MAIN APP */
  .app-wrap { width:100%; max-width:430px; height:100vh; display:flex; flex-direction:column; overflow:hidden; position:relative; }

  .topbar { padding:48px 18px 12px; display:flex; justify-content:space-between; align-items:center; background:rgba(5,5,8,0.92); backdrop-filter:blur(24px); border-bottom:1px solid rgba(255,255,255,0.06); position:relative; z-index:10; flex-shrink:0; }
  .topbar-brand { display:flex; align-items:baseline; }
  .topbar-aura { font-family:'Bebas Neue',sans-serif; font-size:26px; letter-spacing:2px; background:linear-gradient(135deg,#00f5ff,#bf5af2,#ff2d78); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; filter:drop-shadow(0 0 10px rgba(0,245,255,0.3)); animation:shimmer 3s linear infinite; background-size:300%; }
  .topbar-sc { font-family:'Space Mono',monospace; font-size:11px; color:#00f5ff; opacity:0.8; margin-bottom:2px; filter:drop-shadow(0 0 5px #00f5ff); }
  @keyframes shimmer { 0%{background-position:0%} 100%{background-position:300%} }
  .topbar-right { display:flex; align-items:center; gap:10px; }
  .notif-wrap { position:relative; }
  .notif-btn { width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:16px; transition:all 0.2s; }
  .notif-btn:hover { border-color:rgba(0,245,255,0.3); }
  .notif-badge { position:absolute; top:-2px; right:-2px; width:16px; height:16px; background:#ff2d78; border-radius:50%; font-size:9px; color:#fff; font-weight:700; display:flex; align-items:center; justify-content:center; border:2px solid #050508; }
  .user-avatar { width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:#fff; cursor:pointer; border:2px solid rgba(0,245,255,0.3); overflow:hidden; }

  .screen-content { flex:1; overflow-y:auto; overflow-x:hidden; position:relative; z-index:1; scrollbar-width:none; }
  .screen-content::-webkit-scrollbar { display:none; }

  /* BOTTOM NAV */
  .bottom-nav { padding:8px 6px 32px; display:flex; justify-content:space-around; background:rgba(5,5,8,0.95); backdrop-filter:blur(24px); border-top:1px solid rgba(255,255,255,0.06); position:relative; z-index:10; flex-shrink:0; }
  .nav-btn { flex:1; display:flex; flex-direction:column; align-items:center; gap:3px; cursor:pointer; padding:7px 4px; border-radius:14px; transition:all 0.2s; border:none; background:none; position:relative; }
  .nav-btn.active { background:rgba(0,245,255,0.08); }
  .nav-btn svg { width:22px; height:22px; stroke:rgba(255,255,255,0.25); transition:all 0.2s; fill:none; stroke-width:2; }
  .nav-btn.active svg { stroke:#00f5ff; filter:drop-shadow(0 0 6px #00f5ff); }
  .nav-btn span { font-size:9px; font-weight:500; color:rgba(255,255,255,0.2); transition:color 0.2s; }
  .nav-btn.active span { color:#00f5ff; }
  .nav-post { }
  .nav-post-icon { width:44px; height:44px; border-radius:14px; background:linear-gradient(135deg,#00f5ff,#bf5af2,#ff2d78); display:flex; align-items:center; justify-content:center; box-shadow:0 4px 20px rgba(0,245,255,0.3); margin-top:-14px; }
  .nav-post-icon svg { stroke:#fff !important; width:20px; height:20px; filter:none !important; }
  .nav-badge { position:absolute; top:4px; right:8px; background:#ff2d78; border-radius:50%; min-width:15px; height:15px; display:flex; align-items:center; justify-content:center; font-size:8px; color:#fff; font-weight:700; border:1.5px solid #050508; }

  /* PLACEHOLDER SCREENS */
  .placeholder { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; gap:16px; }
  .placeholder-icon { font-size:56px; }
  .placeholder-title { color:#fff; font-size:18px; font-weight:700; }
  .placeholder-sub { color:rgba(255,255,255,0.3); font-size:13px; text-align:center; }

  /* ===================== MESAJLAR ===================== */
  .msgs-wrap { display:flex; flex-direction:column; height:100%; }

  .msgs-header { padding:16px 16px 8px; background:rgba(5,5,8,0.9); backdrop-filter:blur(20px); border-bottom:1px solid rgba(255,255,255,0.06); flex-shrink:0; }
  .msgs-title { color:#fff; font-size:18px; font-weight:800; margin-bottom:12px; }
  .msgs-search { display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:11px 14px; }
  .msgs-search input { background:none; border:none; outline:none; color:#fff; font-family:'DM Sans',sans-serif; font-size:14px; flex:1; }
  .msgs-search input::placeholder { color:rgba(255,255,255,0.22); }

  .msgs-list { flex:1; overflow-y:auto; scrollbar-width:none; }
  .msgs-list::-webkit-scrollbar { display:none; }

  .conv-item { display:flex; align-items:center; gap:12px; padding:12px 16px; cursor:pointer; border-bottom:1px solid rgba(255,255,255,0.04); transition:background 0.15s; position:relative; }
  .conv-item:hover { background:rgba(255,255,255,0.03); }
  .conv-item.unread { background:rgba(0,245,255,0.03); }

  .conv-avatar-wrap { position:relative; flex-shrink:0; }
  .conv-avatar { width:52px; height:52px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:700; color:#fff; border:2px solid rgba(255,255,255,0.08); overflow:hidden; }
  .conv-avatar img { width:100%; height:100%; object-fit:cover; }
  .online-dot { position:absolute; bottom:1px; right:1px; width:13px; height:13px; border-radius:50%; background:#39ff14; border:2.5px solid #050508; box-shadow:0 0 6px #39ff14; }

  .conv-body { flex:1; min-width:0; }
  .conv-name { color:#fff; font-weight:600; font-size:14px; }
  .conv-preview { color:rgba(255,255,255,0.35); font-size:12px; margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; display:flex; align-items:center; gap:4px; }
  .conv-preview.unread-text { color:rgba(255,255,255,0.7); font-weight:500; }

  .conv-meta { display:flex; flex-direction:column; align-items:flex-end; gap:5px; flex-shrink:0; }
  .conv-time { color:rgba(255,255,255,0.25); font-size:11px; }
  .conv-time.unread-time { color:#00f5ff; }
  .conv-badge { background:linear-gradient(135deg,#00f5ff,#bf5af2); border-radius:50%; min-width:20px; height:20px; display:flex; align-items:center; justify-content:center; font-size:10px; color:#fff; font-weight:700; padding:0 4px; box-shadow:0 2px 8px rgba(0,245,255,0.3); }
  .conv-muted { color:rgba(255,255,255,0.2); font-size:14px; }

  /* CHAT SCREEN */
  .chat-wrap { display:flex; flex-direction:column; height:100%; background:#050508; }

  .chat-header { padding:12px 16px; display:flex; align-items:center; gap:12px; background:rgba(5,5,8,0.95); backdrop-filter:blur(20px); border-bottom:1px solid rgba(255,255,255,0.06); flex-shrink:0; }
  .chat-back { width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; }
  .chat-back svg { width:18px; height:18px; stroke:#00f5ff; fill:none; stroke-width:2.5; }
  .chat-user-info { flex:1; min-width:0; cursor:pointer; }
  .chat-username { color:#fff; font-weight:700; font-size:15px; }
  .chat-status { font-size:11px; margin-top:1px; }
  .chat-status.online { color:#39ff14; }
  .chat-status.offline { color:rgba(255,255,255,0.3); }
  .chat-actions { display:flex; gap:8px; }
  .chat-action-btn { width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:16px; transition:all 0.2s; }
  .chat-action-btn:hover { border-color:rgba(0,245,255,0.3); background:rgba(0,245,255,0.08); }

  .chat-messages { flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:4px; scrollbar-width:none; }
  .chat-messages::-webkit-scrollbar { display:none; }

  .msg-date-divider { text-align:center; margin:12px 0; }
  .msg-date-divider span { background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.3); font-size:11px; padding:4px 12px; border-radius:20px; }

  .msg-row { display:flex; align-items:flex-end; gap:8px; margin-bottom:2px; }
  .msg-row.me { flex-direction:row-reverse; }
  .msg-row.them { flex-direction:row; }

  .msg-avatar-sm { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#fff; flex-shrink:0; overflow:hidden; }
  .msg-avatar-sm img { width:100%; height:100%; object-fit:cover; }
  .msg-avatar-placeholder { width:28px; flex-shrink:0; }

  .msg-bubble-wrap { display:flex; flex-direction:column; max-width:72%; }
  .msg-row.me .msg-bubble-wrap { align-items:flex-end; }
  .msg-row.them .msg-bubble-wrap { align-items:flex-start; }

  .msg-bubble { padding:10px 14px; font-size:14px; line-height:1.5; word-break:break-word; position:relative; }
  .msg-row.me .msg-bubble { background:linear-gradient(135deg,#00c9cc,#7b2ff7); color:#fff; border-radius:18px 18px 4px 18px; }
  .msg-row.them .msg-bubble { background:rgba(255,255,255,0.07); color:#F1F5F9; border:1px solid rgba(255,255,255,0.08); border-radius:18px 18px 18px 4px; }
  .msg-bubble.sending { opacity:0.6; }
  .msg-bubble.media { padding:4px; overflow:hidden; }
  .msg-bubble.media img { width:100%; max-width:220px; border-radius:14px; display:block; }

  .msg-meta-row { display:flex; align-items:center; gap:4px; margin-top:3px; padding:0 2px; }
  .msg-row.me .msg-meta-row { flex-direction:row-reverse; }
  .msg-time { font-size:10px; color:rgba(255,255,255,0.3); }
  .msg-ticks { font-size:12px; }
  .msg-ticks.sent { color:rgba(255,255,255,0.3); }
  .msg-ticks.delivered { color:rgba(255,255,255,0.5); }
  .msg-ticks.read { color:#00f5ff; }

  .msg-reactions { display:flex; gap:4px; margin-top:4px; flex-wrap:wrap; }
  .msg-reaction { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:20px; padding:2px 8px; font-size:12px; cursor:pointer; transition:all 0.15s; }
  .msg-reaction:hover { background:rgba(0,245,255,0.1); border-color:rgba(0,245,255,0.3); }

  /* Typing indicator */
  .typing-indicator { display:flex; align-items:center; gap:8px; padding:8px 0; }
  .typing-dots { display:flex; gap:4px; background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.08); border-radius:18px 18px 18px 4px; padding:12px 16px; }
  .typing-dot { width:7px; height:7px; border-radius:50%; background:rgba(255,255,255,0.4); animation:typingBounce 1.2s ease-in-out infinite; }
  .typing-dot:nth-child(2) { animation-delay:0.2s; }
  .typing-dot:nth-child(3) { animation-delay:0.4s; }
  @keyframes typingBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }

  /* Context menu */
  .ctx-menu { position:fixed; background:rgba(20,20,35,0.97); border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:6px; z-index:1000; min-width:160px; box-shadow:0 16px 40px rgba(0,0,0,0.6); backdrop-filter:blur(20px); }
  .ctx-item { padding:10px 14px; border-radius:10px; cursor:pointer; display:flex; align-items:center; gap:10px; transition:background 0.15s; color:#fff; font-size:13px; }
  .ctx-item:hover { background:rgba(0,245,255,0.1); }
  .ctx-item.danger { color:#ff6b9d; }
  .ctx-item.danger:hover { background:rgba(255,45,120,0.1); }
  .ctx-reactions { display:flex; gap:4px; padding:8px 10px 4px; border-bottom:1px solid rgba(255,255,255,0.06); margin-bottom:4px; }
  .ctx-emoji { font-size:22px; cursor:pointer; padding:4px; border-radius:8px; transition:transform 0.15s; }
  .ctx-emoji:hover { transform:scale(1.3); }

  /* Input area */
  .chat-input-wrap { padding:10px 12px 32px; background:rgba(5,5,8,0.95); backdrop-filter:blur(20px); border-top:1px solid rgba(255,255,255,0.06); flex-shrink:0; }
  .chat-input-row { display:flex; align-items:flex-end; gap:8px; }
  .chat-attach-btn { width:40px; height:40px; border-radius:50%; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:18px; flex-shrink:0; transition:all 0.2s; }
  .chat-attach-btn:hover { border-color:rgba(0,245,255,0.3); background:rgba(0,245,255,0.08); }
  .chat-input-box { flex:1; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:22px; padding:11px 16px; display:flex; align-items:center; gap:8px; transition:border-color 0.2s; }
  .chat-input-box:focus-within { border-color:rgba(0,245,255,0.3); }
  .chat-input-box textarea { background:none; border:none; outline:none; color:#fff; font-family:'DM Sans',sans-serif; font-size:14px; flex:1; resize:none; max-height:100px; overflow-y:auto; scrollbar-width:none; line-height:1.4; }
  .chat-input-box textarea::-webkit-scrollbar { display:none; }
  .chat-input-box textarea::placeholder { color:rgba(255,255,255,0.22); }
  .emoji-btn { font-size:18px; cursor:pointer; flex-shrink:0; opacity:0.5; transition:opacity 0.2s; }
  .emoji-btn:hover { opacity:1; }
  .chat-send-btn { width:44px; height:44px; border-radius:50%; background:linear-gradient(135deg,#00f5ff,#bf5af2); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 4px 18px rgba(0,245,255,0.3); transition:all 0.2s; }
  .chat-send-btn:hover { transform:scale(1.05); box-shadow:0 6px 24px rgba(0,245,255,0.4); }
  .chat-send-btn:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
  .chat-send-btn svg { width:18px; height:18px; stroke:#fff; fill:none; stroke-width:2.5; }
  .chat-voice-btn { width:44px; height:44px; border-radius:50%; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:18px; flex-shrink:0; transition:all 0.2s; }
  .chat-voice-btn:hover { border-color:rgba(0,245,255,0.3); background:rgba(0,245,255,0.08); }

  /* Attach menu */
  .attach-menu { display:flex; gap:10px; padding:10px 0 4px; flex-wrap:wrap; }
  .attach-item { display:flex; flex-direction:column; align-items:center; gap:6px; cursor:pointer; }
  .attach-icon { width:48px; height:48px; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:22px; transition:transform 0.15s; }
  .attach-icon:hover { transform:scale(1.08); }
  .attach-label { font-size:10px; color:rgba(255,255,255,0.4); }

  /* Emoji picker */
  .emoji-picker { background:rgba(15,15,25,0.98); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:12px; display:flex; flex-wrap:wrap; gap:4px; max-height:160px; overflow-y:auto; scrollbar-width:none; }
  .emoji-picker::-webkit-scrollbar { display:none; }
  .emoji-opt { font-size:24px; cursor:pointer; padding:4px; border-radius:8px; transition:transform 0.1s; }
  .emoji-opt:hover { transform:scale(1.25); background:rgba(255,255,255,0.06); }
`;

// =====================
// AVATAR
// =====================
function Avatar({ name, url, size = 42, online }) {
  const color = getColor(name);
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{ width: size, height: size, borderRadius: "50%", background: url ? "transparent" : `linear-gradient(135deg,${color}44,${color}22)`, border: `2px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.34, fontWeight: 700, color: "#fff", overflow: "hidden", flexShrink: 0 }}>
        {url ? <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : getInitials(name)}
      </div>
      {online && <div style={{ position: "absolute", bottom: 1, right: 1, width: size * 0.26, height: size * 0.26, borderRadius: "50%", background: "#39ff14", border: "2.5px solid #050508", boxShadow: "0 0 6px #39ff14" }} />}
    </div>
  );
}

// =====================
// AUTH SCREEN
// =====================
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const switchMode = (m) => { setMode(m); setError(""); setSuccess(""); setShowForgot(false); };

  const handleSubmit = async () => {
    setLoading(true); setError(""); setSuccess("");
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) throw error;
        onAuth(data.user);
      } else {
        if (!form.username.trim()) throw new Error("Kullanıcı adı gerekli!");
        if (form.password.length < 6) throw new Error("Şifre en az 6 karakter olmalı!");
        const { data: ex } = await supabase.from("profiles").select("id").eq("username", form.username.trim()).maybeSingle();
        if (ex) throw new Error("Bu kullanıcı adı zaten alınmış!");
        const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password });
        if (error) throw error;
        if (data.user) await supabase.from("profiles").upsert({ id: data.user.id, email: form.email, username: form.username.trim() });
        setSuccess("✅ Kayıt başarılı! Giriş yapabilirsin.");
        switchMode("login");
      }
    } catch (e) { setError(e.message); }
    setLoading(false);
    };

  const handleForgot = async () => {
    if (!forgotEmail.trim()) { setError("E-posta adresini gir!"); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim());
    setLoading(false);
    if (error) { setError(error.message); return; }
    setForgotSent(true);
  };

  return (
    <div className="aura-root">
      <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />
      <div className="grid-bg" /><div className="scanline" />
      <div className="auth-card">
        <div className="corner c-tl" /><div className="corner c-tr" />
        <div className="corner c-bl" /><div className="corner c-br" />
        <div className="logo-area">
          <div className="logo-ring-wrap">
            <img className="logo-img" src={LOGO} alt="AURAsc" />
          </div>
          <div className="brand-wrap">
            <span className="brand-aura">AURA</span>
            <span className="brand-sc">sc</span>
          </div>
          <div className="tagline">sosyal platformun</div>
        </div>
        {showForgot ? (
          <div className="form-area">
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 15, marginBottom: 16, textAlign: "center" }}>🔑 Şifre Sıfırla</div>
            {forgotSent ? (
              <div className="msg-box msg-success">📧 Sıfırlama bağlantısı e-postana gönderildi!</div>
            ) : (
              <>
                {error && <div className="msg-box msg-error">{error}</div>}
                <div className="field">
                  <span className="field-icon">✉️</span>
                  <input type="email" placeholder="E-posta adresin" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} />
                </div>
                <button className="submit-btn" onClick={handleForgot} disabled={loading} style={{ marginBottom: 14 }}>
                  {loading ? "⏳ Gönderiliyor..." : "Bağlantı Gönder"}
                </button>
              </>
            )}
            <div className="switch-text">
              <button className="switch-link" onClick={() => { setShowForgot(false); setError(""); setForgotSent(false); }}>← Geri dön</button>
            </div>
          </div>
        ) : (
          <>
            <div className="tabs">
              <button className={`tab-btn ${mode === "login" ? "active" : ""}`} onClick={() => switchMode("login")}>Giriş Yap</button>
              <button className={`tab-btn ${mode === "register" ? "active" : ""}`} onClick={() => switchMode("register")}>Kayıt Ol</button>
            </div>
            <div className="form-area">
              {error && <div className="msg-box msg-error">{error}</div>}
              {success && <div className="msg-box msg-success">{success}</div>}
              {mode === "register" && (
                <div className="field">
                  <span className="field-icon">👤</span>
                  <input type="text" placeholder="Kullanıcı adı" value={form.username} onChange={e => set("username", e.target.value)} />
                </div>
              )}
              <div className="field">
                <span className="field-icon">✉️</span>
                <input type="email" placeholder="E-posta adresi" value={form.email} onChange={e => set("email", e.target.value)} />
              </div>
              <div className="field">
                <span className="field-icon">🔒</span>
                <input type="password" placeholder="Şifre" value={form.password} onChange={e => set("password", e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
              </div>
              {mode === "login" && (
                <div className="forgot-row">
                  <button className="forgot-btn" onClick={() => { setShowForgot(true); setError(""); }}>Şifremi unuttum →</button>
                </div>
              )}
              <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? "⏳ Bekle..." : mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
              </button>
              <div className="divider"><span>veya</span></div>
              <div className="switch-text">
                {mode === "login"
                  ? <> Hesabın yok mu? <button className="switch-link" onClick={() => switchMode("register")}>Kayıt ol →</button></>
                  : <> Zaten hesabın var mı? <button className="switch-link" onClick={() => switchMode("login")}>Giriş yap →</button></>
                }
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// =====================
// MESSAGES SCREEN
// =====================
const EMOJIS = ["😊","😂","🔥","❤️","😍","👏","😢","😮","💯","🎉","😎","🙏","💪","✨","😴","🤔","😅","🥹","💜","👀"];
const QUICK_REACTIONS = ["❤️","😂","😮","😢","😡","👏"];

function MessagesScreen({ user, profile, allProfiles }) {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [unread, setUnread] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [followingIds, setFollowingIds] = useState([]);
  const [showAttach, setShowAttach] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [ctxMenu, setCtxMenu] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [reactions, setReactions] = useState({});
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    supabase.from("follows").select("following_id").eq("follower_id", user.id).then(({ data }) => {
      if (data) setFollowingIds(data.map(f => f.following_id));
    });
  }, [user]);

  useEffect(() => {
    const ch = supabase.channel("unread_global")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const msg = payload.new;
        if (msg.receiver_id === user.id) {
          setUnread(prev => ({ ...prev, [msg.sender_id]: (prev[msg.sender_id] || 0) + 1 }));
          setLastMessages(prev => ({ ...prev, [msg.sender_id]: msg }));
        }
        if (msg.sender_id === user.id) setLastMessages(prev => ({ ...prev, [msg.receiver_id]: msg }));
      }).subscribe();
    return () => supabase.removeChannel(ch);
  }, [user]);

  useEffect(() => {
    if (!selectedUser) return;
    setUnread(prev => ({ ...prev, [selectedUser.id]: 0 }));
    supabase.from("messages").select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${user.id})`)
      .order("created_at")
      .then(({ data }) => { if (data) setMessages(data); });

    const ch = supabase.channel("chat_" + selectedUser.id)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const msg = payload.new;
        if ((msg.sender_id === user.id && msg.receiver_id === selectedUser.id) ||
          (msg.sender_id === selectedUser.id && msg.receiver_id === user.id)) {
          setMessages(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg]);
          if (msg.sender_id === selectedUser.id) {
            setIsTyping(false);
          }
        }
      }).subscribe();
    return () => supabase.removeChannel(ch);
  }, [selectedUser, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (content, type = "text") => {
    const text = content || input.trim();
    if (!text || !selectedUser) return;
    const tempId = "tmp_" + Date.now();
    const temp = { id: tempId, sender_id: user.id, receiver_id: selectedUser.id, content: text, type, created_at: new Date().toISOString(), status: "sending" };
    setMessages(prev => [...prev, temp]);
    if (!content) setInput("");
    setShowAttach(false); setShowEmoji(false);
    await supabase.from("messages").insert({ sender_id: user.id, receiver_id: selectedUser.id, content: text, type });
  };

  const sendLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      sendMessage(`📍 Konumum: https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`);
    });
  };

  const sendFile = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const ext = file.name.split(".").pop();
    const path = `messages/${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("post-media").upload(path, file);
    if (error) return;
    const { data } = supabase.storage.from("post-media").getPublicUrl(path);
    const type = file.type.startsWith("video") ? "video" : "image";
    sendMessage(data.publicUrl, type);
  };

  const handleLongPress = (e, msg) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setCtxMenu({ msg, x: rect.left, y: rect.top });
  };

  const deleteMsg = async (msgId) => {
    setMessages(prev => prev.filter(m => m.id !== msgId));
    await supabase.from("messages").delete().eq("id", msgId);
    setCtxMenu(null);
  };

  const copyMsg = (text) => { navigator.clipboard?.writeText(text); setCtxMenu(null); };

  const addReaction = (msgId, emoji) => {
    setReactions(prev => ({ ...prev, [msgId]: emoji }));
    setCtxMenu(null);
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
  };

  const followedUsers = allProfiles.filter(u => u.id !== user.id && followingIds.includes(u.id));
  const filtered = followedUsers.filter(u => (u.username || u.email || "").toLowerCase().includes(search.toLowerCase()));
  const sorted = [...filtered].sort((a, b) => (lastMessages[b.id]?.created_at || "").localeCompare(lastMessages[a.id]?.created_at || ""));
  const totalUnread = Object.values(unread).reduce((a, b) => a + b, 0);

  // Group messages by date
  const groupedMessages = messages.reduce((groups, msg) => {
    const date = new Date(msg.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  if (selectedUser) {
    return (
      <div className="chat-wrap">
        {/* Header */}
        <div className="chat-header">
          <button className="chat-back" onClick={() => { setSelectedUser(null); setMessages([]); setIsTyping(false); }}>
            <svg viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          </button>
          <Avatar name={selectedUser.username} url={selectedUser.avatar_url} size={40} online />
          <div className="chat-user-info">
            <div className="chat-username">{selectedUser.username || selectedUser.email}</div>
            <div className={`chat-status ${true ? "online" : "offline"}`}>
              {true ? "● çevrimiçi" : "son görülme bilinmiyor"}
            </div>
          </div>
          <div className="chat-actions">
            <div className="chat-action-btn" title="Sesli arama">📞</div>
            <div className="chat-action-btn" title="Görüntülü arama">🎥</div>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages" onClick={() => { setCtxMenu(null); setShowAttach(false); setShowEmoji(false); }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>👋</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Henüz mesaj yok</div>
              <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, marginTop: 6 }}>İlk mesajı sen at!</div>
            </div>
          )}

          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              <div className="msg-date-divider"><span>{date}</span></div>
              {msgs.map((msg, i) => {
                const isMe = msg.sender_id === user.id;
                const showAvatar = !isMe && (i === msgs.length - 1 || msgs[i + 1]?.sender_id !== msg.sender_id);
                const isImage = msg.type === "image";
                const isVideo = msg.type === "video";
                const isLoc = msg.content?.startsWith("📍 ");

                return (
                  <div key={msg.id} className={`msg-row ${isMe ? "me" : "them"}`}
                    onContextMenu={(e) => handleLongPress(e, msg)}>
                    {!isMe && (showAvatar
                      ? <div className="msg-avatar-sm" style={{ background: `${getColor(selectedUser.username)}22` }}>{selectedUser.avatar_url ? <img src={selectedUser.avatar_url} alt="" /> : getInitials(selectedUser.username)}</div>
                      : <div className="msg-avatar-placeholder" />
                    )}
                    <div className="msg-bubble-wrap">
                      <div className={`msg-bubble ${msg.status === "sending" ? "sending" : ""} ${isImage || isVideo ? "media" : ""}`}>
                        {isImage && <img src={msg.content} alt="" />}
                        {isVideo && <video src={msg.content} controls style={{ width: "100%", maxWidth: 220, borderRadius: 14 }} />}
                        {!isImage && !isVideo && (
                          isLoc
                            ? <a href={msg.content.split(": ")[1]} target="_blank" rel="noreferrer" style={{ color: "#00f5ff", textDecoration: "none" }}>{msg.content}</a>
                            : msg.content
                        )}
                      </div>
                      {reactions[msg.id] && (
                        <div className="msg-reactions">
                          <div className="msg-reaction">{reactions[msg.id]}</div>
                        </div>
                      )}
                      <div className="msg-meta-row">
                        <span className="msg-time">{formatMsgTime(msg.created_at)}</span>
                        {isMe && (
                          <span className={`msg-ticks ${msg.status === "sending" ? "sent" : "read"}`}>
                            {msg.status === "sending" ? "✓" : "✓✓"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {isTyping && (
            <div className="typing-indicator">
              <div className="msg-avatar-sm" style={{ background: `${getColor(selectedUser.username)}22` }}>{getInitials(selectedUser.username)}</div>
              <div className="typing-dots">
                <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Context menu */}
        {ctxMenu && (
          <div className="ctx-menu" style={{ top: Math.min(ctxMenu.y, window.innerHeight - 250), left: Math.min(ctxMenu.x, window.innerWidth - 180) }}>
            <div className="ctx-reactions">
              {QUICK_REACTIONS.map(e => (
                <div key={e} className="ctx-emoji" onClick={() => addReaction(ctxMenu.msg.id, e)}>{e}</div>
              ))}
            </div>
            <div className="ctx-item" onClick={() => copyMsg(ctxMenu.msg.content)}>📋 Kopyala</div>
            {ctxMenu.msg.sender_id === user.id && (
              <div className="ctx-item danger" onClick={() => deleteMsg(ctxMenu.msg.id)}>🗑️ Sil</div>
            )}
            <div className="ctx-item" onClick={() => setCtxMenu(null)}>✕ Kapat</div>
          </div>
        )}

        {/* Emoji picker */}
        {showEmoji && (
          <div style={{ padding: "0 12px 8px" }}>
            <div className="emoji-picker">
              {EMOJIS.map(e => (
                <div key={e} className="emoji-opt" onClick={() => { setInput(prev => prev + e); setShowEmoji(false); textareaRef.current?.focus(); }}>{e}</div>
              ))}
            </div>
          </div>
        )}

        {/* Attach menu */}
        {showAttach && (
          <div style={{ padding: "0 16px 8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="attach-menu">
              <div className="attach-item" onClick={() => fileRef.current?.click()}>
                <div className="attach-icon" style={{ background: "rgba(0,245,255,0.12)" }}>📷</div>
                <span className="attach-label">Fotoğraf</span>
              </div>
              <div className="attach-item" onClick={() => fileRef.current?.click()}>
                <div className="attach-icon" style={{ background: "rgba(191,90,242,0.12)" }}>🎥</div>
                <span className="attach-label">Video</span>
              </div>
              <div className="attach-item" onClick={sendLocation}>
                <div className="attach-icon" style={{ background: "rgba(57,255,20,0.12)" }}>📍</div>
                <span className="attach-label">Konum</span>
              </div>
              <div className="attach-item">
                <div className="attach-icon" style={{ background: "rgba(255,149,0,0.12)" }}>📄</div>
                <span className="attach-label">Dosya</span>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*,video/*" onChange={sendFile} style={{ display: "none" }} />
          </div>
        )}

        {/* Input */}
        <div className="chat-input-wrap">
          <div className="chat-input-row">
            <div className="chat-attach-btn" onClick={() => { setShowAttach(!showAttach); setShowEmoji(false); }}>📎</div>
            <div className="chat-input-box">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Mesaj yaz..."
                rows={1}
              />
              <span className="emoji-btn" onClick={() => { setShowEmoji(!showEmoji); setShowAttach(false); }}>😊</span>
            </div>
            {input.trim() ? (
              <button className="chat-send-btn" onClick={() => sendMessage()}>
                <svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
              </button>
            ) : (
              <div className="chat-voice-btn">🎤</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Conversation list
  return (
    <div className="msgs-wrap">
      <div className="msgs-header">
        <div className="msgs-title">
          💬 Mesajlar
          {totalUnread > 0 && <span style={{ marginLeft: 8, background: "linear-gradient(135deg,#00f5ff,#bf5af2)", borderRadius: 20, padding: "2px 10px", fontSize: 12, color: "#fff" }}>{totalUnread}</span>}
        </div>
        <div className="msgs-search">
          <svg width="16" height="16" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Kişi ara..." />
        </div>
      </div>

      <div className="msgs-list">
        {sorted.length === 0 ? (
          <div className="placeholder">
            <div className="placeholder-icon">💬</div>
            <div className="placeholder-title">Henüz mesaj yok</div>
            <div className="placeholder-sub">Takip ettiğin kişilerle mesajlaşmaya başla</div>
          </div>
        ) :
          if (!user) return <><style>{styles}</style><AuthScreen onAuth={u => { setUser(u); loadProfile(u.id); }} /></>;

  const tabs = [
    { id: "feed", label: "Akış", icon: <svg viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18" /></svg> },
    { id: "explore", label: "Keşfet", icon: <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg> },
    { id: "post", label: "Paylaş", icon: null },
    { id: "messages", label: "Mesajlar", badge: unreadMessages, icon: <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg> },
    { id: "profile", label: "Profil", icon: <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
  ];

  return (
    <>
      <style>{styles}</style>
      <div style={{ background: "#050508", minHeight: "100vh", display: "flex", justifyContent: "center", fontFamily: "'DM Sans',sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono&display=swap" rel="stylesheet" />
        <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />
        <div className="grid-bg" />

        <div className="app-wrap">
          {/* TOPBAR */}
          <div className="topbar">
            <div className="topbar-brand">
              <span className="topbar-aura">AURA</span>
              <span className="topbar-sc">sc</span>
            </div>
            <div className="topbar-right">
              <div className="notif-wrap">
                <div className="notif-btn">🔔</div>
              </div>
              <div className="user-avatar" style={{ background: `linear-gradient(135deg,${getColor(profile?.username)},${getColor(profile?.username)}88)` }}>
                {profile?.avatar_url
                  ? <img src={profile.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                  : getInitials(profile?.username)
                }
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="screen-content">
            {activeTab === "feed" && (
              <div className="placeholder">
                <div className="placeholder-icon">🏠</div>
                <div className="placeholder-title">Akış</div>
                <div className="placeholder-sub">Gönderiler bir sonraki adımda gelecek</div>
              </div>
            )}
            {activeTab === "explore" && (
              <div className="placeholder">
                <div className="placeholder-icon">🔍</div>
                <div className="placeholder-title">Keşfet</div>
                <div className="placeholder-sub">Kullanıcı arama bir sonraki adımda gelecek</div>
              </div>
            )}
            {activeTab === "post" && (
              <div className="placeholder">
                <div className="placeholder-icon">➕</div>
                <div className="placeholder-title">Paylaş</div>
                <div className="placeholder-sub">Gönderi oluşturma bir sonraki adımda gelecek</div>
              </div>
            )}
            {activeTab === "messages" && (
              <MessagesScreen user={user} profile={profile} allProfiles={allProfiles} />
            )}
            {activeTab === "profile" && (
              <div className="placeholder">
                <div className="placeholder-icon">👤</div>
                <div className="placeholder-title">Profil</div>
                <div className="placeholder-sub">Profil sayfası bir sonraki adımda gelecek</div>
              </div>
            )}
          </div>

          {/* BOTTOM NAV */}
          <div className="bottom-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-btn ${activeTab === tab.id ? "active" : ""} ${tab.id === "post" ? "nav-post" : ""}`}
                onClick={() => { setActiveTab(tab.id); if (tab.id === "messages") setUnreadMessages(0); }}
              >
                {tab.id === "post" ? (
                  <>
                    <div className="nav-post-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                    </div>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{tab.label}</span>
                  </>
                ) : (
                  <>
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.badge > 0 && <div className="nav-badge">{tab.badge}</div>}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
        }
