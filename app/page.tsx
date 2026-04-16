"use client";

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sword,
  Ghost,
  Search,
  Coins,
  Weight,
  Loader2,
  ChevronRight,
  MapPin,
  ExternalLink,
  Shield,
  Sun,
  Moon,
  Wind
} from 'lucide-react';

// Tipografi yang lebih bersih dan bersahabat
const mainFont = "font-sans"; // Untuk keterbacaan tinggi
const titleFont = "font-serif"; // Untuk estetika Elden Ring

export default function App() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [location, setLocation] = useState<string>("Melacak Anugerah..."); 
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"night" | "day">("night");

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Geolocation API dengan penanganan yang lebih bersahabat
    const fetchLocation = () => {
      if (typeof window !== "undefined" && "geolocation" in navigator) {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`, {
                headers: { 'Accept-Language': 'id' }
              });
              
              if (!res.ok) throw new Error("Gagal mengambil data lokasi");
              
              const data = await res.json();
              const area = data.address.city || data.address.state || "The Lands Between";
              const region = data.address.country || "Elden Realm";
              setLocation(`${area}, ${region}`);
            } catch (err) {
              setLocation("The Lands Between");
            } finally {
              setIsLocating(false);
            }
          },
          () => {
            setLocation("Limgrave, Borderlands");
            setIsLocating(false);
          },
          { timeout: 8000 }
        );
      } else {
        setLocation("Unknown Realm");
      }
    };

    async function fetchArtifacts() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            setBookmarks([
                { id: 1, title: "Great Rune of Morgott", category: "Great Rune", summary: "Rune besar yang memberikan peningkatan besar pada HP maksimal. Milik raja terakhir Leyndell.", created_at: new Date().toISOString() },
                { id: 2, title: "Moonlight Alter", category: "Legendary Weapon", summary: "Pedang legendaris yang diberikan oleh garis keturunan Carian untuk pasangan mereka.", created_at: new Date().toISOString() },
                { id: 3, title: "Malenia's Winged Helm", category: "Armor", summary: "Helm yang dikenakan oleh Malenia, Blade of Miquella. Simbol kemauan yang tak tergoyahkan.", created_at: new Date().toISOString() },
                { id: 4, title: "Flask of Wondrous Physick", category: "Tool", summary: "Ramuan yang bisa dicampur dengan berbagai kristal untuk memberikan efek khusus saat diminum.", created_at: new Date().toISOString() }
            ]);
            setLoading(false);
            return;
        }

        const response = await fetch(
          `${supabaseUrl}/rest/v1/bookmarks?select=*&order=created_at.desc`,
          {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) throw new Error("Gagal mengambil data.");
        const data = await response.json();
        setBookmarks(data);
      } catch (err: any) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchArtifacts();
    fetchLocation();
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === "night" ? "day" : "night");
  };

  const categories = ["All", ...new Set(bookmarks?.map(b => b.category))];
  const filteredBookmarks = bookmarks.filter(b => {
    const matchesCategory = selectedCategory === "All" || b.category === selectedCategory;
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isNight = theme === "night";

  if (loading) {
    return (
      <main className={`min-h-screen flex flex-col items-center justify-center p-8 transition-colors duration-1000 ${isNight ? 'bg-[#0a0a0a] text-[#d4ad6a]' : 'bg-[#fdfcf8] text-[#a67c00]'}`}>
        <div className="relative">
            <Loader2 className={`w-20 h-20 animate-spin opacity-30 ${isNight ? 'text-[#d4ad6a]' : 'text-[#a67c00]'}`} />
            <Sun className={`w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse ${isNight ? 'text-[#f5d491]' : 'text-[#e6b800]'}`} />
        </div>
        <p className={`${titleFont} mt-10 italic tracking-[0.8em] uppercase text-[12px] animate-pulse`}>Membangkitkan Grace...</p>
      </main>
    );
  }

  return (
    <main className={`min-h-screen transition-colors duration-1000 ${isNight ? 'bg-[#050505] text-[#d1d1d1]' : 'bg-[#faf7f2] text-[#4a4a4a]'} ${mainFont} selection:bg-[#d4ad6a] selection:text-black overflow-x-hidden relative scroll-smooth`}>
      
      {/* Animasi Kustom */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes goldDust { 0% { opacity: 0; transform: translateY(0); } 50% { opacity: 0.5; } 100% { opacity: 0; transform: translateY(-100px); } }
        @keyframes shine { 0% { filter: brightness(1); } 50% { filter: brightness(1.5) drop-shadow(0 0 10px #d4ad6a); } 100% { filter: brightness(1); } }
        .animate-grace { animation: shine 3s infinite ease-in-out; }
      `}} />

      {/* Background Atmosferik: Erdtree Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${isNight ? 'bg-[radial-gradient(circle_at_50%_0%,rgba(212,173,106,0.08)_0%,transparent_60%)] opacity-100' : 'bg-[radial-gradient(circle_at_50%_0%,rgba(230,184,0,0.05)_0%,transparent_60%)] opacity-100'}`}></div>
         <div className={`absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] ${isNight ? 'invert-0' : 'invert'}`}></div>
      </div>

      {/* Navigasi / HUD */}
      <nav className={`sticky top-0 z-50 transition-all duration-700 border-b ${isNight ? 'bg-[#050505]/95 border-[#d4ad6a]/10' : 'bg-[#faf7f2]/95 border-[#a67c00]/10'} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
             <div className={`w-10 h-10 border flex items-center justify-center transition-all duration-500 ${isNight ? 'border-[#d4ad6a]/30 group-hover:border-[#d4ad6a]' : 'border-[#a67c00]/30 group-hover:border-[#a67c00]'}`}>
                <Shield className={`w-5 h-5 animate-grace ${isNight ? 'text-[#d4ad6a]' : 'text-[#a67c00]'}`} />
             </div>
             <div>
                <h2 className={`${titleFont} text-[10px] font-bold uppercase tracking-[0.4em] leading-none mb-1 ${isNight ? 'text-[#8a7a5f]' : 'text-[#a09070]'}`}>Tarnished</h2>
                <p className={`${titleFont} text-[14px] font-bold uppercase tracking-[0.2em] ${isNight ? 'text-[#d4ad6a]' : 'text-[#a67c00]'}`}>Archive</p>
             </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
             {categories.map(cat => (
               <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 relative py-2 ${selectedCategory === cat ? (isNight ? 'text-[#f5d491]' : 'text-[#a67c00]') : 'text-[#666] hover:text-[#d4ad6a]'}`}
               >
                 {cat}
                 {selectedCategory === cat && (
                   <span className={`absolute -bottom-1 left-0 w-full h-px bg-linear-to-r from-transparent via-${isNight ? '[#d4ad6a]' : '[#a67c00]'} to-transparent`}></span>
                 )}
               </button>
             ))}
          </div>

          <div className="flex items-center gap-6">
             <button 
               onClick={toggleTheme}
               className={`p-2 rounded-full transition-all duration-500 hover:scale-110 ${isNight ? 'bg-[#d4ad6a]/10 text-[#d4ad6a]' : 'bg-[#a67c00]/10 text-[#a67c00]'}`}
               title={isNight ? "Beralih ke Siang" : "Beralih ke Malam"}
             >
                {isNight ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>
             <div className={`w-px h-8 mx-1 ${isNight ? 'bg-[#d4ad6a]/20' : 'bg-[#a67c00]/20'}`}></div>
             <div className="hidden sm:block text-right">
                <p className="text-[9px] uppercase tracking-widest text-[#666] font-bold">Waktu Dunia</p>
                <p className={`font-mono text-sm tracking-tighter ${isNight ? 'text-[#d4ad6a]' : 'text-[#a67c00]'}`}>{currentTime?.toLocaleTimeString('id-ID')}</p>
             </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        
        {/* Header Section */}
        <section className="mb-24 flex flex-col items-center text-center">
            <div className={`inline-flex items-center gap-3 mb-8 px-4 py-1.5 border rounded-sm transition-colors duration-1000 ${isNight ? 'border-[#d4ad6a]/20 bg-[#d4ad6a]/5' : 'border-[#a67c00]/20 bg-[#a67c00]/5'}`}>
                <span className={`text-[10px] font-bold uppercase tracking-[0.4em] animate-pulse ${isNight ? 'text-[#d4ad6a]' : 'text-[#a67c00]'}`}>Site of Grace Found</span>
            </div>
            
            <h1 className={`${titleFont} text-6xl md:text-[90px] font-black tracking-tight leading-tight uppercase italic mb-8 drop-shadow-lg transition-colors duration-1000 ${isNight ? 'text-[#f5d491]' : 'text-[#4a3a1a]'}`}>
              The Graceful <br className="hidden md:block" />
              <span className={`text-transparent bg-clip-text bg-linear-to-r ${isNight ? 'from-[#d4ad6a] to-[#8a7a5f]' : 'from-[#a67c00] to-[#5a4a2a]'}`}>Compendium</span>
            </h1>

            <p className="max-w-2xl text-[#8a8a8a] text-lg font-light leading-relaxed mb-12">
              Kumpulan arsip bagi mereka yang mencari kepingan pengetahuan. <br />
              <span className={`italic transition-colors duration-1000 ${isNight ? 'text-[#d4ad6a]/60' : 'text-[#a67c00]/60'}`}>"Arise now, ye Tarnished."</span>
            </p>

            <div className={`flex gap-12 border-y py-6 w-full justify-center transition-colors duration-1000 ${isNight ? 'border-[#d4ad6a]/10' : 'border-[#a67c00]/10'}`}>
                <div className="text-center">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[#666] mb-1">Rune Disimpan</p>
                    <p className={`${titleFont} text-3xl transition-colors duration-1000 ${isNight ? 'text-[#d4ad6a]' : 'text-[#a67c00]'}`}>{bookmarks.length}</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[#666] mb-1">Wilayah Ditemukan</p>
                    <p className={`${titleFont} text-3xl transition-colors duration-1000 ${isNight ? 'text-[#d4ad6a]' : 'text-[#a67c00]'}`}>{categories.length - 1}</p>
                </div>
            </div>
        </section>

        {/* Search Bar */}
        <div className="mb-24 max-w-2xl mx-auto">
            <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <Search className={`w-5 h-5 transition-colors ${isNight ? 'text-[#666] group-focus-within:text-[#d4ad6a]' : 'text-[#999] group-focus-within:text-[#a67c00]'}`} />
                </div>
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari item atau sihir..."
                    className={`w-full border rounded-full py-5 px-14 outline-none transition-all tracking-widest text-sm ${isNight ? 'bg-[#0d0d0d] border-[#d4ad6a]/20 text-[#d4ad6a] focus:border-[#d4ad6a] placeholder:text-[#333]' : 'bg-white border-[#a67c00]/20 text-[#4a3a1a] focus:border-[#a67c00] placeholder:text-[#ccc]'}`}
                />
            </div>
        </div>

        {/* Artifact List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {filteredBookmarks.map((item, i) => (
              <article 
                key={item.id} 
                className={`group relative border p-10 transition-all duration-700 hover:-translate-y-2 flex flex-col ${isNight ? 'bg-[#0d0d0d] border-[#d4ad6a]/5 hover:border-[#d4ad6a]/30 shadow-black' : 'bg-white border-[#a67c00]/5 hover:border-[#a67c00]/30 shadow-xl shadow-stone-200'}`}
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden opacity-10 pointer-events-none">
                    <div className={`absolute top-0 right-0 w-full h-full border-t-2 border-r-2 ${isNight ? 'border-[#d4ad6a]' : 'border-[#a67c00]'}`}></div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] border-b pb-1 ${isNight ? 'text-[#d4ad6a] border-[#d4ad6a]/30' : 'text-[#a67c00] border-[#a67c00]/30'}`}>
                        {item.category}
                    </span>
                    <div className={`h-px grow ${isNight ? 'bg-[#d4ad6a]/10' : 'bg-[#a67c00]/10'}`}></div>
                </div>

                <h3 className={`${titleFont} text-3xl font-bold uppercase tracking-wide mb-6 group-hover:translate-x-2 transition-all duration-500 ${isNight ? 'text-[#f5d491]' : 'text-[#4a3a1a]'}`}>
                    {item.title}
                </h3>

                <p className={`leading-relaxed text-[15px] font-light italic mb-10 transition-colors duration-1000 ${isNight ? 'text-[#a1a1a1]' : 'text-[#666]'}`}>
                    {item.summary}
                </p>

                <div className={`mt-auto flex items-center justify-between pt-6 border-t ${isNight ? 'border-[#d4ad6a]/10' : 'border-[#a67c00]/10'}`}>
                    <div className="flex gap-6">
                        <div className={`flex items-center gap-2 text-[10px] font-bold ${isNight ? 'text-[#8a7a5f]' : 'text-[#a09070]'}`}>
                            <Coins className="w-3.5 h-3.5" /> 12,500
                        </div>
                        <div className={`flex items-center gap-2 text-[10px] font-bold ${isNight ? 'text-[#8a7a5f]' : 'text-[#a09070]'}`}>
                            <Weight className="w-3.5 h-3.5" /> 8.0
                        </div>
                    </div>
                    
                    {item.url && (
                        <a 
                            href={item.url} 
                            target="_blank" 
                            className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all ${isNight ? 'text-[#d4ad6a]' : 'text-[#a67c00]'}`}
                        >
                            Detail <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                </div>
                
                {/* Shadow Glow Effect */}
                <div className={`absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-xl ${isNight ? 'bg-linear-to-b from-[#d4ad6a]/5 to-transparent' : 'bg-linear-to-b from-[#a67c00]/5 to-transparent'}`}></div>
              </article>
            ))}
        </div>
      </div>

      {/* Footer */}
      <footer className={`mt-40 pb-20 border-t transition-colors duration-1000 ${isNight ? 'border-[#d4ad6a]/10 bg-[#030303]' : 'border-[#a67c00]/10 bg-[#f5f2eb]'}`}>
            <div className="max-w-7xl mx-auto px-6 pt-20 flex flex-col md:flex-row justify-between gap-16">
                <div className="max-w-md">
                    <div className={`flex items-center gap-3 mb-6 ${isNight ? 'text-[#d4ad6a]' : 'text-[#a67c00]'}`}>
                        <Sun className={`w-5 h-5 animate-grace`} />
                        <span className={`${titleFont} text-[12px] font-bold uppercase tracking-[0.4em]`}>Greater Will</span>
                    </div>
                    <p className="text-sm text-[#666] leading-relaxed italic">
                        "Layangkan pandanganmu pada pohon cahaya, karena di sanalah takdirmu tertulis. Menjadi Elden Lord bukanlah sebuah pilihan, melainkan beban suci."
                    </p>
                </div>

                <div className="text-left md:text-right">
                    <div className={`flex flex-col items-start md:items-end gap-3 mb-10 ${isNight ? 'text-[#8a7a5f]' : 'text-[#a09070]'}`}>
                         <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]">
                             <MapPin className={`w-4 h-4 ${isLocating ? 'animate-bounce' : ''}`} /> 
                             {location}
                         </div>
                         <div className="text-[10px] text-[#666] tracking-[0.3em] font-mono">
                             SITE_TIME: {currentTime?.toLocaleTimeString('id-ID')}
                         </div>
                    </div>
                    
                    <div className="text-[10px] uppercase tracking-[0.3em] text-[#333] font-bold">
                        <p>© Tarnished Ledger — {new Date().getFullYear()}</p>
                        <p className={`mt-2 transition-colors duration-500 hover:text-[#d4ad6a] cursor-default ${isNight ? 'text-[#444]' : 'text-[#999]'}`}>
                            All Rights Reserved • from 積ん読 behaviour, made with ❤️ from Bisma Reza
                        </p>
                    </div>
                </div>
            </div>
      </footer>
    </main>
  );
}