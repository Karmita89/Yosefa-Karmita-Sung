import React, { useState, useEffect } from 'react';
import { User, AttendanceRecord } from '../types';
import { AttendanceForm } from './AttendanceForm';
import { HistoryList } from './HistoryList';
import { Button } from './Button';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [showForm, setShowForm] = useState(false);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  // Load mock data on mount
  useEffect(() => {
    // In a real app, fetch from API
    const mockData: AttendanceRecord[] = [
      {
        id: '1',
        userId: user.id,
        type: 'CHECK_IN',
        timestamp: Date.now() - 86400000,
        location: { lat: -7.98, lng: 112.63 }
      }
    ] as any;
    setRecords(mockData);
  }, [user.id]);

  const handleNewRecord = (record: AttendanceRecord) => {
    setRecords([record, ...records]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <header className="bg-white sticky top-0 z-30 shadow-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             {user.photoUrl ? (
               <img src={user.photoUrl} alt={user.name} className="w-10 h-10 rounded-full border border-gray-200" />
             ) : (
               <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-700 font-bold text-sm">
                 {user.name.charAt(0)}
               </div>
             )}
             <div>
               <h1 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">{user.name}</h1>
               <p className="text-xs text-gray-500">Kelompok 34 - Sidorahayu</p>
             </div>
          </div>
          <button onClick={onLogout} className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-gray-100 rounded-lg">
            <span className="material-icons-round">logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Stats Cards - Responsive Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 max-w-6xl mx-auto">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-xs sm:text-sm text-gray-500 mb-2">Total Kehadiran</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{records.length} <span className="text-sm sm:text-base font-normal text-gray-400">Kali</span></p>
          </div>
          <div className="bg-gradient-to-br from-red-600 to-red-700 p-4 sm:p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-shadow">
            <p className="text-xs sm:text-sm text-red-100 mb-2">Status Hari Ini</p>
            <p className="text-lg sm:text-2xl font-bold">
              {records.some(r => new Date(r.timestamp).toDateString() === new Date().toDateString()) 
                ? 'Sudah Absen' 
                : 'Belum Absen'}
            </p>
          </div>
        </div>

        {/* Action Button */}
        {!showForm && (
          <div className="max-w-6xl mx-auto mb-8">
            <Button 
              onClick={() => setShowForm(true)} 
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 shadow-md text-base sm:text-lg"
              icon="add_circle"
            >
              Isi Absensi / Laporan
            </Button>
          </div>
        )}

        {/* Form Overlay */}
        {showForm && (
          <div className="max-w-6xl mx-auto mb-8">
            <AttendanceForm 
              userId={user.id} 
              onSubmit={handleNewRecord} 
              onCancel={() => setShowForm(false)} 
            />
          </div>
        )}

        {/* History Section */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="material-icons-round text-gray-400">history</span>
            Riwayat Aktivitas
          </h3>
          <HistoryList records={records} />
        </div>
      </div>
    </div>
  );
};