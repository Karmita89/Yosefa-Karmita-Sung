import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { GOOGLE_CLIENT_ID } from '../constants';

declare global {
  interface Window {
    google: any;
  }
}

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [googleReady, setGoogleReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let attempts = 0;
    const maxAttempts = 50;

    const initializeGoogleSignIn = () => {
      if (!isMounted) return;

      if (!window.google && attempts < maxAttempts) {
        attempts++;
        setTimeout(initializeGoogleSignIn, 100);
        return;
      }

      if (!window.google) {
        console.warn('Google Sign-In script did not load');
        setGoogleReady(true);
        return;
      }

      try {
        const handleCredentialResponse = (response: any) => {
          if (!isMounted) return;
          try {
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
          } catch (error) {
            console.error('Failed to decode JWT:', error);
          }
        };

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        // Render button immediately
        const googleSignInDiv = document.getElementById("googleSignIn");
        if (googleSignInDiv && window.google?.accounts?.id?.renderButton) {
          window.google.accounts.id.renderButton(
            googleSignInDiv,
            {
              theme: "outline",
              size: "large",
              width: 280,
            }
          );
        }

        if (isMounted) {
          setGoogleReady(true);
        }
      } catch (error) {
        console.warn('Error initializing Google Sign-In:', error);
        if (isMounted) {
          setGoogleReady(true);
        }
      }
    };

    initializeGoogleSignIn();

    return () => {
      isMounted = false;
    };
  }, [onLogin]);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-red-900 via-red-800 to-slate-900 relative overflow-hidden flex flex-col md:flex-row">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      </div>

      {/* Left Column - Info Section (Desktop Only) */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-8 lg:p-12 z-10">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 lg:w-28 lg:h-28 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
            <span className="material-icons-round text-5xl lg:text-6xl text-white">school</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">KKN Kelompok 34</h1>
          <p className="text-lg lg:text-xl text-white/80 mb-2">Program Kuliah Kerja Nyata</p>
          <p className="text-base text-white/70 mb-6">Desa Sidorahayu, Universitas Merdeka Malang</p>
          <div className="w-1 h-1 bg-white/50 rounded-full mx-auto mb-6"></div>
          <p className="text-sm text-white/60">
            Kelompok 34 • KKN Unmer Malang
          </p>
        </div>
      </div>

      {/* Right Column / Mobile Section - Login Card */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 z-10">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-sm p-6 sm:p-8 border border-white/20">
          {/* Mobile Header (hidden on desktop) */}
          <div className="md:hidden text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <span className="material-icons-round text-4xl text-red-800">school</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">KKN Kelompok 34</h1>
            <p className="text-sm text-gray-600 mb-1">Desa Sidorahayu</p>
            <p className="text-xs text-red-700 font-medium">Universitas Merdeka Malang</p>
          </div>

          {/* Desktop Header (hidden on mobile) */}
          <div className="hidden md:block text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Login</h2>
            <p className="text-sm text-gray-600">Gunakan akun Google Anda</p>
          </div>

          {/* Google Sign-In Button Container */}
          <div className="flex justify-center mb-6">
            <div
              id="googleSignIn"
              style={{
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            ></div>
          </div>

          {/* Loading state shown while waiting */}
          {!googleReady && (
            <div className="flex justify-center py-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-gray-500">Memuat Google Sign-In...</p>
              </div>
            </div>
          )}

          {/* Helper text */}
          <p className="text-xs text-center text-gray-400 mt-6">
            Login menggunakan akun Google untuk melanjutkan
          </p>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-white/50 text-xs text-center z-0 pointer-events-none">
        &copy; {new Date().getFullYear()} KKN Unmer Malang - Kelompok 34
      </div>
    </div>
  );
};

