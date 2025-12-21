import React from 'react';
import { removeToken } from '../utils/auth';

interface HeaderProps {
  isAuthenticated: boolean;
  username?: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, username, onLogout }) => {
  const handleLogout = () => {
    removeToken();
    onLogout();
  };

  return (
    <header className="bg-conspiracy-darker border-b-2 border-conspiracy-green p-4 shadow-lg shadow-conspiracy-green/20">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-conspiracy-green animate-pulse">
            🛸 CONSPIRACY FORUM 👁️
          </h1>
          <span className="text-xs text-conspiracy-green/70 hidden md:block">
            [CLASSIFIED - TOP SECRET]
          </span>
        </div>
        {isAuthenticated && (
          <div className="flex items-center space-x-4">
            <span className="text-conspiracy-green text-sm">
              USER: <span className="text-conspiracy-amber">{username || 'ANONYMOUS'}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-conspiracy-red text-white font-mono text-sm border border-conspiracy-red hover:bg-conspiracy-red/80 transition-colors"
            >
              [LOGOUT]
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
