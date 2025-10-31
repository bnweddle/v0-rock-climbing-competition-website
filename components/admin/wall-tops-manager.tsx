"use client"

import { useState } from "react"
import { useCompetitionStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getDifficultyColor } from "@/lib/utils"
import type { WallDifficulty } from "@/lib/types"

export function WallTopsManager() {
  const { wallTops, updateWallTop } = useCompetitionStore()
  const { toast } = useToast()
  const [editingWall, setEditingWall] = useState<number | null>(null)

  const difficultyOptions: WallDifficulty[] = ["Novice", "Beginner", "Intermediate", "Hard", "Expert"]

  const handleUpdate = (
    wallNumber: number, 
    updates: { 
      points?: number
      difficulty?: WallDifficulty
      checkpoint1Multiplier?: number
      checkpoint2Multiplier?: number
    }
  ) => {
    updateWallTop(wallNumber, updates)
    toast({
      title: "Wall Top Updated",
      description: `Wall ${wallNumber} has been updated`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Manage Wall Tops</CardTitle>
        <CardDescription>Set points, difficulty, and checkpoint multipliers for each wall (1-9)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          {wallTops.map((wall) => (
            <div key={wall.id} className="rounded-lg border border-border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold text-foreground">
                  Wall {wall.wallNumber}
                </Label>
                {wall.difficulty && (
                  <Badge className={getDifficultyColor(wall.difficulty)}>
                    {wall.difficulty}
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor={`wall-${wall.wallNumber}-points`} className="text-sm">
                    Base Points
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id={`wall-${wall.wallNumber}-points`}
                      type="number"
                      defaultValue={wall.points}
                      onBlur={(e) => {
                        const newPoints = Number.parseInt(e.target.value)
                        if (newPoints !== wall.points && !Number.isNaN(newPoints)) {
                          handleUpdate(wall.wallNumber, { points: newPoints })
                        }
                      }}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">pts</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor={`wall-${wall.wallNumber}-difficulty`} className="text-sm">
                    Difficulty
                  </Label>
                  <Select
                    value={wall.difficulty || ""}
                    onValueChange={(value) => handleUpdate(wall.wallNumber, { difficulty: value as WallDifficulty })}
                  >
                    <SelectTrigger id={`wall-${wall.wallNumber}-difficulty`} className="mt-1">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyOptions.map((diff) => (
                        <SelectItem key={diff} value={diff}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getDifficultyColor(diff).split(' ')[0].replace('/20', '')}`} />
                            {diff}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`wall-${wall.wallNumber}-cp1`} className="text-sm">
                      CP1 Multiplier
                    </Label>
                    <Input
                      id={`wall-${wall.wallNumber}-cp1`}
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      defaultValue={wall.checkpoint1Multiplier || 0.2}
                      onBlur={(e) => {
                        const value = Number.parseFloat(e.target.value)
                        if (!Number.isNaN(value)) {
                          handleUpdate(wall.wallNumber, { checkpoint1Multiplier: value })
                        }
                      }}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`wall-${wall.wallNumber}-cp2`} className="text-sm">
                      CP2 Multiplier
                    </Label>
                    <Input
                      id={`wall-${wall.wallNumber}-cp2`}
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      defaultValue={wall.checkpoint2Multiplier || 0.6}
                      onBlur={(e) => {
                        const value = Number.parseFloat(e.target.value)
                        if (!Number.isNaN(value)) {
                          handleUpdate(wall.wallNumber, { checkpoint2Multiplier: value })
                        }
                      }}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
