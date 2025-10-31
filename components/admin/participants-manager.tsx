"use client"

import { useCompetitionStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Star, Award } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function ParticipantsManager() {
  const { participants, bonuses, ageTiers, getParticipantWithDetails, awardBonus, removeBonus } = useCompetitionStore()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredParticipants = participants.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Manage Participants</CardTitle>
        <CardDescription>View and manage participant bonuses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search participants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          {filteredParticipants.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No participants found</p>
          )}

          {filteredParticipants.map((participant) => {
            const details = getParticipantWithDetails(participant.id)
            const tier = ageTiers.find((t) => t.id === participant.ageTierId)

            return (
              <div key={participant.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{participant.name}</h4>
                    <Badge variant="outline">{participant.gender}</Badge>
                    <Badge variant="secondary">{tier?.name}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{participant.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-medium text-foreground">Score: {participant.totalScore}</span>
                    {details?.bonuses && details.bonuses.length > 0 && (
                      <div className="flex items-center gap-0.5">
                        {details.bonuses.map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Award className="h-4 w-4 mr-2" />
                      Manage Bonuses
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Manage Bonuses for {participant.name}</DialogTitle>
                      <DialogDescription>Award or remove bonus points</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      {bonuses
                        .filter((b) => b.isActive)
                        .map((bonus) => {
                          const hasBonus = details?.bonuses?.some((b) => b.id === bonus.id)
                          return (
                            <div key={bonus.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                              <Checkbox
                                id={`bonus-${bonus.id}`}
                                checked={hasBonus}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    awardBonus(participant.id, bonus.id)
                                  } else {
                                    removeBonus(participant.id, bonus.id)
                                  }
                                }}
                              />
                              <div className="flex-1">
                                <Label htmlFor={`bonus-${bonus.id}`} className="font-medium cursor-pointer">
                                  {bonus.name}
                                </Label>
                                <p className="text-sm text-muted-foreground">{bonus.description}</p>
                                <Badge variant="secondary" className="mt-1">
                                  +{bonus.points} pts
                                </Badge>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
