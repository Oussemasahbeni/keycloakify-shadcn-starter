import { AboutSection } from '#/features/landing/about-section'
import { FaqSection } from '#/features/landing/faq-section'
import { LandingFooter } from '#/features/landing/footer'
import { Header } from '#/features/landing/header'
import { HeroSection } from '#/features/landing/hero-section'
import { StatsSection } from '#/features/landing/stats-section'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Landing,
})

export function Landing() {
  return (
    <div className="flex flex-col min-h-svh">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <AboutSection />
        <FaqSection />
      </main>
      <LandingFooter />
    </div>
  )
}
