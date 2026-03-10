import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://hebljdvucansszxhvnfp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlYmxqZHZ1Y2Fuc3N6eGh2bmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwOTQ1MTQsImV4cCI6MjA4ODY3MDUxNH0.nS3J8Z7bNano_z7jdFmIhtmYrOc6HC2FpmBPrtcPZhI"
);

const LOGO = "https://hebljdvucansszxhvnfp.supabase.co/storage/v1/object/public/post-media/image-4.jpg";
const COLORS = ["#3B82F6","#6366F1","#8B5CF6","#EC4899","#14B8A6","#F59E0B"];
const MOODS = ["😊","😢","😍","😡","😂","🔥","💯","🎉"];
const BG_COLORS = ["transparent","#1a0533","#0a1628","#0d2818","#2d1b00","#1a0a0a","#0a0a2d","#1a1a0a"];
const getColor = (str) => COLORS[(str||"").charCodeAt(0) % COLORS.length];
const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60) return "az önce";
  if (diff < 3600) return `${Math.floor(diff/60)}dk`;
  if (diff < 86400) return `${Math.floor(diff/3600)}sa`;
  return `${Math.floor(diff/86400)}g`;
};

function Avatar({ name, url, size=42, online }) {
  const initials = (name||"?").split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
  return (
    <div style={{position:"relative",flexShrink:0}}>
      <div style={{width:size,height:size,borderRadius:"50%",background:url?"transparent":`linear-gradient(135deg,${getColor(name)},${getColor(name)}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.34,fontWeight:700,color:"#fff",border:"2px solid rgba(99,102,241,0.35)",overflow:"hidden"}}>
        {url?<img src={url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:initials}
      </div>
      {online&&<div style={{position:"absolute",bottom:1,right:1,width:size*0.26,height:size*0.26,borderRadius:"50%",background:"#22C55E",border:"2px solid #0a0a1a"}}/>}
    </div>
  );
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({email:"",password:"",username:""});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handle = async () => {
    setLoading(true); setError(""); setSuccess("");
    try {
      if (mode==="login") {
        const {data,error} = await supabase.auth.signInWithPassword({email:form.email,password:form.password});
        if (error) throw error;
        onAuth(data.user);
      } else {
        if (!form.username.trim()) throw new Error("Kullanıcı adı gerekli!");
        if (form.password.length < 6) throw new Error("Şifre en az 6 karakter olmalı!");
        const {data:ex} = await supabase.from("profiles").select("id").eq("username",form.username.trim()).maybeSingle();
        if (ex) throw new Error("Bu kullanıcı adı alınmış!");
        const {data,error} = await supabase.auth.signUp({email:form.email,password:form.password});
        if (error) throw error;
        if (data.user) await supabase.from("profiles").upsert({id:data.user.id,email:form.email,username:form.username.trim()});
        setSuccess("Kayıt başarılı! Giriş yapabilirsin.");
        setMode("login");
      }
    } catch(e) { setError(e.message); }
    setLoading(false);
  };

  const inp = {background:"rgba(255,255,255,0.06)",border:"1px solid rgba(99,102,241,0.3)",borderRadius:14,padding:"13px 16px",color:"#fff",fontSize:15,outline:"none",fontFamily:"inherit",width:"100%",boxSizing:"border-box"};

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 28px",background:"linear-gradient(160deg,#0a0a1a 0%,#0d0d2b 50%,#0a0a1a 100%)"}}>
      <img src={LOGO} style={{width:100,height:100,borderRadius:26,marginBottom:18,objectFit:"cover",boxShadow:"0 0 50px rgba(99,102,241,0.5),0 0 100px rgba(236,72,153,0.25)"}} alt=""/>
      <div style={{fontSize:30,fontWeight:900,marginBottom:3,letterSpacing:-1,background:"linear-gradient(90deg,#60A5FA,#A78BFA,#F472B6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>AURA SC</div>
      <div style={{color:"rgba(148,163,184,0.6)",fontSize:13,marginBottom:32}}>Sosyal platformun</div>
      <div style={{width:"100%",display:"flex",flexDirection:"column",gap:10}}>
        {mode==="register"&&<input value={form.username} onChange={e=>set("username",e.target.value)} placeholder="Kullanıcı adı" style={inp}/>}
        <input value={form.email} onChange={e=>set("email",e.target.value)} placeholder="E-posta" type="email" style={inp}/>
        <input value={form.password} onChange={e=>set("password",e.target.value)} placeholder="Şifre (min 6 karakter)" type="password" style={inp}/>
        {error&&<div style={{color:"#F87171",fontSize:13,textAlign:"center",padding:8,background:"rgba(248,113,113,0.1)",borderRadius:10}}>{error}</div>}
        {success&&<div style={{color:"#34D399",fontSize:13,textAlign:"center",padding:8,background:"rgba(52,211,153,0.1)",borderRadius:10}}>{success}</div>}
        <button onClick={handle} disabled={loading} style={{background:"linear-gradient(135deg,#6366F1,#EC4899)",border:"none",borderRadius:14,padding:15,color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",marginTop:4,fontFamily:"inherit",boxShadow:"0 8px 25px rgba(99,102,241,0.35)"}}>
          {loading?"⏳":mode==="login"?"Giriş Yap":"Kayıt Ol"}
        </button>
        <button onClick={()=>{setMode(mode==="login"?"register":"login");setError("");}} style={{background:"none",border:"none",color:"rgba(148,163,184,0.55)",fontSize:13,cursor:"pointer",fontFamily:"inherit",marginTop:2}}>
          {mode==="login"?"Hesabın yok mu? Kayıt ol →":"Zaten hesabın var mı? Giriş yap →"}
        </button>
      </div>
    </div>
  );
}

function UserProfileModal({ targetUser, currentUser, onClose }) {
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{data:p},{data:f},{data:fc},{data:fg}] = await Promise.all([
        supabase.from("posts").select("*").eq("user_id",targetUser.id).order("created_at",{ascending:false}),
        supabase.from("follows").select("id").eq("follower_id",currentUser.id).eq("following_id",targetUser.id).maybeSingle(),
        supabase.from("follows").select("*,profiles!follows_follower_id_fkey(username,avatar_url)").eq("following_id",targetUser.id),
        supabase.from("follows").select("*,profiles!follows_following_id_fkey(username,avatar_url)").eq("follower_id",targetUser.id),
      ]);
      if (p) setPosts(p);
      setIsFollowing(!!f);
      if (fc) setFollowers(fc);
      if (fg) setFollowing(fg);
      setLoading(false);
    };
    load();
  }, [targetUser,currentUser]);

  const toggleFollow = async () => {
    if (isFollowing) {
      await supabase.from("follows").delete().eq("follower_id",currentUser.id).eq("following_id",targetUser.id);
      setIsFollowing(false);
      setFollowers(prev=>prev.filter(f=>f.follower_id!==currentUser.id));
    } else {
      await supabase.from("follows").insert({follower_id:currentUser.id,following_id:targetUser.id});
      setIsFollowing(true);
      setFollowers(prev=>[...prev,{follower_id:currentUser.id}]);
    }
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:200,display:"flex",flexDirection:"column",backdropFilter:"blur(12px)"}}>
      <div style={{background:"linear-gradient(180deg,#0d0d2b,#0a0a1a)",flex:1,overflowY:"auto",borderRadius:"24px 24px 0 0",marginTop:50}}>
        <div style={{padding:"16px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid rgba(99,102,241,0.15)",position:"sticky",top:0,background:"rgba(13,13,43,0.95)",backdropFilter:"blur(20px)",zIndex:5}}>
          <button onClick={onClose} style={{background:"rgba(99,102,241,0.15)",border:"none",cursor:"pointer",color:"#818CF8",width:36,height:36,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <div style={{color:"#F1F5F9",fontWeight:700,fontSize:16}}>{targetUser.username}</div>
        </div>
        {loading ? <div style={{textAlign:"center",padding:40,color:"rgba(148,163,184,0.4)"}}>Yükleniyor...</div> : (
          <>
            <div style={{padding:"20px",display:"flex",flexDirection:"column",alignItems:"center",borderBottom:"1px solid rgba(99,102,241,0.1)"}}>
              <Avatar name={targetUser.username} url={targetUser.avatar_url} size={90}/>
              <div style={{color:"#F1F5F9",fontSize:20,fontWeight:800,marginTop:12}}>{targetUser.username}</div>
              {targetUser.bio&&<div style={{color:"rgba(148,163,184,0.7)",fontSize:13,marginTop:6,textAlign:"center",maxWidth:260}}>{targetUser.bio}</div>}
              <div style={{display:"flex",gap:32,marginTop:16}}>
                {[[posts.length,"Gönderi"],[followers.length,"Takipçi"],[following.length,"Takip"]].map(([n,l])=>(
                  <div key={l} style={{textAlign:"center"}}>
                    <div style={{color:"#F1F5F9",fontSize:18,fontWeight:800}}>{n}</div>
                    <div style={{color:"rgba(129,140,248,0.5)",fontSize:11}}>{l}</div>
                  </div>
                ))}
              </div>
              {currentUser.id!==targetUser.id&&(
                <button onClick={toggleFollow} style={{marginTop:14,padding:"10px 30px",borderRadius:20,background:isFollowing?"rgba(99,102,241,0.12)":"linear-gradient(135deg,#6366F1,#EC4899)",border:isFollowing?"1px solid rgba(99,102,241,0.3)":"none",color:isFollowing?"#818CF8":"#fff",fontWeight:700,cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>
                  {isFollowing?"Takibi Bırak":"Takip Et"}
                </button>
              )}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:2,padding:2}}>
              {posts.filter(p=>p.media_url).map(post=>(
                <div key={post.id} style={{aspectRatio:"1",overflow:"hidden"}}>
                  {post.media_type==="video"?<video src={post.media_url} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<img src={post.media_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                </div>
              ))}
              {posts.filter(p=>p.media_url).length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",color:"rgba(148,163,184,0.3)",padding:40}}>Henüz gönderi yok</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MessagesScreen({ user, allProfiles }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [unread, setUnread] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [followingIds, setFollowingIds] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    supabase.from("follows").select("following_id").eq("follower_id",user.id).then(({data})=>{
      if (data) setFollowingIds(data.map(f=>f.following_id));
    });
  }, [user]);

  useEffect(() => {
    const channel = supabase.channel("unread_msgs")
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"messages"},(payload)=>{
        const msg = payload.new;
        if (msg.receiver_id===user.id) {
          setUnread(prev=>({...prev,[msg.sender_id]:(prev[msg.sender_id]||0)+1}));
          setLastMessages(prev=>({...prev,[msg.sender_id]:msg}));
        }
        if (msg.sender_id===user.id) {
          setLastMessages(prev=>({...prev,[msg.receiver_id]:msg}));
        }
      }).subscribe();
    return ()=>supabase.removeChannel(channel);
  }, [user]);

  useEffect(()=>{
    if (!selectedUser) return;
    setUnread(prev=>({...prev,[selectedUser.id]:0}));
    supabase.from("messages").select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${user.id})`)
      .order("created_at").then(({data})=>{ if(data) setMessages(data); });
    const ch = supabase.channel("chat_"+selectedUser.id)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"messages"},(payload)=>{
        const msg = payload.new;
        if ((msg.sender_id===user.id&&msg.receiver_id===selectedUser.id)||(msg.sender_id===selectedUser.id&&msg.receiver_id===user.id)) {
          setMessages(prev=>prev.find(m=>m.id===msg.id)?prev:[...prev,msg]);
        }
      }).subscribe();
    return ()=>supabase.removeChannel(ch);
  }, [selectedUser,user]);

  useEffect(()=>{ messagesEndRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  const sendMessage = async (content) => {
    const text = content||input.trim();
    if (!text||!selectedUser) return;
    const temp = {id:"tmp_"+Date.now(),sender_id:user.id,receiver_id:selectedUser.id,content:text,created_at:new Date().toISOString()};
    setMessages(prev=>[...prev,temp]);
    if (!content) setInput("");
    await supabase.from("messages").insert({sender_id:user.id,receiver_id:selectedUser.id,content:text});
  };

  const shareLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos=>{
      sendMessage(`📍 Konumum: https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`);
    });
  };

  const followedUsers = allProfiles.filter(u=>u.id!==user.id&&followingIds.includes(u.id));
  const filtered = followedUsers.filter(u=>(u.username||u.email||"").toLowerCase().includes(search.toLowerCase()));
  const sorted = [...filtered].sort((a,b)=>{
    const aTime = lastMessages[a.id]?.created_at||"";
    const bTime = lastMessages[b.id]?.created_at||"";
    return bTime.localeCompare(aTime);
  });
  const totalUnread = Object.values(unread).reduce((a,b)=>a+b,0);

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      {selectedUser ? (
        <>
          <div style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:12,background:"rgba(10,10,26,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(99,102,241,0.15)"}}>
            <button onClick={()=>{setSelectedUser(null);setMessages([]);}} style={{background:"rgba(99,102,241,0.15)",border:"none",cursor:"pointer",color:"#818CF8",width:36,height:36,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            </button>
            <Avatar name={selectedUser.username||selectedUser.email} url={selectedUser.avatar_url} size={40} online/>
            <div>
              <div style={{color:"#F1F5F9",fontWeight:700,fontSize:15}}>{selectedUser.username||selectedUser.email}</div>
              <div style={{color:"#22C55E",fontSize:11}}>● çevrimiçi</div>
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:10,background:"linear-gradient(180deg,#0d0d2b,#0a0a1a)"}}>
            {messages.length===0&&<div style={{textAlign:"center",color:"rgba(148,163,184,0.4)",fontSize:13,marginTop:40}}>Henüz mesaj yok 👋</div>}
            {messages.map(msg=>{
              const isMe = msg.sender_id===user.id;
              const isLoc = msg.content?.startsWith("📍");
              return (
                <div key={msg.id} style={{display:"flex",justifyContent:isMe?"flex-end":"flex-start",alignItems:"flex-end",gap:8}}>
                  {!isMe&&<Avatar name={selectedUser.username} url={selectedUser.avatar_url} size={28}/>}
                  <div style={{maxWidth:"72%",padding:"10px 14px",borderRadius:isMe?"18px 18px 4px 18px":"18px 18px 18px 4px",background:isMe?"linear-gradient(135deg,#6366F1,#EC4899)":"rgba(255,255,255,0.06)",border:isMe?"none":"1px solid rgba(99,102,241,0.2)",color:"#F1F5F9",fontSize:14,lineHeight:1.5,opacity:msg.id?.startsWith("tmp_")?0.7:1}}>
                    {isLoc?<a href={msg.content.split(": ")[1]} target="_blank" rel="noreferrer" style={{color:"#60A5FA",textDecoration:"none"}}>{msg.content}</a>:msg.content}
                    <div style={{fontSize:10,opacity:0.4,marginTop:3,textAlign:"right"}}>{new Date(msg.created_at).toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef}/>
          </div>
          <div style={{padding:"10px 12px 36px",display:"flex",gap:8,alignItems:"center",background:"rgba(10,10,26,0.95)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(99,102,241,0.1)"}}>
            <button onClick={shareLocation} style={{width:40,height:40,borderRadius:"50%",background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.25)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:17}}>📍</button>
            <div style={{flex:1,background:"rgba(99,102,241,0.08)",borderRadius:24,padding:"11px 16px",border:"1px solid rgba(99,102,241,0.2)"}}>
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()} placeholder="Mesaj yaz..." style={{background:"none",border:"none",outline:"none",color:"#F1F5F9",fontSize:14,width:"100%",fontFamily:"inherit"}}/>
            </div>
            <button onClick={()=>sendMessage()} style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#6366F1,#EC4899)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 18px rgba(99,102,241,0.4)",flexShrink:0}}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </>
      ) : (
        <div style={{flex:1,overflowY:"auto",background:"linear-gradient(180deg,#0d0d2b,#0a0a1a)"}}>
          <div style={{padding:"12px 16px 8px"}}>
            {totalUnread>0&&<div style={{background:"rgba(236,72,153,0.1)",border:"1px solid rgba(236,72,153,0.3)",borderRadius:12,padding:"8px 14px",marginBottom:8,color:"#F472B6",fontSize:13}}>🔔 {totalUnread} okunmamış mesaj</div>}
            <div style={{background:"rgba(99,102,241,0.08)",borderRadius:20,padding:"10px 16px",display:"flex",gap:8,alignItems:"center",border:"1px solid rgba(99,102,241,0.2)"}}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="rgba(129,140,248,0.8)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Kişi ara..." style={{background:"none",border:"none",outline:"none",color:"#F1F5F9",fontSize:13,width:"100%",fontFamily:"inherit"}}/>
            </div>
          </div>
          {sorted.length===0?(
            <div style={{textAlign:"center",padding:40}}>
              <div style={{fontSize:40,marginBottom:12}}>💬</div>
              <div style={{color:"rgba(148,163,184,0.5)",fontSize:14}}>Takip ettiğin kişiler burada görünür</div>
              <div style={{color:"rgba(148,163,184,0.3)",fontSize:12,marginTop:6}}>Keşfet'ten birini takip et!</div>
            </div>
          ):sorted.map(u=>(
            <div key={u.id} onClick={()=>setSelectedUser(u)} style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <div style={{position:"relative"}}>
                <Avatar name={u.username||u.email} url={u.avatar_url} size={52}/>
                {unread[u.id]>0&&<div style={{position:"absolute",top:-2,right:-2,background:"#EC4899",borderRadius:"50%",minWidth:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:700,padding:"0 4px"}}>{unread[u.id]}</div>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{color:"#F1F5F9",fontWeight:700,fontSize:15}}>{u.username||u.email}</div>
                {lastMessages[u.id]&&<div style={{color:"rgba(148,163,184,0.4)",fontSize:12,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{lastMessages[u.id].sender_id===user.id?"Sen: ":""}{lastMessages[u.id].content}</div>}
              </div>
              {lastMessages[u.id]&&<div style={{color:"rgba(148,163,184,0.3)",fontSize:11,flexShrink:0}}>{timeAgo(lastMessages[u.id].created_at)}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PostCard({ post, user, onDelete, onUpdate, onProfileClick }) {
  const [liked, setLiked] = useState((post.likes||[]).includes(user.id));
  const [likeCount, setLikeCount] = useState((post.likes||[]).length);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [commentInput, setCommentInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content||"");
  const isOwner = post.user_id===user.id;

  useEffect(()=>{
    supabase.from("saved_posts").select("id").eq("user_id",user.id).eq("post_id",post.id).maybeSingle().then(({data})=>setSaved(!!data));
    supabase.from("comments").select("id",{count:"exact"}).eq("post_id",post.id).then(({count})=>setCommentCount(count||0));
  },[]);

  const loadComments = async () => {
    const {data} = await supabase.from("comments").select("*").eq("post_id",post.id).order("created_at");
    if (!data) return;
    const withProfiles = await Promise.all(data.map(async c => {
      const {data:prof} = await supabase.from("profiles").select("username,avatar_url").eq("id",c.user_id).single();
      return {...c,profiles:prof};
    }));
    setComments(withProfiles);
    setCommentCount(withProfiles.length);
  };

  const toggleComments = ()=>{ if(!showComments) loadComments(); setShowComments(!showComments); };

  const toggleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked); setLikeCount(p=>newLiked?p+1:p-1);
    const newLikes = newLiked?[...(post.likes||[]),user.id]:(post.likes||[]).filter(id=>id!==user.id);
    post.likes = newLikes;
    await supabase.from("posts").update({likes:newLikes}).eq("id",post.id);
  };

  const toggleSave = async () => {
    if (saved) { await supabase.from("saved_posts").delete().eq("user_id",user.id).eq("post_id",post.id); setSaved(false); }
    else { await supabase.from("saved_posts").insert({user_id:user.id,post_id:post.id}); setSaved(true); }
  };

  const addComment = async () => {
    if (!commentInput.trim()) return;
    const text = commentInput.trim();
    setCommentInput("");
    await supabase.from("comments").insert({post_id:post.id,user_id:user.id,content:text});
    loadComments();
  };

  const deletePost = async () => { await supabase.from("posts").delete().eq("id",post.id); onDelete(post.id); };
  const saveEdit = async () => { await supabase.from("posts").update({content:editContent}).eq("id",post.id); onUpdate(post.id,editContent); setEditing(false); };

  const bgStyle = post.bg_color&&post.bg_color!=="transparent"?{background:post.bg_color}:{};

  return (
    <div style={{margin:"0 16px 12px",borderRadius:20,background:"rgba(255,255,255,0.025)",border:"1px solid rgba(99,102,241,0.12)",overflow:"hidden",...bgStyle}}>
      <div style={{padding:"12px 14px 8px",display:"flex",alignItems:"center",gap:10}}>
        <div onClick={()=>onProfileClick&&onProfileClick(post.profiles)} style={{cursor:"pointer"}}>
          <Avatar name={post.profiles?.username||"?"} url={post.profiles?.avatar_url} size={40}/>
        </div>
        <div style={{flex:1,cursor:"pointer"}} onClick={()=>onProfileClick&&onProfileClick(post.profiles)}>
          <div style={{color:"#F1F5F9",fontWeight:700,fontSize:14}}>{post.profiles?.username||"Kullanıcı"} {post.mood&&<span style={{fontSize:16}}>{post.mood}</span>}</div>
          <div style={{color:"rgba(129,140,248,0.4)",fontSize:11,display:"flex",gap:6,flexWrap:"wrap"}}>
            <span>{timeAgo(post.created_at)}</span>
            {post.location&&<span>· 📍 {post.location}</span>}
          </div>
        </div>
        {isOwner&&(
          <div style={{position:"relative"}}>
            <button onClick={()=>setMenuOpen(!menuOpen)} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(148,163,184,0.5)",padding:"4px 8px",fontSize:20,lineHeight:1}}>⋯</button>
            {menuOpen&&(
              <div style={{position:"absolute",right:0,top:30,background:"#12122a",border:"1px solid rgba(99,102,241,0.3)",borderRadius:14,overflow:"hidden",zIndex:20,minWidth:130,boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>
                <button onClick={()=>{setEditing(true);setMenuOpen(false);}} style={{display:"block",width:"100%",padding:"11px 16px",background:"none",border:"none",color:"#818CF8",cursor:"pointer",textAlign:"left",fontSize:13,fontFamily:"inherit"}}>✏️ Düzenle</button>
                <button onClick={()=>{deletePost();setMenuOpen(false);}} style={{display:"block",width:"100%",padding:"11px 16px",background:"none",border:"none",color:"#F87171",cursor:"pointer",textAlign:"left",fontSize:13,fontFamily:"inherit"}}>🗑️ Sil</button>
              </div>
            )}
          </div>
        )}
      </div>

      {editing?(
        <div style={{padding:"0 14px 12px"}}>
          <textarea value={editContent} onChange={e=>setEditContent(e.target.value)} rows={3} style={{width:"100%",background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.3)",borderRadius:12,padding:"10px 14px",color:"#F1F5F9",fontSize:14,fontFamily:"inherit",outline:"none",resize:"none",boxSizing:"border-box"}}/>
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <button onClick={saveEdit} style={{padding:"7px 16px",borderRadius:10,background:"linear-gradient(135deg,#6366F1,#EC4899)",border:"none",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Kaydet</button>
            <button onClick={()=>setEditing(false)} style={{padding:"7px 16px",borderRadius:10,background:"rgba(255,255,255,0.06)",border:"none",color:"#F1F5F9",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>İptal</button>
          </div>
        </div>
      ):post.content&&<div style={{padding:"0 14px 10px",color:"#CBD5E1",fontSize:14,lineHeight:1.65}}>{post.content}</div>}

      {post.media_url&&(post.media_type==="video"?
        <video src={post.media_url} style={{width:"100%",maxHeight:340,objectFit:"cover"}} controls/>:
        <img src={post.media_url} alt="" style={{width:"100%",maxHeight:340,objectFit:"cover"}}/>
      )}

      <div style={{padding:"10px 14px",display:"flex",gap:16,borderTop:"1px solid rgba(99,102,241,0.08)",alignItems:"center"}}>
        <button onClick={toggleLike} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,color:liked?"#EC4899":"rgba(148,163,184,0.45)",fontSize:13,fontFamily:"inherit",padding:0}}>
          <svg width="19" height="19" fill={liked?"#EC4899":"none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          {likeCount>0&&likeCount}
        </button>
        <button onClick={toggleComments} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,color:showComments?"#818CF8":"rgba(148,163,184,0.45)",fontSize:13,fontFamily:"inherit",padding:0}}>
          <svg width="19" height="19" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          {commentCount>0?commentCount:"Yorum"}
        </button>
        <button onClick={toggleSave} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,color:saved?"#F59E0B":"rgba(148,163,184,0.45)",fontSize:13,fontFamily:"inherit",padding:0,marginLeft:"auto"}}>
          <svg width="19" height="19" fill={saved?"#F59E0B":"none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
        </button>
      </div>

      {showComments&&(
        <div style={{padding:"0 14px 14px",borderTop:"1px solid rgba(99,102,241,0.07)"}}>
          {comments.length===0&&<div style={{textAlign:"center",color:"rgba(148,163,184,0.3)",fontSize:12,padding:"12px 0"}}>İlk yorumu yap!</div>}
          {comments.length===0&&<div style={{textAlign:"center",color:"rgba(148,163,184,0.3)",fontSize:12,padding:"12px 0"}}>İlk yorumu yap!</div>}
          {comments.map(c=>{
            const isMyComment = c.user_id===user.id;
            return (
            <div key={c.id} style={{display:"flex",gap:8,marginTop:10,alignItems:"flex-start"}}>
              <Avatar name={c.profiles?.username} url={c.profiles?.avatar_url} size={28}/>
              <div style={{background:"rgba(99,102,241,0.08)",borderRadius:12,padding:"8px 12px",flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                  <div style={{color:"#818CF8",fontSize:11,fontWeight:700}}>{c.profiles?.username}</div>
                  {isMyComment&&<button onClick={async()=>{await supabase.from("comments").delete().eq("id",c.id);loadComments();}} style={{background:"none",border:"none",color:"#F87171",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>🗑️</button>}
                </div>
                <div style={{color:"#CBD5E1",fontSize:13}}>{c.content}</div>
              </div>
            </div>
            );
          })}
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <input value={commentInput} onChange={e=>setCommentInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addComment()} placeholder="Yorum yaz..." style={{flex:1,background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:20,padding:"8px 14px",color:"#F1F5F9",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
            
            <button onClick={addComment} style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#6366F1,#EC4899)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FeedScreen({ user, profile, onProfileClick }) {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [posting, setPosting] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedBg, setSelectedBg] = useState("transparent");
  const [showMoods, setShowMoods] = useState(false);
  const [showBgs, setShowBgs] = useState(false);
  const [location, setLocation] = useState(null);
  const [gettingLoc, setGettingLoc] = useState(false);
  const fileRef = useRef();

  const loadPosts = useCallback(async () => {
    const {data,error} = await supabase.from("posts").select("*").order("created_at",{ascending:false}).limit(50);
    if (error||!data) return;
    const withProfiles = await Promise.all(data.map(async post=>{
      const {data:prof} = await supabase.from("profiles").select("username,avatar_url").eq("id",post.user_id).single();
      return {...post,profiles:prof};
    }));
    setPosts(withProfiles);
  },[]);

  useEffect(()=>{
    loadPosts();
    const ch = supabase.channel("feed_changes")
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"posts"},()=>loadPosts())
      .subscribe();
    return ()=>supabase.removeChannel(ch);
  },[loadPosts]);

  const getLocation = () => {
    if (!navigator.geolocation) return;
    setGettingLoc(true);
    navigator.geolocation.getCurrentPosition(async pos=>{
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
        const d = await res.json();
        setLocation(d.address?.city||d.address?.town||d.address?.county||"Bilinmiyor");
      } catch { setLocation("Konum alındı"); }
      setGettingLoc(false);
    },()=>setGettingLoc(false));
  };

  const handleFile = e=>{
    const file = e.target.files[0]; if(!file) return;
    setMediaFile(file); setMediaType(file.type.startsWith("video")?"video":"image");
    const r = new FileReader(); r.onload=ev=>setMediaPreview(ev.target.result); r.readAsDataURL(file);
  };

  const submitPost = async () => {
    if (!content.trim()&&!mediaFile) return;
    setPosting(true);
    let media_url=null,media_type=null;
    if (mediaFile) {
      const ext = mediaFile.name.split(".").pop();
      const path = `posts/${user.id}/${Date.now()}.${ext}`;
      const {error} = await supabase.storage.from("post-media").upload(path,mediaFile);
      if (!error) { const {data:u}=supabase.storage.from("post-media").getPublicUrl(path); media_url=u.publicUrl; media_type=mediaType; }
    }
    await supabase.from("posts").insert({user_id:user.id,content:content.trim(),media_url,media_type,mood:selectedMood,bg_color:selectedBg,location});
    setContent(""); setMediaFile(null); setMediaPreview(null); setSelectedMood(null); setSelectedBg("transparent"); setLocation(null);
    setPosting(false);
  };

  const postBg = selectedBg!=="transparent"?{background:selectedBg}:{};

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{overflowY:"auto",flex:1,background:"linear-gradient(180deg,#0d0d2b,#0a0a1a)"}}>
        <div style={{margin:"12px 16px",borderRadius:20,background:"rgba(99,102,241,0.06)",border:"1px solid rgba(99,102,241,0.2)",padding:14,transition:"background 0.3s",...postBg}}>
          <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <Avatar name={profile?.username||"?"} url={profile?.avatar_url} size={40}/>
            <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder={`Ne düşünüyorsun? ${selectedMood||""}`} rows={2} style={{flex:1,background:"none",border:"none",outline:"none",color:"#F1F5F9",fontSize:14,fontFamily:"inherit",resize:"none",lineHeight:1.5,paddingTop:8}}/>
          </div>
          {(location||gettingLoc)&&(
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:6,color:"#60A5FA",fontSize:12}}>
              📍 {gettingLoc?"Konum alınıyor...":location}
              {location&&<button onClick={()=>setLocation(null)} style={{background:"none",border:"none",color:"#F87171",cursor:"pointer",fontSize:15,lineHeight:1}}>×</button>}
            </div>
          )}
          {mediaPreview&&(
            <div style={{position:"relative",marginTop:10,borderRadius:12,overflow:"hidden"}}>
              {mediaType==="video"?<video src={mediaPreview} style={{width:"100%",maxHeight:200,objectFit:"cover"}} controls/>:<img src={mediaPreview} alt="" style={{width:"100%",maxHeight:200,objectFit:"cover"}}/>}
              <button onClick={()=>{setMediaFile(null);setMediaPreview(null);}} style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,0.65)",border:"none",borderRadius:"50%",width:28,height:28,color:"#fff",cursor:"pointer",fontSize:16}}>×</button>
            </div>
          )}
          {showMoods&&<div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8}}>{MOODS.map(m=><button key={m} onClick={()=>{setSelectedMood(m);setShowMoods(false);}} style={{fontSize:22,background:selectedMood===m?"rgba(99,102,241,0.3)":"rgba(255,255,255,0.05)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:10,padding:"4px 8px",cursor:"pointer"}}>{m}</button>)}</div>}
          {showBgs&&<div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>{BG_COLORS.map(c=><button key={c} onClick={()=>{setSelectedBg(c);setShowBgs(false);}} style={{width:32,height:32,borderRadius:8,background:c==="transparent"?"rgba(255,255,255,0.08)":c,border:selectedBg===c?"2px solid #818CF8":"1px solid rgba(99,102,241,0.3)",cursor:"pointer",color:c==="transparent"?"#818CF8":"transparent",fontSize:14}}>{c==="transparent"?"✕":""}</button>)}</div>}
          <div style={{display:"flex",gap:6,justifyContent:"space-between",alignItems:"center",marginTop:10}}>
            <div style={{display:"flex",gap:6}}>
              <button onClick={()=>fileRef.current.click()} style={{background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.25)",borderRadius:20,padding:"6px 12px",color:"#818CF8",fontSize:14,cursor:"pointer"}}>📷</button>
              <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFile} style={{display:"none"}}/>
              <button onClick={()=>{setShowMoods(!showMoods);setShowBgs(false);}} style={{background:selectedMood?"rgba(99,102,241,0.25)":"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.25)",borderRadius:20,padding:"6px 12px",fontSize:14,cursor:"pointer"}}>{selectedMood||"😊"}</button>
              <button onClick={()=>{setShowBgs(!showBgs);setShowMoods(false);}} style={{background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.25)",borderRadius:20,padding:"6px 12px",color:"#818CF8",fontSize:14,cursor:"pointer"}}>🎨</button>
              <button onClick={getLocation} style={{background:location?"rgba(96,165,250,0.18)":"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.25)",borderRadius:20,padding:"6px 12px",color:location?"#60A5FA":"#818CF8",fontSize:14,cursor:"pointer"}}>📍</button>
            </div>
            <button onClick={submitPost} disabled={posting||(!content.trim()&&!mediaFile)} style={{background:"linear-gradient(135deg,#6366F1,#EC4899)",border:"none",borderRadius:20,padding:"8px 20px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",opacity:(!content.trim()&&!mediaFile)?0.4:1}}>
              {posting?"⏳":"Paylaş"}
            </button>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",padding:"0 16px 8px"}}>
          <button onClick={loadPosts} style={{background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:20,padding:"5px 14px",color:"rgba(129,140,248,0.6)",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>🔄 Yenile</button>
        </div>
        {posts.length===0&&<div style={{textAlign:"center",color:"rgba(148,163,184,0.3)",padding:50,fontSize:14}}>Henüz gönderi yok 🌀<br/><span style={{fontSize:12}}>İlk paylaşımı yap!</span></div>}
        {posts.map(post=>(
          <PostCard key={post.id} post={post} user={user} onProfileClick={onProfileClick}
            onDelete={id=>setPosts(prev=>prev.filter(p=>p.id!==id))}
            onUpdate={(id,c)=>setPosts(prev=>prev.map(p=>p.id===id?{...p,content:c}:p))}
          />
        ))}
      </div>
    </div>
  );
}

function KesfetScreen({ user, allProfiles, onProfileClick }) {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(()=>{
    const load = async ()=>{
      const {data} = await supabase.from("posts").select("*").order("created_at",{ascending:false}).limit(30);
      if (!data) return;
      const withProf = await Promise.all(data.map(async p=>{
        const {data:prof} = await supabase.from("profiles").select("username,avatar_url").eq("id",p.user_id).single();
        return {...p,profiles:prof};
      }));
      setPosts(withProf);
    };
    load();
  },[]);

  const filtered = allProfiles.filter(u=>u.id!==user.id&&(u.username||"").toLowerCase().includes(search.toLowerCase())&&search.length>0);

  return (
    <div style={{flex:1,overflowY:"auto",background:"linear-gradient(180deg,#0d0d2b,#0a0a1a)"}}>
      <div style={{padding:"12px 16px 8px",position:"sticky",top:0,background:"rgba(10,10,26,0.95)",backdropFilter:"blur(20px)",zIndex:5}}>
        <div style={{background:"rgba(99,102,241,0.08)",borderRadius:20,padding:"10px 16px",display:"flex",gap:8,alignItems:"center",border:"1px solid rgba(99,102,241,0.2)"}}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="rgba(129,140,248,0.8)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Kullanıcı ara..." style={{background:"none",border:"none",outline:"none",color:"#F1F5F9",fontSize:13,width:"100%",fontFamily:"inherit"}}/>
        </div>
      </div>
      {search.length>0?(
        filtered.length===0?<div style={{textAlign:"center",color:"rgba(148,163,184,0.4)",padding:30,fontSize:14}}>Kullanıcı bulunamadı</div>:
        filtered.map(u=>(
          <div key={u.id} onClick={()=>onProfileClick(u)} style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
            <Avatar name={u.username||u.email} url={u.avatar_url} size={48}/>
            <div style={{flex:1}}>
              <div style={{color:"#F1F5F9",fontWeight:700}}>{u.username||u.email}</div>
              {u.bio&&<div style={{color:"rgba(148,163,184,0.5)",fontSize:12,marginTop:2}}>{u.bio}</div>}
            </div>
            <div style={{color:"rgba(129,140,248,0.4)",fontSize:12}}>Profil →</div>
          </div>
        ))
      ):(
        <div>
          <div style={{padding:"14px 16px 6px",color:"rgba(129,140,248,0.45)",fontSize:10,fontWeight:700,letterSpacing:2}}>POPÜLER GÖNDERİLER</div>
          {posts.length===0&&<div style={{textAlign:"center",color:"rgba(148,163,184,0.3)",padding:40,fontSize:14}}>Henüz gönderi yok 🌀</div>}
          {posts.map(post=>(
            <div key={post.id} style={{margin:"0 16px 12px",borderRadius:20,overflow:"hidden",border:"1px solid rgba(99,102,241,0.15)",background:"rgba(99,102,241,0.04)"}}>
              {post.media_url&&(post.media_type==="video"?<video src={post.media_url} style={{width:"100%",maxHeight:260,objectFit:"cover"}} controls/>:<img src={post.media_url} alt="" style={{width:"100%",maxHeight:260,objectFit:"cover"}}/>)}
              <div style={{padding:"12px 14px"}}>
                <div onClick={()=>onProfileClick(post.profiles)} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,cursor:"pointer"}}>
                  <Avatar name={post.profiles?.username} url={post.profiles?.avatar_url} size={30}/>
                  <span style={{color:"#818CF8",fontWeight:700,fontSize:13}}>{post.profiles?.username} {post.mood}</span>
                  {post.location&&<span style={{color:"rgba(96,165,250,0.6)",fontSize:11}}>📍{post.location}</span>}
                </div>
                {post.content&&<div style={{color:"#CBD5E1",fontSize:13,lineHeight:1.5}}>{post.content}</div>}
                <div style={{color:"rgba(148,163,184,0.3)",fontSize:11,marginTop:4}}>{timeAgo(post.created_at)} · ❤️ {(post.likes||[]).length}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileScreen({ user, profile, onLogout, onUpdateProfile }) {
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(profile?.username||"");
  const [newBio, setNewBio] = useState(profile?.bio||"");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [showFollowModal, setShowFollowModal] = useState(null);
  const avatarRef = useRef();

  useEffect(()=>{
    Promise.all([
      supabase.from("posts").select("*").eq("user_id",user.id).order("created_at",{ascending:false}),
      supabase.from("follows").select("*,profiles!follows_follower_id_fkey(id,username,avatar_url,bio)").eq("following_id",user.id),
      supabase.from("follows").select("*,profiles!follows_following_id_fkey(id,username,avatar_url,bio)").eq("follower_id",user.id),
      supabase.from("saved_posts").select("*,posts(*)").eq("user_id",user.id)
    ]).then(([{data:p},{data:f1},{data:f2},{data:s}])=>{
      if(p) setUserPosts(p);
      if(f1) setFollowers(f1);
      if(f2) setFollowing(f2);
      if(s) setSavedPosts(s.map(x=>x.posts).filter(Boolean));
    });
  },[user]);

  const saveProfile = async ()=>{
    if (!newUsername.trim()) return;
    setSaving(true); setError("");
    const {data:ex} = await supabase.from("profiles").select("id").eq("username",newUsername.trim()).neq("id",user.id).maybeSingle();
    if (ex) { setError("Bu kullanıcı adı alınmış!"); setSaving(false); return; }
    await supabase.from("profiles").update({username:newUsername.trim(),bio:newBio.trim()}).eq("id",user.id);
    onUpdateProfile({...profile,username:newUsername.trim(),bio:newBio.trim()});
    setEditing(false); setSaving(false);
  };

  const uploadAvatar = async e=>{
    const file = e.target.files[0]; if(!file) return;
    setUploadingAvatar(true);
    const ext = file.name.split(".").pop();
    const path = `avatars/${user.id}_${Date.now()}.${ext}`;
    const {error} = await supabase.storage.from("post-media").upload(path,file,{upsert:true});
    if(error){setUploadingAvatar(false);return;}
    const {data} = supabase.storage.from("post-media").getPublicUrl(path);
    await supabase.from("profiles").update({avatar_url:data.publicUrl}).eq("id",user.id);
    onUpdateProfile({...profile,avatar_url:data.publicUrl});
    setUploadingAvatar(false);
  };

  const displayPosts = activeTab==="posts"?userPosts.filter(p=>p.media_url):savedPosts.filter(p=>p?.media_url);

  const FollowModal = ({list, title}) => (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:300,display:"flex",flexDirection:"column",backdropFilter:"blur(10px)"}}>
      <div style={{background:"#0d0d2b",flex:1,overflowY:"auto",borderRadius:"24px 24px 0 0",marginTop:80}}>
        <div style={{padding:"16px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid rgba(99,102,241,0.15)",position:"sticky",top:0,background:"rgba(13,13,43,0.95)"}}>
          <button onClick={()=>setShowFollowModal(null)} style={{background:"rgba(99,102,241,0.15)",border:"none",cursor:"pointer",color:"#818CF8",width:36,height:36,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <div style={{color:"#F1F5F9",fontWeight:700,fontSize:16}}>{title}</div>
        </div>
        {list.length===0&&<div style={{textAlign:"center",color:"rgba(148,163,184,0.3)",padding:40}}>Henüz kimse yok</div>}
        {list.map((item,i)=>{
          const u = item.profiles;
          if(!u) return null;
          return (
            <div key={i} style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:14,borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <Avatar name={u.username} url={u.avatar_url} size={48}/>
              <div>
                <div style={{color:"#F1F5F9",fontWeight:700}}>{u.username}</div>
                {u.bio&&<div style={{color:"rgba(148,163,184,0.5)",fontSize:12}}>{u.bio}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{flex:1,overflowY:"auto",background:"linear-gradient(180deg,#0d0d2b,#0a0a1a)"}}>
      {showFollowModal==="followers"&&<FollowModal list={followers} title={`Takipçiler (${followers.length})`}/>}
      {showFollowModal==="following"&&<FollowModal list={following} title={`Takip Edilenler (${following.length})`}/>}
      <div style={{padding:"24px 20px 16px",display:"flex",flexDirection:"column",alignItems:"center",borderBottom:"1px solid rgba(99,102,241,0.15)"}}>
        <div style={{position:"relative",marginBottom:16}}>
          <Avatar name={profile?.username||"?"} url={profile?.avatar_url} size={96}/>
          <button onClick={()=>avatarRef.current.click()} style={{position:"absolute",bottom:0,right:0,width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#6366F1,#EC4899)",border:"2px solid #0a0a1a",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>
            {uploadingAvatar?"⏳":"📷"}
          </button>
          <input ref={avatarRef} type="file" accept="image/*" onChange={uploadAvatar} style={{display:"none"}}/>
        </div>
        {editing?(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,width:"100%"}}>
            <input value={newUsername} onChange={e=>setNewUsername(e.target.value)} placeholder="Kullanıcı adı" style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(99,102,241,0.3)",borderRadius:12,padding:"10px 16px",color:"#F1F5F9",fontSize:15,outline:"none",fontFamily:"inherit",textAlign:"center",width:"80%",boxSizing:"border-box"}}/>
            <textarea value={newBio} onChange={e=>setNewBio(e.target.value)} placeholder="Hakkında (bio)..." rows={2} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(99,102,241,0.3)",borderRadius:12,padding:"10px 16px",color:"#F1F5F9",fontSize:13,outline:"none",fontFamily:"inherit",width:"80%",boxSizing:"border-box",resize:"none"}}/>
            {error&&<div style={{color:"#F87171",fontSize:12}}>{error}</div>}
            <div style={{display:"flex",gap:8}}>
              <button onClick={saveProfile} disabled={saving} style={{padding:"8px 20px",borderRadius:12,background:"linear-gradient(135deg,#6366F1,#EC4899)",border:"none",color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{saving?"⏳":"Kaydet"}</button>
              <button onClick={()=>setEditing(false)} style={{padding:"8px 20px",borderRadius:12,background:"rgba(255,255,255,0.06)",border:"none",color:"#F1F5F9",cursor:"pointer",fontFamily:"inherit"}}>İptal</button>
            </div>
          </div>
        ):(
          <>
            <div style={{color:"#F1F5F9",fontSize:22,fontWeight:800}}>{profile?.username||"Kullanıcı"}</div>
            <div style={{color:"rgba(129,140,248,0.5)",fontSize:13,marginTop:3}}>{user?.email}</div>
            {profile?.bio&&<div style={{color:"rgba(148,163,184,0.65)",fontSize:13,marginTop:8,textAlign:"center",maxWidth:280,lineHeight:1.5}}>{profile.bio}</div>}
            <button onClick={()=>setEditing(true)} style={{marginTop:10,padding:"7px 20px",borderRadius:20,background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.25)",color:"#818CF8",fontWeight:600,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Profili Düzenle</button>
          </>
        )}
        <div style={{display:"flex",gap:28,marginTop:20}}>
          <div style={{textAlign:"center"}}>
            <div style={{color:"#F1F5F9",fontSize:20,fontWeight:800}}>{userPosts.length}</div>
            <div style={{color:"rgba(129,140,248,0.5)",fontSize:12}}>Gönderi</div>
          </div>
          <button onClick={()=>setShowFollowModal("followers")} style={{textAlign:"center",background:"none",border:"none",cursor:"pointer"}}>
            <div style={{color:"#F1F5F9",fontSize:20,fontWeight:800}}>{followers.length}</div>
            <div style={{color:"rgba(129,140,248,0.5)",fontSize:12}}>Takipçi</div>
          </button>
          <button onClick={()=>setShowFollowModal("following")} style={{textAlign:"center",background:"none",border:"none",cursor:"pointer"}}>
            <div style={{color:"#F1F5F9",fontSize:20,fontWeight:800}}>{following.length}</div>
            <div style={{color:"rgba(129,140,248,0.5)",fontSize:12}}>Takip</div>
          </button>
        </div>
        <button onClick={onLogout} style={{marginTop:16,padding:"9px 28px",borderRadius:20,background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",color:"#F87171",fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>Çıkış Yap</button>
      </div>
      <div style={{display:"flex",borderBottom:"1px solid rgba(99,102,241,0.12)"}}>
        {[["posts","📷 Gönderiler"],["saved","🔖 Kaydedilenler"]].map(([id,label])=>(
          <button key={id} onClick={()=>setActiveTab(id)} style={{flex:1,padding:"12px",background:"none",border:"none",borderBottom:activeTab===id?"2px solid #818CF8":"2px solid transparent",color:activeTab===id?"#818CF8":"rgba(148,163,184,0.35)",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>{label}</button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:2,padding:2}}>
        {displayPosts.map(post=>(
          <div key={post.id} style={{aspectRatio:"1",overflow:"hidden"}}>
            {post.media_type==="video"?<video src={post.media_url} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<img src={post.media_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
          </div>
        ))}
        {displayPosts.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",color:"rgba(148,163,184,0.3)",padding:40,fontSize:14}}>{activeTab==="saved"?"Kaydedilen gönderi yok 🔖":"Henüz medya paylaşımı yok 🌀"}</div>}
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
  const [viewingProfile, setViewingProfile] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user){setUser(session.user);loadProfile(session.user.id);}
      else setLoading(false);
    });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_,session)=>{
      if(session?.user){setUser(session.user);loadProfile(session.user.id);}
      else{setUser(null);setProfile(null);setLoading(false);}
    });
    return ()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{
    if (!user) return;
    const ch = supabase.channel("app_unread")
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"messages"},(payload)=>{
        if(payload.new.receiver_id===user.id&&activeTab!=="messages") setUnreadMessages(p=>p+1);
      }).subscribe();
    return ()=>supabase.removeChannel(ch);
  },[user,activeTab]);

  const loadProfile = async (userId)=>{
    try {
      const [{data:prof},{data:all}] = await Promise.all([
        supabase.from("profiles").select("*").eq("id",userId).single(),
        supabase.from("profiles").select("*")
      ]);
      setProfile(prof);
      if(all) setAllProfiles(all);
    } finally { setLoading(false); }
  };

  const handleProfileClick = (profileData)=>{
    if(!profileData) return;
    const full = allProfiles.find(p=>p.username===profileData.username)||profileData;
    setViewingProfile(full);
  };

  const tabs = [
    {id:"messages",label:"Mesajlar",icon:<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>},
    {id:"kesfet",label:"Keşfet",icon:<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>},
    {id:"feed",label:"Akış",icon:<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>},
    {id:"profile",label:"Profil",icon:<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>},
  ];

  if (loading) return (
    <div style={{background:"linear-gradient(160deg,#0a0a1a 0%,#0d0d2b 50%,#0a0a1a 100%)",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:20}}>
      <style>{`@keyframes glow{0%,100%{transform:scale(1);box-shadow:0 0 50px rgba(99,102,241,0.5),0 0 100px rgba(236,72,153,0.2)}50%{transform:scale(1.06);box-shadow:0 0 70px rgba(99,102,241,0.8),0 0 140px rgba(236,72,153,0.4)}}`}</style>
      <img src={LOGO} style={{width:96,height:96,borderRadius:24,objectFit:"cover",animation:"glow 2s ease-in-out infinite"}} alt=""/>
      <div style={{color:"rgba(148,163,184,0.5)",fontSize:13,letterSpacing:1}}>Yükleniyor...</div>
    </div>
  );

  return (
    <div style={{fontFamily:"'Sora',sans-serif",background:"#0a0a1a",minHeight:"100vh",display:"flex",justifyContent:"center"}}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;}::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:rgba(99,102,241,0.25);border-radius:4px;}`}</style>
      <div style={{width:"100%",maxWidth:430,height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"48px 18px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(10,10,26,0.92)",backdropFilter:"blur(24px)",borderBottom:"1px solid rgba(99,102,241,0.1)",zIndex:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <img src={LOGO} style={{width:32,height:32,borderRadius:9,objectFit:"cover",boxShadow:"0 0 12px rgba(99,102,241,0.5)"}} alt=""/>
            <div style={{fontSize:19,fontWeight:900,letterSpacing:-0.5,background:"linear-gradient(90deg,#60A5FA,#A78BFA,#F472B6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>AURA SC</div>
          </div>
          {profile&&(
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{color:"rgba(129,140,248,0.65)",fontSize:13,fontWeight:600}}>{profile.username}</div>
              <Avatar name={profile.username} url={profile.avatar_url} size={30}/>
            </div>
          )}
        </div>

        {!user?<AuthScreen onAuth={u=>{setUser(u);loadProfile(u.id);}}/>:(
          <>
            {viewingProfile&&<UserProfileModal targetUser={viewingProfile} currentUser={user} onClose={()=>setViewingProfile(null)}/>}
            {activeTab==="messages"&&<MessagesScreen user={user} allProfiles={allProfiles}/>}
            {activeTab==="kesfet"&&<KesfetScreen user={user} allProfiles={allProfiles} onProfileClick={handleProfileClick}/>}
            {activeTab==="feed"&&<FeedScreen user={user} profile={profile} onProfileClick={handleProfileClick}/>}
            {activeTab==="profile"&&<ProfileScreen user={user} profile={profile} onLogout={()=>{supabase.auth.signOut();setUser(null);setProfile(null);}} onUpdateProfile={p=>{setProfile(p);setAllProfiles(prev=>prev.map(u=>u.id===p.id?p:u));}}/>}
            <div style={{padding:"8px 4px 32px",display:"flex",justifyContent:"space-around",background:"rgba(10,10,26,0.95)",backdropFilter:"blur(24px)",borderTop:"1px solid rgba(99,102,241,0.1)",zIndex:10}}>
              {tabs.map(tab=>{
                const active = activeTab===tab.id;
                return (
                  <button key={tab.id} onClick={()=>{setActiveTab(tab.id);if(tab.id==="messages")setUnreadMessages(0);}} style={{background:active?"rgba(99,102,241,0.14)":"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,color:active?"#818CF8":"rgba(148,163,184,0.28)",padding:"8px 14px",borderRadius:14,position:"relative"}}>
                    {tab.icon}
                    <span style={{fontSize:9,fontWeight:active?700:500}}>{tab.label}</span>
                    {tab.id==="messages"&&unreadMessages>0&&<div style={{position:"absolute",top:4,right:8,background:"#EC4899",borderRadius:"50%",minWidth:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:700,padding:"0 3px"}}>{unreadMessages}</div>}
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
