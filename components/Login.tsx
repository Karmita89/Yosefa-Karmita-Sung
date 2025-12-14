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

  const handleCredentialResponse = (response: any) => {
    const decoded = JSON.parse(atob(response.credential.split(".")[1]));

    const user: User = {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      photoUrl: decoded.picture,
      role: 'STUDENT',
    };

    onLogin(user);
  };

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id:
            "771290788996-ouvplmhlljeadgtbe0e4398j1dle4g7e.apps.googleusercontent.com",
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("googleSignIn")!,
          {
            theme: "outline",
            size: "large",
            width: 280,
          }
        );

        setIsInitializing(false);
      }
    };

    // Cek apakah library sudah siap
    if (window.google && window.google.accounts) {
      initializeGoogleSignIn();
    } else {
      // Tunggu window load jika belum siap
      window.addEventListener("load", initializeGoogleSignIn);
    }

    return () =>
      window.removeEventListener("load", initializeGoogleSignIn);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-slate-900 p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Login KKN Kelompok 34
        </h1>

        {/* DIV GOOGLE HARUS SELALU ADA */}
        <div className="flex justify-center">
          <div id="googleSignIn"></div>
        </div>

        {isInitializing && (
          <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};
