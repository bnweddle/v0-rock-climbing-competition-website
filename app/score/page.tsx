import { Header } from "@/components/header"
import { ScoreEntry } from "@/components/score-entry"

export default function ScorePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12">
        <ScoreEntry />
      </main>
    </div>
  )
}
