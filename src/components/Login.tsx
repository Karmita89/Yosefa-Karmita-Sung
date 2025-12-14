import React, { useEffect, useState } from 'react';
import { User } from '../types';

declare global {
  interface Window {
    google: any;
  }
}

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!window.google) return;

    const clientId = (import.meta.env as any).VITE_GOOGLE_CLIENT_ID || "771290788996-ouvplmhlljeadgtbe0e4398j1dle4g7e.apps.googleusercontent.com";

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleSignIn"),
      {
        theme: "outline",
        size: "large",
        width: 280,
      }
    );

    setIsInitializing(false);
  }, []);

  const handleCredentialResponse = (response: any) => {
    const decoded = JSON.parse(
      atob(response.credential.split(".")[1])
    );

    const user: User = {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      photoUrl: decoded.picture,
      role: 'STUDENT',
    };

    onLogin(user);
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
          <p className="text-sm text-red-700 font-medium mt-1">
            Universitas Merdeka Malang
          </p>
        </div>

        {isInitializing ? (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div id="googleSignIn"></div>
          </div>
        )}

        <p className="text-xs text-center text-gray-400 mt-4">
          Login menggunakan akun Google
        </p>
      </div>

      <div className="absolute bottom-4 text-white/50 text-xs text-center w-full">
        &copy; {new Date().getFullYear()} KKN Unmer Malang - Kelompok 34
      </div>
    </div>
  );
};
