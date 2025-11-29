import { GoogleGenAI } from "@google/genai";

// Ideally, this comes from a secure backend or injected env in a real deployment.
// For this frontend-only demo, we assume it's available in process.env.
const API_KEY = process.env.API_KEY || '';

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const generateReportDraft = async (bulletPoints: string): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key is missing. Returning mock response.");
    // Fallback for demo purposes if no key is present
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`[DEMO - AI MISSING] Berikut adalah draf laporan formal berdasarkan poin Anda:\n\nPada hari ini, mahasiswa melaksanakan kegiatan: ${bulletPoints}. Kegiatan berjalan dengan lancar di Desa Sidorahayu bersama warga setempat.`);
      }, 1500);
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Anda adalah asisten administrasi untuk mahasiswa KKN (Kuliah Kerja Nyata).
        Tugas anda adalah mengubah catatan poin-poin kegiatan mentah menjadi satu paragraf laporan kegiatan harian yang formal, rapi, dan profesional dalam Bahasa Indonesia.
        
        Konteks:
        - Lokasi: Desa Sidorahayu
        - Kegiatan: KKN Universitas Merdeka Malang Kelompok 34
        
        Catatan Mentah: "${bulletPoints}"
        
        Output: Hanya satu paragraf teks laporan formal. Jangan tambahkan pembuka atau penutup lain.
      `,
    });
    
    return response.text || "Gagal menghasilkan laporan.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Gagal menghubungi layanan AI.");
  }
};