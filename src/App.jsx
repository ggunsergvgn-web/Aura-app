import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://hebljdvucansszxhvnfp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlYmxqZHZ1Y2Fuc3N6eGh2bmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwOTQ1MTQsImV4cCI6MjA4ODY3MDUxNH0.nS3J8Z7bNano_z7jdFmIhtmYrOc6HC2FpmBPrtcPZhI"
);

function App() {
  const [baglantiDurumu, setBaglantiDurumu] = useState("Bağlantı kontrol ediliyor...");

  useEffect(() => {
    async function testBaglanti() {
      try {
        const { error } = await supabase.from("test").select("*").limit(1);
        if (error && error.message.includes("relation")) {
          setBaglantiDurumu("✅ Supabase bağlantısı başarılı! (Tablo henüz yok)");
        } else {
          setBaglantiDurumu("✅ Supabase bağlantısı başarılı!");
        }
      } catch (hata) {
        setBaglantiDurumu("❌ Bağlantı hatası: " + hata.message);
      }
    }
    testBaglanti();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>AURA Uygulaması</h1>
      <h2>{baglantiDurumu}</h2>
    </div>
  );
}

export default App;
