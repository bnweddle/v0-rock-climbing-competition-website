import { Header } from "@/components/header"
import { LeaderboardFull } from "@/components/leaderboard-full"

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12">
        <LeaderboardFull />
      </main>
    </div>
  )
}
