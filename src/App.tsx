import React, { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="antialiased text-gray-800 min-h-screen">
      <div className="max-w-6xl mx-auto p-6 lg:p-10">
        {user ? (
          <Dashboard user={user} onLogout={handleLogout} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </div>
  );
}

export default App;