import React, { useEffect, useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isInitializing, setIsInitializing] = useState(true);

  // Simulate Google Sign-In Script Load
  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleMockLogin = () => {
    // In a real app, this would be the callback from Google
    const mockUser: User = {
      id: '123456789',
      name: 'Mahasiswa KKN',
      email: 'mahasiswa@unmer.ac.id',
      photoUrl: 'https://picsum.photos/200',
      role: 'STUDENT'
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-slate-900 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-red-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
         <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
      </div>

      <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md z-10 border border-white/20">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
             <span className="material-icons-round text-4xl text-red-800">school</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">KKN Kelompok 34</h1>
          <p className="text-gray-600">Desa Sidorahayu</p>
          <p className="text-sm text-red-700 font-medium mt-1">Universitas Merdeka Malang</p>
        </div>

        <div className="space-y-4">
          {isInitializing ? (
             <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : (
            <>
               <button 
                onClick={handleMockLogin}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all shadow-sm hover:shadow-md group"
               >
                 <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google Logo" />
                 <span>Sign in with Google</span>
               </button>
               
               <div className="text-center mt-4">
                 <p className="text-xs text-gray-400">
                   Gunakan email institusi (@unmer.ac.id) jika tersedia.
                 </p>
               </div>
            </>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-4 text-white/50 text-xs text-center w-full">
        &copy; {new Date().getFullYear()} KKN Unmer Malang - Kelompok 34
      </div>
    </div>
  );
};