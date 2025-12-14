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
    <div className="w-full min-h-screen bg-slate-50 flex flex-col lg:flex-row items-center justify-center px-4 py-6 lg:px-10 lg:py-0">
      {/* Left: Branding (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 h-full items-center justify-center p-8">
        <div className="w-full max-w-lg">
          <div className="mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-50">
              <span className="material-icons-round text-4xl text-red-700">school</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Selamat Datang di KKN Kelompok 34</h2>
          <p className="text-base text-gray-600">Program Kuliah Kerja Nyata • Desa Sidorahayu<br/>Universitas Merdeka Malang</p>
        </div>
      </div>

      {/* Right: Login card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full bg-white rounded-2xl shadow-xl p-6 lg:p-10">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50 lg:hidden">
              <span className="material-icons-round text-3xl text-red-700">school</span>
            </div>

            <div className="text-center w-full">
              <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">KKN Kelompok 34</h1>
              <p className="text-sm lg:text-base text-gray-500 mt-1">Masuk menggunakan akun Google untuk melanjutkan</p>
            </div>

            <div className="w-full">
              <div id="googleSignIn" className="w-full flex items-center justify-center h-12"></div>
            </div>

            {!googleReady && (
              <div className="w-full flex items-center justify-center py-2">
                <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            <p className="text-xs text-gray-400 text-center">&copy; {new Date().getFullYear()} KKN Unmer Malang - Kelompok 34</p>
          </div>
        </div>
      </div>
    </div>
  );
};

