"use client"

import type React from "react"

import { useState } from "react"
import { useCompetitionStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus } from "lucide-react"
import { getDifficultyColor, getRouteDifficultyCategory } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export function RoutesManager() {
  const { routes, categories, addRoute, updateRoute, deleteRoute } = useCompetitionStore()
  const { toast } = useToast()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingRoute, setEditingRoute] = useState<number | null>(null)

  const routesCategory = categories.find((c) => c.name === "Routes")
  const routesList = routes.filter((r) => r.categoryId === routesCategory?.id)

  const [formData, setFormData] = useState({
    name: "",
    difficulty: "",
    points: "",
    checkpoint1Multiplier: "0.2",
    checkpoint2Multiplier: "0.6",
  })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!routesCategory) return

    addRoute({
      categoryId: routesCategory.id,
      name: formData.name,
      difficulty: formData.difficulty,
      points: Number.parseInt(formData.points),
      displayOrder: routesList.length + 1,
      checkpoint1Multiplier: Number.parseFloat(formData.checkpoint1Multiplier),
      checkpoint2Multiplier: Number.parseFloat(formData.checkpoint2Multiplier),
    })

    toast({
      title: "Route Added",
      description: `${formData.name} has been added`,
    })

    setFormData({ name: "", difficulty: "", points: "", checkpoint1Multiplier: "0.2", checkpoint2Multiplier: "0.6" })
    setIsAddOpen(false)
  }

  const handleUpdate = (routeId: number, e: React.FormEvent) => {
    e.preventDefault()

    updateRoute(routeId, {
      name: formData.name,
      difficulty: formData.difficulty,
      points: Number.parseInt(formData.points),
      checkpoint1Multiplier: Number.parseFloat(formData.checkpoint1Multiplier),
      checkpoint2Multiplier: Number.parseFloat(formData.checkpoint2Multiplier),
    })

    toast({
      title: "Route Updated",
      description: "Route has been updated successfully",
    })

    setEditingRoute(null)
    setFormData({ name: "", difficulty: "", points: "", checkpoint1Multiplier: "0.2", checkpoint2Multiplier: "0.6" })
  }

  const handleDelete = (routeId: number, routeName: string) => {
    deleteRoute(routeId)
    toast({
      title: "Route Deleted",
      description: `${routeName} has been removed`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Manage Routes</CardTitle>
            <CardDescription>Add, edit, or remove climbing routes</CardDescription>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Route
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Route</DialogTitle>
                <DialogDescription>Create a new climbing route</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Route Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Route 7"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Input
                    id="difficulty"
                    placeholder="e.g., 5.10a"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    placeholder="e.g., 150"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cp1-multiplier">Checkpoint 1 Multiplier</Label>
                    <Input
                      id="cp1-multiplier"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      placeholder="0.2"
                      value={formData.checkpoint1Multiplier}
                      onChange={(e) => setFormData({ ...formData, checkpoint1Multiplier: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cp2-multiplier">Checkpoint 2 Multiplier</Label>
                    <Input
                      id="cp2-multiplier"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      placeholder="0.6"
                      value={formData.checkpoint2Multiplier}
                      onChange={(e) => setFormData({ ...formData, checkpoint2Multiplier: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Add Route
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {routesList.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No routes yet. Add your first route!</p>
          )}

          {routesList.map((route) => (
            <div key={route.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">{route.name}</h4>
                  <Badge className={getDifficultyColor(route.difficulty)}>{route.difficulty}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {route.points} points • CP1: {((route.checkpoint1Multiplier || 0.2) * 100).toFixed(0)}% • CP2: {((route.checkpoint2Multiplier || 0.6) * 100).toFixed(0)}%
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Dialog
                  open={editingRoute === route.id}
                  onOpenChange={(open) => {
                    if (open) {
                      setEditingRoute(route.id)
                      setFormData({
                        name: route.name,
                        difficulty: route.difficulty,
                        points: route.points.toString(),
                        checkpoint1Multiplier: (route.checkpoint1Multiplier || 0.2).toString(),
                        checkpoint2Multiplier: (route.checkpoint2Multiplier || 0.6).toString(),
                      })
                    } else {
                      setEditingRoute(null)
                      setFormData({ name: "", difficulty: "", points: "", checkpoint1Multiplier: "0.2", checkpoint2Multiplier: "0.6" })
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Route</DialogTitle>
                      <DialogDescription>Update route details</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => handleUpdate(route.id, e)} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Route Name</Label>
                        <Input
                          id="edit-name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-difficulty">Difficulty</Label>
                        <Input
                          id="edit-difficulty"
                          value={formData.difficulty}
                          onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-points">Points</Label>
                        <Input
                          id="edit-points"
                          type="number"
                          value={formData.points}
                          onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-cp1-multiplier">Checkpoint 1 Multiplier</Label>
                          <Input
                            id="edit-cp1-multiplier"
                            type="number"
                            step="0.01"
                            min="0"
                            max="1"
                            value={formData.checkpoint1Multiplier}
                            onChange={(e) => setFormData({ ...formData, checkpoint1Multiplier: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-cp2-multiplier">Checkpoint 2 Multiplier</Label>
                          <Input
                            id="edit-cp2-multiplier"
                            type="number"
                            step="0.01"
                            min="0"
                            max="1"
                            value={formData.checkpoint2Multiplier}
                            onChange={(e) => setFormData({ ...formData, checkpoint2Multiplier: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full">
                        Update Route
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(route.id, route.name)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
