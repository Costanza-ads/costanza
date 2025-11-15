// src/components/header.tsx
'use client'; // ⬅️ TORNA O COMPONENTE CLIENTE

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Menu, LogOut, User } from "lucide-react" // Adicione User e LogOut
import { useAuth } from '@/hooks/use-auth'; // ⬅️ IMPORTA O HOOK DE AUTENTICAÇÃO

export function Header() {
  const { isAuthenticated, user, logout } = useAuth(); // Obtém o estado e funções

  return (
    <header className="fixed top-0 z-50 w-full bg-[#1a1a1a] border-b border-border/40">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6 lg:px-8 max-w-6xl">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">Costanza</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#explore" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
            Explore
          </Link>
          <Link href="#progresso" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
            Progresso
          </Link>
          <Link href="#ranking" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
            Ranking
          </Link>
          {/* Adicione o link para Dashboard/Área Protegida APENAS se estiver logado */}
          {isAuthenticated && (
            <Link href="/dashboard" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Search className="h-5 w-5" />
          </Button>
          
          {isAuthenticated ? (
            // ⬅️ ESTADO 1: AUTENTICADO (Mostra Perfil e Logout)
            <div className="flex items-center gap-2">
                <Link href="/dashboard" passHref>
                    <Button variant="ghost" className="text-white hover:bg-white/10">
                        <User className="h-5 w-5 mr-2" />
                        {user?.username || user?.email}
                    </Button>
                </Link>

                <Button 
                    onClick={logout} 
                    className="bg-red-600 hover:bg-red-700 text-white"
                >
                    <LogOut className="h-4 w-4 mr-1" /> Sair
                </Button>
            </div>
          ) : (
            // ⬅️ ESTADO 2: NÃO AUTENTICADO (Mostra Login/Registro)
            <Link href="/auth/login" passHref>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Sign up
              </Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}