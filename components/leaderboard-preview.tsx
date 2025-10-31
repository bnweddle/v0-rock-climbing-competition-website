"use client"

import Link from "next/link"
import { useCompetitionStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Trophy, Clock, Zap } from "lucide-react"

export function LeaderboardPreview() {
  const { getLeaderboard, getSpeedLeaderboard } = useCompetitionStore()
  const leaderboard = getLeaderboard().slice(0, 10)
  const speedLeaderboard = getSpeedLeaderboard().slice(0, 5)

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
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="font-display text-4xl font-bold text-primary mb-4">Leaderboard</h2>
            <p className="text-muted-foreground">Top climbers in the Rocktober Challenge</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Overall Points Leaderboard */}
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Trophy className="h-5 w-5 text-primary" />
                Top 10 - Overall Points
              </CardTitle>
              <CardDescription>Ranked by total points earned</CardDescription>
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

          {/* Speed Challenge Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Clock className="h-5 w-5 text-blue-500" />
                Top 5 - Speed Challenge
              </CardTitle>
              <CardDescription>Fastest times recorded</CardDescription>
            </CardHeader>
            <CardContent>
              {speedLeaderboard.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No speed times recorded yet</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {speedLeaderboard.map((entry, index) => (
                      <div
                        key={entry.participant.id}
                        className="flex items-center gap-4 rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                          {index === 0 && <Zap className="h-5 w-5 text-blue-500" />}
                          {index !== 0 && <span className="font-bold text-blue-500">{index + 1}</span>}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground truncate">{entry.participant.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {entry.attemptCount} {entry.attemptCount === 1 ? "attempt" : "attempts"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="font-bold text-blue-600 dark:text-blue-400">{entry.bestTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <Button asChild variant="outline">
                      <Link href="/leaderboard">View All Speed Times</Link>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
