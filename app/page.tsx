// app/page.tsx

import { createServerClient } from '@/utils/supabase/server';
import { BookOpenText, Tag, CalendarDays } from 'lucide-react'; // Opsional, untuk ikon

// Font bergaya klasik (alternatif Google Font)
const skyrimFont = "font-serif"; 

export default async function Page() {
  const supabase = createServerClient();
  
  // Mengambil data, diurutkan dari yang terbaru disimpan
  const { data: bookmarks, error } = await supabase
    .from('bookmarks')
    .select('*').returns<any[]>()
    .order('created_at', { ascending: false });

  // Tampilan jika terjadi kesalahan koneksi
  if (error) {
    return (
      <main className="min-h-screen bg-[#1a1c23] p-8 text-[#c4b5a3]">
        <h1 className={`${skyrimFont} text-4xl font-bold mb-4 text-[#e2d5c5]`}>
          Gangguan pada Jaringan Guild
        </h1>
        <p className="text-red-400 bg-red-950 p-4 border border-red-700 rounded-md">
          Gagal menghubungi Supabase: {error.message}
        </p>
      </main>
    );
  }

  return (
    // Latar belakang gelap seperti batu gua (stone-slate)
    <main className={`min-h-screen bg-[#1a1c23] p-6 md:p-12 ${skyrimFont} text-[#c4b5a3]`}>
      
      {/* Header Utama dengan garis pemisah khas */}
      <header className="border-b-2 border-[#3a3f4b] pb-8 mb-12">
        <h1 className="text-5xl font-black text-[#e2d5c5] tracking-tight">
          Dragonborn's Compendium
        </h1>
        <p className="mt-3 text-xl text-[#94a3b8] italic">
          Kumpulan pengetahuan berharga yang berhasil dikumpulkan dari penjuru Skyrim.
        </p>
      </header>
      
      {/* Grid Kartu Artikel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {bookmarks?.map((item) => (
          
          // Kartu seperti perkamen tua (parchment) dengan border besi
          <div key={item.id} className="bg-[#2d323e] p-7 border-2 border-[#4a5162] hover:border-[#7c86a1] transition-all group shadow-2xl relative overflow-hidden">
            
            {/* Aksen sudut kartu kuno (opsional, via pseudo-element) */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#7c86a1] group-hover:border-[#e2d5c5]"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#7c86a1] group-hover:border-[#e2d5c5]"></div>
            
            {/* Baris Atas: Kategori & Tanggal */}
            <div className="flex items-center justify-between text-sm mb-5 text-[#94a3b8]">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#1a1c23] border border-[#4a5162] rounded-sm text-[#e2d5c5] uppercase font-bold tracking-wider text-xs">
                <Tag className="w-4 h-4" />
                {item.category}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4" />
                {new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>

            {/* Judul Besar & Megah */}
            <h2 className="text-2xl font-bold text-[#e2d5c5] leading-snug mb-5 group-hover:text-white transition-colors">
              {item.title}
            </h2>
            
            {/* Ringkasan dengan efek teks memudar (fade) */}
            <div className="relative text-[#b4a593] leading-relaxed text-base space-y-3">
              <BookOpenText className="w-16 h-16 absolute -bottom-4 -right-4 opacity-5 text-[#4a5162]" />
              <p className="line-clamp-8">
                {item.summary}
              </p>
              {/* Efek gradien memudar jika teks terlalu panjang */}
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-[#2d323e] to-transparent"></div>
            </div>
            {/* TAUTAN SUMBER (URL) - Tambahkan bagian ini */}
            {item.url && (
            <div className="mt-6 pt-4 border-t border-[#4a5162] flex justify-end">
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-[0.2em] text-[#e2d5c5] hover:text-white transition-colors flex items-center gap-2 group"
             >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">▶</span>
              Buka Sumber Pengetahuan
             <span className="opacity-0 group-hover:opacity-100 transition-opacity">◀</span>
            </a>
             </div>
)}
          </div>
        ))}

      </div>
    </main>
  );
}