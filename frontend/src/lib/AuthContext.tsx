// src/lib/AuthContext.ts
'use client'; 

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

// Certifique-se de que este caminho está correto para seus utilitários
import { setAuthToken, removeAuthToken, getAuthToken } from './auth-utils'; 
// Supondo que você também criou o src/hooks/use-auth.ts para exportar o hook

// --- 1. Tipagem (Defina a estrutura dos dados do usuário) ---

interface User {
  id: number;
  username: string;
  email: string;
  // Adicione outros campos necessários aqui (ex: score, avatar)
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading: boolean;
}

// --- 2. Criação do Contexto ---

// Crie o contexto com um valor inicial undefined
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- 3. Componente Provider ---

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 3.1. Carregar estado inicial (executado apenas no cliente)
  useEffect(() => {
    const token = getAuthToken(); // Obtém o token do localStorage
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        // Tenta analisar os dados do usuário
        const parsedUser = JSON.parse(storedUser) as User; 
        setAccessToken(token);
        setUser(parsedUser);
      } catch (e) {
        console.error("Erro ao analisar dados do usuário armazenados.", e);
        removeAuthToken(); // Limpa dados inválidos
      }
    }
    setLoading(false); // Finaliza o carregamento
  }, []);

  // 3.2. Função de Login (Usada após a requisição de login bem-sucedida)
  const login = (token: string, userData: User) => {
    // 1. Armazena o token e os dados do usuário usando as utilidades
    setAuthToken(token); 
    localStorage.setItem('user', JSON.stringify(userData));
    
    // 2. Atualiza o estado
    setAccessToken(token);
    setUser(userData);
    
    // 3. Redireciona
    router.push('/dashboard'); 
  };

  // 3.3. Função de Logout
  const logout = () => {
    // 1. Remove o token e os dados do usuário usando as utilidades
    removeAuthToken(); 
    
    // 2. Limpa o estado
    setAccessToken(null);
    setUser(null);
    
    // 3. Redireciona
    router.push('/login'); 
  };
  
  const isAuthenticatedValue = !!accessToken && !!user;

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: isAuthenticatedValue,
    accessToken,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {/* Exibe um loader enquanto a sessão é verificada no cliente, 
         evitando flash de conteúdo */}
      {loading ? <div>Carregando autenticação...</div> : children}
    </AuthContext.Provider>
  );
};