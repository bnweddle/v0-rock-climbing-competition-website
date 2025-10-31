import { Header } from "@/components/header"
import { BonusTracker } from "@/components/bonus-tracker"

export default function BonusesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12">
        <BonusTracker />
      </main>
    </div>
  )
}
