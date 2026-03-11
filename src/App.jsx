import React, { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import { 
  Home, Search, MessageSquare, User, 
  Send, Heart, Repeat, MessageCircle, 
  X as CloseIcon, Share2, Bookmark 
} from "lucide-react";

const App = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null); // Insta Modal için

  // Kullanıcı oturumunu kontrol et
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user || null);
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20 selection:bg-blue-500/30">
      
      {/* ÜST BAR */}
      <header className="sticky top-0 bg-black/60 backdrop-blur-xl border-b border-white/10 p-4 z-40 flex justify-between items-center">
        <h1 className="text-xl font-black tracking-tighter uppercase italic text-blue-500">
          OS-X App
        </h1>
        {currentUser && <div className="text-xs text-gray-500">@{currentUser.email.split('@')[0]}</div>}
      </header>

      {/* ANA İÇERİK */}
      <main className="max-w-xl mx-auto">
        {activeTab === "feed" && <TwitterFeed />}
        {activeTab === "explore" && <InstagramExplore onSelect={setSelectedMedia} />}
        {activeTab === "chat" && <WhatsAppChat currentUser={currentUser} />}
        {activeTab === "profile" && <UnifiedProfile currentUser={currentUser} />}
      </main>

      {/* INSTAGRAM TARZI DETAY MODALI */}
      {selectedMedia && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 animate-in fade-in zoom-in duration-200">
          <button 
            onClick={() => setSelectedMedia(null)}
            className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
          >
            <CloseIcon size={24} />
          </button>
          <div className="max-w-md w-full bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl">
            <img src={selectedMedia.url} className="w-full aspect-square object-cover" alt="Detail" />
            <div className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <Heart size={24} className="hover:text-red-500 cursor-pointer" />
                  <MessageCircle size={24} className="hover:text-blue-500 cursor-pointer" />
                  <Share2 size={24} className="hover:text-green-500 cursor-pointer" />
                </div>
                <Bookmark size={24} />
              </div>
              <p className="text-sm"><span className="font-bold">keşfet_kullanıcısı</span> Harika bir an! 📸 #vibe</p>
            </div>
          </div>
        </div>
      )}

      {/* ALT NAVİGASYON (MOBİL APK DÜZENİ) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-white/5 flex justify-around items-center h-16 z-50">
        <NavBtn icon={<Home size={26}/>} active={activeTab === "feed"} onClick={() => setActiveTab("feed")} />
        <NavBtn icon={<Search size={26}/>} active={activeTab === "explore"} onClick={() => setActiveTab("explore")} />
        <NavBtn icon={<MessageSquare size={26}/>} active={activeTab === "chat"} onClick={() => setActiveTab("chat")} color="text-green-500" />
        <NavBtn icon={<User size={26}/>} active={activeTab === "profile"} onClick={() => setActiveTab("profile")} color="text-purple-500" />
      </nav>
    </div>
  );
};

// --- YARDIMCI BİLEŞENLER ---

const NavBtn = ({ icon, active, onClick, color = "text-blue-500" }) => (
  <button onClick={onClick} className={`transition-all duration-300 ${active ? color + " scale-110" : "text-gray-500"}`}>
    {icon}
  </button>
);

// --- 1. X AKIŞI ---
const TwitterFeed = () => (
  <div className="divide-y divide-white/5">
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} className="p-4 flex gap-4 hover:bg-white/[0.02] cursor-pointer">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <span className="font-bold hover:underline">Geliştirici</span>
            <span className="text-gray-500 text-sm">@dev_user · 2sa</span>
          </div>
          <p className="text-[15px] mt-1 text-gray-200">
            X akışı, Instagram keşfet ve WhatsApp mesajlaşma tek bir uygulamada! Kodlar GitHub'a yüklenmeye hazır. 🚀 #react #supabase #future
          </p>
          <div className="flex justify-between mt-3 text-gray-500 max-w-sm">
            <span className="flex items-center gap-2 text-sm hover:text-blue-500"><MessageCircle size={18}/> 4</span>
            <span className="flex items-center gap-2 text-sm hover:text-green-500"><Repeat size={18}/> 12</span>
            <span className="flex items-center gap-2 text-sm hover:text-red-500"><Heart size={18}/> 89</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// --- 2. INSTAGRAM KEŞFET ---
const InstagramExplore = ({ onSelect }) => (
  <div className="grid grid-cols-3 gap-0.5">
    {[...Array(18)].map((_, i) => (
      <div 
        key={i} 
        onClick={() => onSelect({ id: i, url: `https://picsum.photos/600/600?random=${i}` })}
        className="aspect-square relative group cursor-pointer overflow-hidden"
      >
        <img src={`https://picsum.photos/400/400?random=${i}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Heart fill="white" size={20} />
        </div>
      </div>
    ))}
  </div>
);

// --- 3. WHATSAPP REALTIME MESAJLAŞMA ---
const WhatsAppChat = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    // 1. Mevcut mesajları çek
    const fetchMessages = async () => {
      const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: true });
      setMessages(data || []);
    };
    fetchMessages();

    // 2. REALTIME: Yeni mesajları dinle
    const channel = supabase.channel("realtime-messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, payload => {
        setMessages(prev => [...prev, payload.new]);
      }).subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !currentUser) return;
    
    await supabase.from("messages").insert([{ 
      content: text, 
      user_id: currentUser.id,
      user_email: currentUser.email 
    }]);
    setText("");
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-[#0b141a]">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, idx) => (
          <div key={idx} className={`max-w-[75%] p-3 rounded-xl text-sm ${m.user_id === currentUser?.id ? "bg-[#005c4b] ml-auto rounded-tr-none" : "bg-[#202c33] rounded-tl-none"}`}>
            <div className="text-[10px] text-gray-400 mb-1">{m.user_email}</div>
            {m.content}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      <form onSubmit={sendMessage} className="p-3 bg-[#202c33] flex gap-2">
        <input 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Mesaj yazın..."
          className="flex-1 bg-[#2a3942] border-none rounded-full px-4 py-2 focus:ring-0 text-white placeholder-gray-500"
        />
        <button type="submit" className="bg-[#00a884] p-3 rounded-full text-black hover:scale-105 transition">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

// --- 4. PROFİL ---
const UnifiedProfile = ({ currentUser }) => {
  const [mode, setMode] = useState("x");
  return (
    <div>
      <div className="p-6 flex flex-col items-center border-b border-white/10">
        <div className="w-24 h-24 rounded-full bg-gray-800 border-4 border-blue-500/20 mb-4" />
        <h2 className="text-xl font-bold">{currentUser?.email?.split('@')[0] || "Misafir"}</h2>
        <button className="mt-4 px-6 py-1.5 border border-white/20 rounded-full text-sm font-semibold hover:bg-white/5 transition">Profili Düzenle</button>
      </div>
      <div className="flex text-center border-b border-white/10">
        <div onClick={() => setMode("x")} className={`flex-1 py-3 cursor-pointer ${mode === "x" ? "border-b-2 border-blue-500 text-white" : "text-gray-500"}`}>Gönderiler</div>
        <div onClick={() => setMode("insta")} className={`flex-1 py-3 cursor-pointer ${mode === "insta" ? "border-b-2 border-blue-500 text-white" : "text-gray-500"}`}>Galeri</div>
      </div>
      {mode === "x" ? <TwitterFeed /> : <InstagramExplore onSelect={() => {}} />}
    </div>
  );
};

export default App;
