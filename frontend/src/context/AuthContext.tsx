import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { LOGIN, REGISTER, GET_ME, SET_ANONYMOUS_MODE } from '../graphql/operations';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../types';

interface MeQueryData {
  me: User | null;
}

interface LoginMutationData {
  login: AuthResponse;
}

interface RegisterMutationData {
  register: AuthResponse;
}

interface SetAnonymousModeMutationData {
  setAnonymousMode: { id: string; anonymousMode: boolean };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginRequest) => Promise<AuthResponse>;
  register: (input: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
  toggleAnonymousMode: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);

  const { data: meData, loading: meLoading, refetch: refetchMe, error: meError } = useQuery<MeQueryData>(GET_ME, {
    skip: !token,
  });

  // Handle auth errors
  useEffect(() => {
    if (meError) {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  }, [meError]);

  const [loginMutation] = useMutation<LoginMutationData>(LOGIN);
  const [registerMutation] = useMutation<RegisterMutationData>(REGISTER);
  const [setAnonymousModeMutation] = useMutation<SetAnonymousModeMutationData>(SET_ANONYMOUS_MODE);

  useEffect(() => {
    if (meData?.me) {
      setUser(meData.me);
    }
  }, [meData]);

  const login = async (input: LoginRequest): Promise<AuthResponse> => {
    const { data } = await loginMutation({ variables: { input } });
    if (!data) throw new Error('Login failed');
    const response = data.login;
    localStorage.setItem('token', response.token);
    setToken(response.token);
    await refetchMe();
    return response;
  };

  const register = async (input: RegisterRequest): Promise<AuthResponse> => {
    const { data } = await registerMutation({ variables: { input } });
    if (!data) throw new Error('Registration failed');
    const response = data.register;
    localStorage.setItem('token', response.token);
    setToken(response.token);
    await refetchMe();
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const toggleAnonymousMode = async () => {
    if (!user) return;
    const { data } = await setAnonymousModeMutation({
      variables: { anonymous: !user.anonymousMode },
    });
    if (data) {
      setUser({ ...user, anonymousMode: data.setAnonymousMode.anonymousMode });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading: meLoading,
        login,
        register,
        logout,
        toggleAnonymousMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
