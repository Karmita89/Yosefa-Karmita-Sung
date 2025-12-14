import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
}

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = () => {
      if (!window.google || !window.google.accounts) {
        setError('Gagal memuat Google Sign-In. Pastikan HTTPS dan script Google tersedia.');
        setLoading(false);
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: '771290788996-ouvplmhlljeadgtbe0e4398j1dle4g7e.apps.googleusercontent.com', // ganti dengan Client ID kamu
          callback: (response: any) => {
            try {
              const decoded = JSON.parse(atob(response.credential.split('.')[1]));
              const user: User = {
                id: decoded.sub,
                name: decoded.name,
                email: decoded.email,
                photoUrl: decoded.picture,
              };
              onLogin(user);
            } catch (err) {
              console.error('Decoding error:', err);
              setError('Login gagal. Silakan coba lagi.');
            }
          },
        });

        window.google.accounts.id.renderButton(
          document.getElementById('googleSignIn')!,
          { theme: 'outline', size: 'large', width: 280 }
        );

        setLoading(false);
      } catch (err) {
        console.error('Google Sign-In initialization failed:', err);
        setError('Login gagal karena konfigurasi Google Sign-In.');
        setLoading(false);
      }
    };

    if (window.google && window.google.accounts) {
      initialize();
    } else {
      window.addEventListener('load', initialize);
    }

    return () => window.removeEventListener('load', initialize);
  }, [onLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <div id="googleSignIn" className="mb-4"></div>
        {loading && (
          <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </div>
  );
};
