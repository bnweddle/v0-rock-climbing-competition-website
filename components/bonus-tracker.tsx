"use client"

import { useCompetitionStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, Award, Users, TrendingUp } from "lucide-react"

export function BonusTracker() {
  const { bonuses, participants, participantBonuses, getParticipantWithDetails } = useCompetitionStore()

  const activeBonuses = bonuses.filter((b) => b.isActive)

  const getBonusStats = (bonusId: number) => {
    const earnedCount = participantBonuses.filter((pb) => pb.bonusId === bonusId).length
    const percentage = participants.length > 0 ? (earnedCount / participants.length) * 100 : 0
    return { earnedCount, percentage }
  }

  const getParticipantsWithBonus = (bonusId: number) => {
    const participantIds = participantBonuses.filter((pb) => pb.bonusId === bonusId).map((pb) => pb.participantId)
    return participants.filter((p) => participantIds.includes(p.id))
  }

  const totalBonusesAwarded = participantBonuses.length
  const totalBonusPoints = participantBonuses.reduce((sum, pb) => {
    const bonus = bonuses.find((b) => b.id === pb.bonusId)
    return sum + (bonus?.points || 0)
  }, 0)

  return (
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-5xl font-bold text-primary mb-4">Bonus Points Tracker</h1>
          <p className="text-muted-foreground text-lg">Track bonus achievements across all participants</p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Bonuses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold text-foreground">{activeBonuses.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Bonuses Awarded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent" />
                <span className="text-3xl font-bold text-foreground">{totalBonusesAwarded}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Bonus Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-secondary" />
                <span className="text-3xl font-bold text-foreground">{totalBonusPoints}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                <span className="text-3xl font-bold text-foreground">{participants.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bonus Details */}
        <div className="space-y-6">
          {activeBonuses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No active bonuses. Add bonuses in the admin dashboard!</p>
              </CardContent>
            </Card>
          ) : (
            activeBonuses.map((bonus) => {
              const stats = getBonusStats(bonus.id)
              const participantsWithBonus = getParticipantsWithBonus(bonus.id)

              return (
                <Card key={bonus.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-5 w-5 text-accent" />
                          <CardTitle className="text-foreground">{bonus.name}</CardTitle>
                          <Badge variant="secondary">+{bonus.points} pts</Badge>
                        </div>
                        <CardDescription>{bonus.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{stats.earnedCount}</div>
                        <div className="text-xs text-muted-foreground">earned</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Completion Rate</span>
                          <span className="font-medium text-foreground">{stats.percentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={stats.percentage} className="h-2" />
                      </div>

                      {/* Participants who earned this bonus */}
                      {participantsWithBonus.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-3">Earned By:</h4>
                          <div className="flex flex-wrap gap-2">
                            {participantsWithBonus.map((participant) => {
                              const details = getParticipantWithDetails(participant.id)
                              return (
                                <div
                                  key={participant.id}
                                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
                                >
                                  <span className="text-sm font-medium text-foreground">{participant.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {participant.totalScore} pts
                                  </Badge>
                                  {details?.bonuses && details.bonuses.length > 1 && (
                                    <div className="flex items-center gap-0.5">
                                      {details.bonuses.slice(0, 3).map((_, i) => (
                                        <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                                      ))}
                                      {details.bonuses.length > 3 && (
                                        <span className="text-xs text-muted-foreground ml-1">
                                          +{details.bonuses.length - 3}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {participantsWithBonus.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">No one has earned this bonus yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Top Bonus Earners */}
        {participants.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-foreground">Top Bonus Earners</CardTitle>
              <CardDescription>Participants with the most bonuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {participants
                  .map((p) => ({
                    ...p,
                    bonusCount: participantBonuses.filter((pb) => pb.participantId === p.id).length,
                  }))
                  .filter((p) => p.bonusCount > 0)
                  .sort((a, b) => b.bonusCount - a.bonusCount)
                  .slice(0, 10)
                  .map((participant, index) => {
                    const details = getParticipantWithDetails(participant.id)
                    return (
                      <div key={participant.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <span className="font-bold text-primary">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{participant.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            {details?.bonuses && (
                              <div className="flex items-center gap-0.5">
                                {details.bonuses.map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                                ))}
                              </div>
                            )}
                            <span className="text-sm text-muted-foreground">
                              {participant.bonusCount} {participant.bonusCount === 1 ? "bonus" : "bonuses"}
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary">{participant.totalScore} pts</Badge>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
