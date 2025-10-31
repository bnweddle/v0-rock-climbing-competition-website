"use client"

import { useState } from "react"
import { useCompetitionStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Trophy, Medal, Award, Clock, CheckCircle } from "lucide-react"
import { getDifficultyColor } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function LeaderboardFull() {
  const { getLeaderboard, ageTiers, routes, wallTops, participantClimbs, bonuses } = useCompetitionStore()
  const [filterGender, setFilterGender] = useState<string>("all")
  const [filterAgeTier, setFilterAgeTier] = useState<string>("all")

  let leaderboard = getLeaderboard()

  // Apply filters
  if (filterGender !== "all") {
    leaderboard = leaderboard.filter((p) => p.gender === filterGender)
  }
  if (filterAgeTier !== "all") {
    leaderboard = leaderboard.filter((p) => p.ageTierId === Number.parseInt(filterAgeTier))
  }

  const getParticipantClimbs = (participantId: number) => {
    return participantClimbs.filter((c) => c.participantId === participantId)
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-primary" />
    if (index === 1) return <Medal className="h-6 w-6 text-secondary" />
    if (index === 2) return <Medal className="h-6 w-6 text-accent" />
    return <span className="text-lg font-bold text-primary">{index + 1}</span>
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-5xl font-bold text-primary mb-4">Leaderboard</h1>
          <p className="text-muted-foreground text-lg">See how climbers rank in the Rocktober Challenge</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-foreground">Filter Results</CardTitle>
            <CardDescription>Narrow down the leaderboard by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Gender</label>
                <Select value={filterGender} onValueChange={setFilterGender}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Age Tier</label>
                <Select value={filterAgeTier} onValueChange={setFilterAgeTier}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Age Tiers</SelectItem>
                    {ageTiers.map((tier) => (
                      <SelectItem key={tier.id} value={tier.id.toString()}>
                        {tier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(filterGender !== "all" || filterAgeTier !== "all") && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 bg-transparent"
                onClick={() => {
                  setFilterGender("all")
                  setFilterAgeTier("all")
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Rankings</CardTitle>
            <CardDescription>
              {leaderboard.length} {leaderboard.length === 1 ? "climber" : "climbers"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No participants match your filters</p>
              </div>
            )}

            <div className="space-y-3">
              {leaderboard.map((participant, index) => {
                const tier = ageTiers.find((t) => t.id === participant.ageTierId)
                const climbs = getParticipantClimbs(participant.id)

                return (
                  <div
                    key={participant.id}
                    className="flex items-center gap-4 rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      {getRankIcon(index)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg text-foreground">{participant.name}</h3>
                        <Badge variant="outline">{participant.gender}</Badge>
                        <Badge variant="secondary">{tier?.name}</Badge>
                      </div>

                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="text-sm text-muted-foreground">{climbs.length} climbs</span>
                        {participant.bonuses && participant.bonuses.length > 0 && (
                          <div className="flex items-center gap-1">
                            {participant.bonuses.map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                            ))}
                            <span className="text-sm text-muted-foreground ml-1">
                              {participant.bonuses.length} {participant.bonuses.length === 1 ? "bonus" : "bonuses"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{participant.totalScore}</div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{participant.name}&apos;s Performance</DialogTitle>
                            <DialogDescription>Detailed breakdown of climbs and bonuses</DialogDescription>
                          </DialogHeader>

                          <div className="space-y-6 mt-4">
                            {/* Summary */}
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-center p-4 rounded-lg bg-primary/10">
                                <div className="text-3xl font-bold text-primary">{participant.totalScore}</div>
                                <div className="text-sm text-muted-foreground">Total Points</div>
                              </div>
                              <div className="text-center p-4 rounded-lg bg-secondary/10">
                                <div className="text-3xl font-bold text-secondary">{climbs.length}</div>
                                <div className="text-sm text-muted-foreground">Climbs</div>
                              </div>
                              <div className="text-center p-4 rounded-lg bg-accent/10">
                                <div className="text-3xl font-bold text-accent">{participant.bonuses?.length || 0}</div>
                                <div className="text-sm text-muted-foreground">Bonuses</div>
                              </div>
                            </div>

                            {/* Bonuses */}
                            {participant.bonuses && participant.bonuses.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                  <Award className="h-5 w-5 text-accent" />
                                  Bonuses Earned
                                </h4>
                                <div className="space-y-2">
                                  {participant.bonuses.map((bonus) => (
                                    <div
                                      key={bonus.id}
                                      className="flex items-center justify-between rounded-lg border border-border p-3"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4 fill-accent text-accent" />
                                        <span className="text-sm font-medium text-foreground">{bonus.name}</span>
                                      </div>
                                      <Badge variant="secondary">+{bonus.points} pts</Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Climbs */}
                            {climbs.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-foreground mb-3">Climb History</h4>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                  {climbs.map((climb) => {
                                    const route = routes.find((r) => r.id === climb.routeId)
                                    const wall = wallTops.find((w) => w.id === climb.wallTopId)
                                    const category = climb.categoryId === 3 ? "Speed" : null
                                    const isSpeedClimb = !route && !wall && category === "Speed"

                                    return (
                                      <div
                                        key={climb.id}
                                        className="flex items-center justify-between rounded-lg border border-border p-3"
                                      >
                                        <div className="flex-1">
                                          {isSpeedClimb && climb.speedTime && (
                                            <div className="flex items-center gap-2 flex-wrap">
                                              <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                                                Speed Challenge
                                              </Badge>
                                              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent/50">
                                                <Clock className="h-4 w-4 text-primary" />
                                                <span className="text-sm font-bold text-foreground">{climb.speedTime}</span>
                                              </div>
                                            </div>
                                          )}
                                          {route && (
                                            <div className="flex items-center gap-2 flex-wrap">
                                              <span className="text-sm font-medium text-foreground">{route.name}</span>
                                              <Badge className={`${getDifficultyColor(route.difficulty)} text-xs`}>
                                                {route.difficulty}
                                              </Badge>
                                              {climb.checkpointReached && (
                                                <Badge variant="outline" className="text-xs">
                                                  {climb.checkpointReached === "checkpoint1" && "CP1"}
                                                  {climb.checkpointReached === "checkpoint2" && "CP2"}
                                                  {climb.checkpointReached === "topout" && "Top Out"}
                                                </Badge>
                                              )}
                                              {climb.completionCount && climb.completionCount > 1 && (
                                                <Badge variant="secondary" className="text-xs">
                                                  ×{climb.completionCount}
                                                </Badge>
                                              )}
                                            </div>
                                          )}
                                          {wall && (
                                            <div className="flex items-center gap-2 flex-wrap">
                                              <span className="text-sm font-medium text-foreground">
                                                Wall {wall.wallNumber}
                                              </span>
                                              {wall.difficulty && (
                                                <Badge className={`${getDifficultyColor(wall.difficulty)} text-xs`}>
                                                  {wall.difficulty}
                                                </Badge>
                                              )}
                                              {climb.checkpointReached && (
                                                <Badge variant="outline" className="text-xs">
                                                  {climb.checkpointReached === "checkpoint1" && "CP1"}
                                                  {climb.checkpointReached === "checkpoint2" && "CP2"}
                                                  {climb.checkpointReached === "topout" && "Top Out"}
                                                </Badge>
                                              )}
                                              {climb.completionCount && climb.completionCount > 1 && (
                                                <Badge variant="secondary" className="text-xs">
                                                  ×{climb.completionCount}
                                                </Badge>
                                              )}
                                            </div>
                                          )}
                                          <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(climb.completedAt).toLocaleDateString()}
                                          </p>
                                        </div>
                                        <Badge variant="secondary" className="ml-2">{climb.pointsEarned} pts</Badge>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
