import { Calendar, Trophy, Users } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-display text-6xl font-bold text-primary md:text-8xl">The Rocktober Challenge</h1>
          <p className="mt-6 text-xl text-muted-foreground md:text-2xl">
            Join us this October for an epic rock climbing competition!
          </p>
          <p className="mt-4 text-lg text-foreground">
            Climb walls, conquer routes, compete for prizes, and show off your best costume!
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2 rounded-lg bg-card p-6 shadow-sm">
              <Calendar className="h-8 w-8 text-primary" />
              <h3 className="font-semibold text-foreground">October 2025</h3>
              <p className="text-sm text-muted-foreground">All month long</p>
            </div>

            <div className="flex flex-col items-center gap-2 rounded-lg bg-card p-6 shadow-sm">
              <Trophy className="h-8 w-8 text-secondary" />
              <h3 className="font-semibold text-foreground">Win Prizes</h3>
              <p className="text-sm text-muted-foreground">Top climbers awarded</p>
            </div>

            <div className="flex flex-col items-center gap-2 rounded-lg bg-card p-6 shadow-sm">
              <Users className="h-8 w-8 text-accent" />
              <h3 className="font-semibold text-foreground">All Ages</h3>
              <p className="text-sm text-muted-foreground">Multiple categories</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
