import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Menu } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#1a1a1a] border-b border-border/40">
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
          <Link href="#comunidade" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
            Comunidade
          </Link>
          <Link href="#conquistas" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
            Conquistas
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
