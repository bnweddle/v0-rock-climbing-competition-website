"use client"

import type React from "react"

import { useState } from "react"
import { useCompetitionStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Pencil, Trash2, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export function BonusesManager() {
  const { bonuses, addBonus, updateBonus, deleteBonus } = useCompetitionStore()
  const { toast } = useToast()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingBonus, setEditingBonus] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    points: "100",
  })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()

    addBonus({
      name: formData.name,
      description: formData.description,
      points: Number.parseInt(formData.points),
      isActive: true,
    })

    toast({
      title: "Bonus Added",
      description: `${formData.name} has been added`,
    })

    setFormData({ name: "", description: "", points: "100" })
    setIsAddOpen(false)
  }

  const handleUpdate = (bonusId: number, e: React.FormEvent) => {
    e.preventDefault()

    updateBonus(bonusId, {
      name: formData.name,
      description: formData.description,
      points: Number.parseInt(formData.points),
    })

    toast({
      title: "Bonus Updated",
      description: "Bonus has been updated successfully",
    })

    setEditingBonus(null)
    setFormData({ name: "", description: "", points: "100" })
  }

  const handleDelete = (bonusId: number, bonusName: string) => {
    deleteBonus(bonusId)
    toast({
      title: "Bonus Deleted",
      description: `${bonusName} has been removed`,
    })
  }

  const handleToggleActive = (bonusId: number, isActive: boolean) => {
    updateBonus(bonusId, { isActive })
    toast({
      title: isActive ? "Bonus Activated" : "Bonus Deactivated",
      description: isActive ? "Bonus is now available" : "Bonus is now hidden",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Manage Bonuses</CardTitle>
            <CardDescription>Add, edit, or remove bonus point opportunities</CardDescription>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Bonus
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Bonus</DialogTitle>
                <DialogDescription>Create a new bonus point opportunity</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Bonus Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Speed Demon"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe how to earn this bonus"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    placeholder="100"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Bonus
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bonuses.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No bonuses yet. Add your first bonus!</p>
          )}

          {bonuses.map((bonus) => (
            <div key={bonus.id} className="flex items-start gap-4 rounded-lg border border-border p-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">{bonus.name}</h4>
                  <Badge variant="secondary">+{bonus.points} pts</Badge>
                  {!bonus.isActive && <Badge variant="outline">Hidden</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{bonus.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Switch
                    checked={bonus.isActive}
                    onCheckedChange={(checked) => handleToggleActive(bonus.id, checked)}
                  />
                  <Label className="text-sm text-muted-foreground">Active</Label>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Dialog
                  open={editingBonus === bonus.id}
                  onOpenChange={(open) => {
                    if (open) {
                      setEditingBonus(bonus.id)
                      setFormData({
                        name: bonus.name,
                        description: bonus.description,
                        points: bonus.points.toString(),
                      })
                    } else {
                      setEditingBonus(null)
                      setFormData({ name: "", description: "", points: "100" })
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
                      <DialogTitle>Edit Bonus</DialogTitle>
                      <DialogDescription>Update bonus details</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => handleUpdate(bonus.id, e)} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Bonus Name</Label>
                        <Input
                          id="edit-name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                          id="edit-description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                      <Button type="submit" className="w-full">
                        Update Bonus
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(bonus.id, bonus.name)}
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
