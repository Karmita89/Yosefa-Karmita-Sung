import React from 'react';
import { AttendanceRecord, ActivityType } from '../types';

interface HistoryListProps {
  records: AttendanceRecord[];
}

export const HistoryList: React.FC<HistoryListProps> = ({ records }) => {
  if (records.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <span className="material-icons-round text-4xl sm:text-5xl text-gray-300 mb-2 inline-block">history_toggle_off</span>
        <p className="text-gray-500 text-sm sm:text-base">Belum ada riwayat kegiatan.</p>
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
    <div className="space-y-3 sm:space-y-4">
      {records.map((record) => (
        <div key={record.id} className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 flex gap-3 sm:gap-4 transition-transform hover:shadow-md">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 text-sm sm:text-base ${getTypeStyle(record.type)}`}>
            <span className="material-icons-round">
              {record.type === ActivityType.CHECK_IN ? 'login' : 
               record.type === ActivityType.CHECK_OUT ? 'logout' : 'description'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <div className="min-w-0">
                <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{getLabel(record.type)}</h4>
                <p className="text-xs sm:text-sm text-gray-500">
                  {new Date(record.timestamp).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })} • 
                  {new Date(record.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {record.location && (
                <a 
                  href={`https://www.google.com/maps?q=${record.location.lat},${record.location.lng}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-200 hover:bg-gray-100 flex items-center gap-1 flex-shrink-0"
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