import React, { useState, useCallback } from 'react';
import { ActivityType, AttendanceRecord } from '../types';
import { Button } from './Button';


interface AttendanceFormProps {
  userId: string;
  onSubmit: (record: AttendanceRecord) => void;
  onCancel: () => void;
}

export const AttendanceForm: React.FC<AttendanceFormProps> = ({ userId, onSubmit, onCancel }) => {
  const [type, setType] = useState<ActivityType>(ActivityType.CHECK_IN);
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [locationState, setLocationState] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const handleGetLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationState({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Gagal mengambil lokasi. Pastikan GPS aktif.");
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
      alert("Geolocation tidak didukung browser ini.");
    }
  };

  const handleAiGenerate = async () => {
    if (!notes.trim()) {
      alert("Masukkan poin kegiatan terlebih dahulu!");
      return;
    }
    setIsAiLoading(true);
    try {
      const generated = await generateReportDraft(notes);
      setDescription(generated);
    } catch (e) {
      alert("Gagal menggunakan AI. Silakan tulis manual.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      userId,
      type,
      timestamp: Date.now(),
      description: type === ActivityType.DAILY_REPORT ? description : undefined,
      location: locationState || undefined,
      aiGeneratedSummary: !!description && type === ActivityType.DAILY_REPORT
    };
    onSubmit(newRecord);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Form Kegiatan</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors">
          <span className="material-icons-round">close</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Jenis Absensi</label>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { id: ActivityType.CHECK_IN, label: 'Masuk', icon: 'login' },
              { id: ActivityType.CHECK_OUT, label: 'Pulang', icon: 'logout' },
              { id: ActivityType.DAILY_REPORT, label: 'Laporan', icon: 'article' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setType(opt.id)}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg border transition-all ${
                  type === opt.id 
                    ? 'bg-red-50 border-red-500 text-red-700' 
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
              >
                <span className="material-icons-round mb-1 text-lg sm:text-xl">{opt.icon}</span>
                <span className="text-xs sm:text-sm font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Location Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Lokasi</label>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleGetLocation} 
              isLoading={isLocating}
              icon="my_location"
              className="flex-1 text-sm sm:text-base py-2 sm:py-3"
            >
              {locationState ? 'Lokasi Terkunci' : 'Ambil Lokasi'}
            </Button>
          </div>
          {locationState && (
            <p className="text-xs text-green-600 mt-2 flex items-center">
              <span className="material-icons-round text-sm mr-1">check_circle</span>
              Lat: {locationState.lat.toFixed(6)}, Lng: {locationState.lng.toFixed(6)}
            </p>
          )}
        </div>

        {/* Daily Report Specific Fields */}
        {type === ActivityType.DAILY_REPORT && (
          <div className="space-y-4 border-t pt-6 border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poin Kegiatan (untuk AI Assistant)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Rapat di balai desa, mengajar ngaji sore hari, koordinasi proker sampah..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm h-24 resize-none"
              />
              <div className="flex justify-end mt-3">
                 <Button 
                   type="button" 
                   variant="ghost" 
                   onClick={handleAiGenerate} 
                   disabled={!notes || isAiLoading}
                   className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 text-xs sm:text-sm px-3 sm:px-4 py-2"
                   icon="auto_awesome"
                   isLoading={isAiLoading}
                 >
                   Buat Laporan dengan AI
                 </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hasil Laporan
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Hasil laporan akan muncul di sini..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all h-32"
              />
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1 py-2 sm:py-3">
            Batal
          </Button>
          <Button type="submit" className="flex-1 py-2 sm:py-3" icon="send">
            Kirim
          </Button>
        </div>
      </form>
    </div>
  );
};
