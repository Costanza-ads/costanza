import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { LearningMethodsSection } from "@/components/learning-methods-section"
import { StatsSection } from "@/components/stats-section"
import { RankingSection } from "@/components/ranking-section"
import { ProjectsSection } from "@/components/projects-section"
import { BadgesSection } from "@/components/badges-section"
import { Footer } from "@/components/footer"
import UserFetcher from '@/components/user-fetcher'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <LearningMethodsSection />
        <StatsSection />
        <RankingSection />
        <ProjectsSection />
        <BadgesSection />
        <h1>Next.js Frontend</h1>
        <p>Abaixo, os dados buscados da sua API Django (Porta 8000):</p>
      
        {/* Componente de Cliente para o Fetch */}
        <UserFetcher />
      </main>
      <Footer />
    </div>
  )
}
