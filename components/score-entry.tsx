"use client"

import type React from "react"

import { useState } from "react"
import { useCompetitionStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2 } from "lucide-react"
import { calculateCheckpointPoints, validateSpeedTime, getDifficultyColor } from "@/lib/utils"
import type { CheckpointProgress } from "@/lib/types"

export function ScoreEntry() {
  const { participants, categories, routes, wallTops, addClimb } = useCompetitionStore()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    participantId: "",
    categoryId: "",
    routeId: "",
    wallTopId: "",
    speedTime: "",
    checkpoint: "topout" as "checkpoint1" | "checkpoint2" | "topout",
    completionCount: "1",
  })

  const selectedCategory = categories.find((c) => c.id === Number.parseInt(formData.categoryId))
  const availableRoutes = routes.filter((r) => r.categoryId === Number.parseInt(formData.categoryId))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.participantId || !formData.categoryId) {
      toast({
        title: "Missing Information",
        description: "Please select a participant and category",
        variant: "destructive",
      })
      return
    }

    // Validate Speed time if Speed category
    if (selectedCategory?.name === "Speed") {
      if (!formData.speedTime) {
        toast({
          title: "Missing Speed Time",
          description: "Please enter the speed time",
          variant: "destructive",
        })
        return
      }
      if (!validateSpeedTime(formData.speedTime)) {
        toast({
          title: "Invalid Time Format",
          description: "Please use format MM:SS:mm (e.g., 01:23:45)",
          variant: "destructive",
        })
        return
      }
    }

    let pointsEarned = 0
    let basePoints = 0
    const completionCount = Number.parseInt(formData.completionCount) || 1

    if (formData.routeId) {
      const route = routes.find((r) => r.id === Number.parseInt(formData.routeId))
      if (route) {
        basePoints = route.points
        const checkpoint1Mult = route.checkpoint1Multiplier || 0.2
        const checkpoint2Mult = route.checkpoint2Multiplier || 0.6
        pointsEarned = calculateCheckpointPoints(
          basePoints, 
          formData.checkpoint as CheckpointProgress,
          checkpoint1Mult,
          checkpoint2Mult
        ) * completionCount
      }
    } else if (formData.wallTopId) {
      const wall = wallTops.find((w) => w.id === Number.parseInt(formData.wallTopId))
      if (wall) {
        basePoints = wall.points
        const checkpoint1Mult = wall.checkpoint1Multiplier || 0.2
        const checkpoint2Mult = wall.checkpoint2Multiplier || 0.6
        pointsEarned = calculateCheckpointPoints(
          basePoints,
          formData.checkpoint as CheckpointProgress,
          checkpoint1Mult,
          checkpoint2Mult
        ) * completionCount
      }
    } else if (selectedCategory?.name === "Speed") {
      // For speed, we could award points based on time, but for now just a flat rate
      pointsEarned = 50 // Base points for speed
    }

    addClimb({
      participantId: Number.parseInt(formData.participantId),
      categoryId: Number.parseInt(formData.categoryId),
      routeId: formData.routeId ? Number.parseInt(formData.routeId) : undefined,
      wallTopId: formData.wallTopId ? Number.parseInt(formData.wallTopId) : undefined,
      pointsEarned,
      speedTime: formData.speedTime || undefined,
      checkpointReached: (formData.routeId || formData.wallTopId) ? formData.checkpoint as CheckpointProgress : undefined,
      completionCount: (formData.routeId || formData.wallTopId) ? completionCount : undefined,
    })

    const participant = participants.find((p) => p.id === Number.parseInt(formData.participantId))

    toast({
      title: "Climb Recorded!",
      description: `${pointsEarned} points added to ${participant?.name}`,
    })

    setFormData({
      participantId: formData.participantId,
      categoryId: formData.categoryId,
      routeId: "",
      wallTopId: "",
      speedTime: "",
      checkpoint: "topout",
      completionCount: "1",
    })
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-primary mb-4">Record a Climb</h1>
          <p className="text-muted-foreground">Log climbs and award points to participants</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Enter Climb Details</CardTitle>
            <CardDescription>Select the participant and what they climbed</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="participant">Participant</Label>
                <Select
                  value={formData.participantId}
                  onValueChange={(value) => setFormData({ ...formData, participantId: value })}
                >
                  <SelectTrigger id="participant">
                    <SelectValue placeholder="Select participant" />
                  </SelectTrigger>
                  <SelectContent>
                    {participants.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.name} - {p.totalScore} pts
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => {
                    setFormData({ ...formData, categoryId: value, routeId: "", wallTopId: "" })
                  }}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCategory?.name === "Routes" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="route">Route</Label>
                    <Select
                      value={formData.routeId}
                      onValueChange={(value) => setFormData({ ...formData, routeId: value })}
                    >
                      <SelectTrigger id="route">
                        <SelectValue placeholder="Select route" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoutes.map((r) => (
                          <SelectItem key={r.id} value={r.id.toString()}>
                            <div className="flex items-center gap-2">
                              {r.name} - {r.difficulty} ({r.points} pts)
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.routeId && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="checkpoint">Progress</Label>
                        <Select
                          value={formData.checkpoint}
                          onValueChange={(value) => setFormData({ ...formData, checkpoint: value as "checkpoint1" | "checkpoint2" | "topout" })}
                        >
                          <SelectTrigger id="checkpoint">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="checkpoint1">Checkpoint 1 (20%)</SelectItem>
                            <SelectItem value="checkpoint2">Checkpoint 2 (60%)</SelectItem>
                            <SelectItem value="topout">Top Out (100%)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="completionCount">Number of Completions</Label>
                        <Input
                          id="completionCount"
                          type="number"
                          min="1"
                          value={formData.completionCount}
                          onChange={(e) => setFormData({ ...formData, completionCount: e.target.value })}
                          placeholder="1"
                        />
                        <p className="text-xs text-muted-foreground">How many times completed in this session</p>
                      </div>
                    </>
                  )}
                </>
              )}

              {selectedCategory?.name === "Wall Tops" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="wall">Wall</Label>
                    <Select
                      value={formData.wallTopId}
                      onValueChange={(value) => setFormData({ ...formData, wallTopId: value })}
                    >
                      <SelectTrigger id="wall">
                        <SelectValue placeholder="Select wall" />
                      </SelectTrigger>
                      <SelectContent>
                        {wallTops.map((w) => (
                          <SelectItem key={w.id} value={w.id.toString()}>
                            <div className="flex items-center gap-2">
                              Wall {w.wallNumber} ({w.points} pts)
                              {w.difficulty && (
                                <Badge className={getDifficultyColor(w.difficulty)} style={{ fontSize: '0.7rem', padding: '0 4px' }}>
                                  {w.difficulty}
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.wallTopId && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="checkpoint">Progress</Label>
                        <Select
                          value={formData.checkpoint}
                          onValueChange={(value) => setFormData({ ...formData, checkpoint: value as "checkpoint1" | "checkpoint2" | "topout" })}
                        >
                          <SelectTrigger id="checkpoint">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="checkpoint1">Checkpoint 1 (20%)</SelectItem>
                            <SelectItem value="checkpoint2">Checkpoint 2 (60%)</SelectItem>
                            <SelectItem value="topout">Top Out (100%)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="completionCount">Number of Completions</Label>
                        <Input
                          id="completionCount"
                          type="number"
                          min="1"
                          value={formData.completionCount}
                          onChange={(e) => setFormData({ ...formData, completionCount: e.target.value })}
                          placeholder="1"
                        />
                        <p className="text-xs text-muted-foreground">How many times completed in this session</p>
                      </div>
                    </>
                  )}
                </>
              )}

              {selectedCategory?.name === "Speed" && (
                <div className="space-y-2">
                  <Label htmlFor="speedTime">Time (MM:SS:mm)</Label>
                  <Input
                    id="speedTime"
                    type="text"
                    value={formData.speedTime}
                    onChange={(e) => setFormData({ ...formData, speedTime: e.target.value })}
                    placeholder="01:23:45"
                    pattern="\d{1,2}:[0-5]\d:\d{2}"
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: Minutes:Seconds:Centiseconds (e.g., 01:23:45)
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Record Climb
              </Button>
            </form>
          </CardContent>
        </Card>

        {formData.participantId && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-foreground">Current Score</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const participant = participants.find((p) => p.id === Number.parseInt(formData.participantId))
                return (
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{participant?.name}</span>
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      {participant?.totalScore} points
                    </Badge>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
