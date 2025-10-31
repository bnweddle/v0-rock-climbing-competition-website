"use client"

import type React from "react"

import { useState } from "react"
import { useCompetitionStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2 } from "lucide-react"

export function ScoreEntry() {
  const { participants, categories, routes, wallTops, addClimb } = useCompetitionStore()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    participantId: "",
    categoryId: "",
    routeId: "",
    wallTopId: "",
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

    let pointsEarned = 0

    if (formData.routeId) {
      const route = routes.find((r) => r.id === Number.parseInt(formData.routeId))
      pointsEarned = route?.points || 0
    } else if (formData.wallTopId) {
      const wall = wallTops.find((w) => w.id === Number.parseInt(formData.wallTopId))
      pointsEarned = wall?.points || 0
    }

    addClimb({
      participantId: Number.parseInt(formData.participantId),
      categoryId: Number.parseInt(formData.categoryId),
      routeId: formData.routeId ? Number.parseInt(formData.routeId) : undefined,
      wallTopId: formData.wallTopId ? Number.parseInt(formData.wallTopId) : undefined,
      pointsEarned,
    })

    const participant = participants.find((p) => p.id === Number.parseInt(formData.participantId))

    toast({
      title: "Climb Recorded!",
      description: `${pointsEarned} points added to ${participant?.name}`,
    })

    setFormData({
      participantId: formData.participantId,
      categoryId: "",
      routeId: "",
      wallTopId: "",
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
                          {r.name} - {r.difficulty} ({r.points} pts)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedCategory?.name === "Wall Tops" && (
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
                          Wall {w.wallNumber} ({w.points} pts)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
