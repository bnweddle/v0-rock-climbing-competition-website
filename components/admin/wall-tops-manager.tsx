"use client"

import { useCompetitionStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function WallTopsManager() {
  const { wallTops, updateWallTop } = useCompetitionStore()
  const { toast } = useToast()

  const handleUpdate = (wallNumber: number, points: number) => {
    updateWallTop(wallNumber, points)
    toast({
      title: "Wall Top Updated",
      description: `Wall ${wallNumber} now awards ${points} points`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Manage Wall Tops</CardTitle>
        <CardDescription>Set points for each wall (1-9)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wallTops.map((wall) => (
            <div key={wall.id} className="rounded-lg border border-border p-4">
              <Label htmlFor={`wall-${wall.wallNumber}`} className="text-base font-semibold text-foreground">
                Wall {wall.wallNumber}
              </Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  id={`wall-${wall.wallNumber}`}
                  type="number"
                  defaultValue={wall.points}
                  onBlur={(e) => {
                    const newPoints = Number.parseInt(e.target.value)
                    if (newPoints !== wall.points && !Number.isNaN(newPoints)) {
                      handleUpdate(wall.wallNumber, newPoints)
                    }
                  }}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">pts</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
