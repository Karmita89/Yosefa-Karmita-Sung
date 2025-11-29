import React from 'react';
import { AttendanceRecord, ActivityType } from '../types';

interface HistoryListProps {
  records: AttendanceRecord[];
}

export const HistoryList: React.FC<HistoryListProps> = ({ records }) => {
  if (records.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
        <span className="material-icons-round text-4xl text-gray-300 mb-2">history_toggle_off</span>
        <p className="text-gray-500">Belum ada riwayat kegiatan.</p>
      </div>
    );
  }

  const getTypeStyle = (type: ActivityType) => {
    switch (type) {
      case ActivityType.CHECK_IN: return "bg-green-100 text-green-700";
      case ActivityType.CHECK_OUT: return "bg-orange-100 text-orange-700";
      case ActivityType.DAILY_REPORT: return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getLabel = (type: ActivityType) => {
    switch (type) {
      case ActivityType.CHECK_IN: return "Masuk";
      case ActivityType.CHECK_OUT: return "Pulang";
      case ActivityType.DAILY_REPORT: return "Laporan";
      default: return "Lainnya";
    }
  };

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div key={record.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 transition-transform hover:scale-[1.01]">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeStyle(record.type)}`}>
            <span className="material-icons-round">
              {record.type === ActivityType.CHECK_IN ? 'login' : 
               record.type === ActivityType.CHECK_OUT ? 'logout' : 'description'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-800">{getLabel(record.type)}</h4>
                <p className="text-xs text-gray-500">
                  {new Date(record.timestamp).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })} • 
                  {new Date(record.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {record.location && (
                <a 
                  href={`https://www.google.com/maps?q=${record.location.lat},${record.location.lng}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-200 hover:bg-gray-100 flex items-center gap-1"
                >
                  <span className="material-icons-round text-[14px]">place</span>
                  Peta
                </a>
              )}
            </div>
            {record.description && (
              <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                {record.description}
                {record.aiGeneratedSummary && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-purple-600 font-medium">
                    <span className="material-icons-round text-[12px]">auto_awesome</span>
                    Dibuat dengan bantuan Gemini AI
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};