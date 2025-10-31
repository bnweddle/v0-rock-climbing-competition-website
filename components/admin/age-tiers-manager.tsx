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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export function AgeTiersManager() {
  const { ageTiers, addAgeTier, updateAgeTier, deleteAgeTier } = useCompetitionStore()
  const { toast } = useToast()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingTier, setEditingTier] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    minAge: "",
    maxAge: "",
  })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()

    addAgeTier({
      name: formData.name,
      minAge: formData.minAge ? Number.parseInt(formData.minAge) : null,
      maxAge: formData.maxAge ? Number.parseInt(formData.maxAge) : null,
      displayOrder: ageTiers.length + 1,
    })

    toast({
      title: "Age Tier Added",
      description: `${formData.name} has been added`,
    })

    setFormData({ name: "", minAge: "", maxAge: "" })
    setIsAddOpen(false)
  }

  const handleUpdate = (tierId: number, e: React.FormEvent) => {
    e.preventDefault()

    updateAgeTier(tierId, {
      name: formData.name,
      minAge: formData.minAge ? Number.parseInt(formData.minAge) : null,
      maxAge: formData.maxAge ? Number.parseInt(formData.maxAge) : null,
    })

    toast({
      title: "Age Tier Updated",
      description: "Age tier has been updated successfully",
    })

    setEditingTier(null)
    setFormData({ name: "", minAge: "", maxAge: "" })
  }

  const handleDelete = (tierId: number, tierName: string) => {
    deleteAgeTier(tierId)
    toast({
      title: "Age Tier Deleted",
      description: `${tierName} has been removed`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Manage Age Tiers</CardTitle>
            <CardDescription>Add, edit, or remove age categories</CardDescription>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Age Tier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Age Tier</DialogTitle>
                <DialogDescription>Create a new age category</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tier Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Youth (Under 18)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minAge">Min Age</Label>
                    <Input
                      id="minAge"
                      type="number"
                      placeholder="e.g., 0"
                      value={formData.minAge}
                      onChange={(e) => setFormData({ ...formData, minAge: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAge">Max Age</Label>
                    <Input
                      id="maxAge"
                      type="number"
                      placeholder="e.g., 17"
                      value={formData.maxAge}
                      onChange={(e) => setFormData({ ...formData, maxAge: e.target.value })}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Leave min/max empty for open-ended ranges</p>
                <Button type="submit" className="w-full">
                  Add Age Tier
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {ageTiers.map((tier) => (
            <div key={tier.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">{tier.name}</h4>
                  <Badge variant="secondary">
                    {tier.minAge !== null && tier.maxAge !== null
                      ? `${tier.minAge}-${tier.maxAge}`
                      : tier.minAge !== null
                        ? `${tier.minAge}+`
                        : tier.maxAge !== null
                          ? `Up to ${tier.maxAge}`
                          : "All ages"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Dialog
                  open={editingTier === tier.id}
                  onOpenChange={(open) => {
                    if (open) {
                      setEditingTier(tier.id)
                      setFormData({
                        name: tier.name,
                        minAge: tier.minAge?.toString() || "",
                        maxAge: tier.maxAge?.toString() || "",
                      })
                    } else {
                      setEditingTier(null)
                      setFormData({ name: "", minAge: "", maxAge: "" })
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
                      <DialogTitle>Edit Age Tier</DialogTitle>
                      <DialogDescription>Update age tier details</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => handleUpdate(tier.id, e)} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Tier Name</Label>
                        <Input
                          id="edit-name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-minAge">Min Age</Label>
                          <Input
                            id="edit-minAge"
                            type="number"
                            value={formData.minAge}
                            onChange={(e) => setFormData({ ...formData, minAge: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-maxAge">Max Age</Label>
                          <Input
                            id="edit-maxAge"
                            type="number"
                            value={formData.maxAge}
                            onChange={(e) => setFormData({ ...formData, maxAge: e.target.value })}
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full">
                        Update Age Tier
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(tier.id, tier.name)}
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
