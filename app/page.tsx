import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { RulesSection } from "@/components/rules-section"
import { EntryForm } from "@/components/entry-form"
import { LeaderboardPreview } from "@/components/leaderboard-preview"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <RulesSection />
        <EntryForm />
        <LeaderboardPreview />
      </main>
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 The Rocktober Challenge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
