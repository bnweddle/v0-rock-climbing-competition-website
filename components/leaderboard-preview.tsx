"use client"

import Link from "next/link"
import { useCompetitionStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Trophy } from "lucide-react"

export function LeaderboardPreview() {
  const { getLeaderboard } = useCompetitionStore()
  const leaderboard = getLeaderboard().slice(0, 10)

  if (leaderboard.length === 0) {
    return (
      <section id="leaderboard" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-display text-4xl font-bold text-primary mb-4">Leaderboard</h2>
            <p className="text-muted-foreground">No participants yet. Be the first to register!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="leaderboard" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="font-display text-4xl font-bold text-primary mb-4">Leaderboard</h2>
            <p className="text-muted-foreground">Top climbers in the Rocktober Challenge</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Top 10 Climbers</CardTitle>
              <CardDescription>Updated in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((participant, index) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-4 rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      {index === 0 && <Trophy className="h-5 w-5 text-primary" />}
                      {index !== 0 && <span className="font-bold text-primary">{index + 1}</span>}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate">{participant.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {participant.bonuses && participant.bonuses.length > 0 && (
                          <div className="flex items-center gap-0.5">
                            {participant.bonuses.map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <Badge variant="secondary" className="flex-shrink-0">
                      {participant.totalScore} pts
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Button asChild variant="outline">
                  <Link href="/leaderboard">View Full Leaderboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
