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
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-slate-900 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      </div>

      {/* Main Card */}
      <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md z-10 border border-white/20">
        {/* Header Section */}
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

        {/* Google Sign-In Button Container */}
        <div className="flex justify-center mb-4">
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
          <div className="flex justify-center py-3">
            <div className="flex flex-col items-center gap-2">
              <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-500">Memuat Google Sign-In...</p>
            </div>
          </div>
        )}

        {/* Helper text */}
        <p className="text-xs text-center text-gray-400 mt-4">
          Login menggunakan akun Google
        </p>
      </div>

      {/* Copyright Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-white/50 text-xs text-center z-0 pointer-events-none">
        &copy; {new Date().getFullYear()} KKN Unmer Malang - Kelompok 34
      </div>
    </div>
  );
};
