import React, { useState } from 'react';
import { useMutation } from '../apollo-imports';
import { LOGIN_MUTATION, REGISTER_MUTATION } from '../graphql/operations';
import { setToken } from '../utils/auth';
import { AuthPayload } from '../types';

interface LoginProps {
  onLoginSuccess: () => void;
}

interface LoginData {
  login: AuthPayload;
}

interface RegisterData {
  register: AuthPayload;
}

interface AuthVariables {
  username: string;
  secretCode: string;
  anonymous?: boolean;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [error, setError] = useState('');

  const [login, { loading: loginLoading }] = useMutation<LoginData, AuthVariables>(LOGIN_MUTATION, {
    onCompleted: (data) => {
      setToken(data.login.token);
      onLoginSuccess();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const [register, { loading: registerLoading }] = useMutation<RegisterData, AuthVariables>(REGISTER_MUTATION, {
    onCompleted: (data) => {
      setToken(data.register.token);
      onLoginSuccess();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (secretCode.length < 6) {
      setError('Secret code must be at least 6 characters');
      return;
    }

    if (isRegister) {
      register({ variables: { username, secretCode, anonymous } });
    } else {
      login({ variables: { username, secretCode } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-conspiracy-dark p-4">
      <div className="w-full max-w-md">
        <div className="bg-conspiracy-darker border-2 border-conspiracy-green p-8 shadow-2xl shadow-conspiracy-green/30">
          <h2 className="text-3xl font-bold text-conspiracy-green text-center mb-2 animate-pulse">
            🔐 ACCESS TERMINAL
          </h2>
          <p className="text-conspiracy-green/70 text-xs text-center mb-8">
            [ENTER CREDENTIALS - UNAUTHORIZED ACCESS PROHIBITED]
          </p>

          {error && (
            <div className="bg-conspiracy-red/20 border border-conspiracy-red text-conspiracy-red p-3 mb-4 text-sm">
              ⚠️ ERROR: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-conspiracy-green text-sm mb-2">
                [USERNAME]
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-conspiracy-dark border border-conspiracy-green text-conspiracy-green px-4 py-2 focus:outline-none focus:border-conspiracy-amber font-mono"
                placeholder="agent_[NAME]"
                required
              />
            </div>

            <div>
              <label className="block text-conspiracy-green text-sm mb-2">
                [SECRET CODE]
              </label>
              <input
                type="password"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                className="w-full bg-conspiracy-dark border border-conspiracy-green text-conspiracy-green px-4 py-2 focus:outline-none focus:border-conspiracy-amber font-mono"
                placeholder="******"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="anonymous" className="text-conspiracy-green text-sm">
                🕵️ ANONYMOUS MODE
              </label>
            </div>

            <button
              type="submit"
              disabled={loginLoading || registerLoading}
              className="w-full bg-conspiracy-green text-conspiracy-darker py-3 font-bold hover:bg-conspiracy-amber transition-colors disabled:opacity-50"
            >
              {loginLoading || registerLoading ? '[PROCESSING...]' : isRegister ? '[REGISTER]' : '[LOGIN]'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-conspiracy-amber text-sm hover:text-conspiracy-green transition-colors"
            >
              {isRegister ? '[ALREADY HAVE ACCESS? LOGIN]' : '[NEW AGENT? REGISTER]'}
            </button>
          </div>

          <div className="mt-6 text-conspiracy-green/50 text-xs text-center">
            💀 "TRUST NO ONE" 💀
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
