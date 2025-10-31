"use client"

import type React from "react"

import { useState } from "react"
import { useCompetitionStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function EntryForm() {
  const { ageTiers, addParticipant } = useCompetitionStore()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    ageTierId: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.age || !formData.gender || !formData.ageTierId) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields",
        variant: "destructive",
      })
      return
    }

    addParticipant({
      name: formData.name,
      email: formData.email,
      age: Number.parseInt(formData.age),
      gender: formData.gender as "male" | "female" | "other",
      ageTierId: Number.parseInt(formData.ageTierId),
    })

    toast({
      title: "Registration Complete!",
      description: `Welcome to the Rocktober Challenge, ${formData.name}!`,
    })

    setFormData({
      name: "",
      email: "",
      age: "",
      gender: "",
      ageTierId: "",
    })
  }

  return (
    <section id="enter" className="py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-3xl text-primary">Enter the Challenge</CardTitle>
              <CardDescription>Sign up to start climbing and competing</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Your age"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ageTier">Age Category</Label>
                  <Select
                    value={formData.ageTierId}
                    onValueChange={(value) => setFormData({ ...formData, ageTierId: value })}
                  >
                    <SelectTrigger id="ageTier">
                      <SelectValue placeholder="Select your age category" />
                    </SelectTrigger>
                    <SelectContent>
                      {ageTiers.map((tier) => (
                        <SelectItem key={tier.id} value={tier.id.toString()}>
                          {tier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Register for Rocktober Challenge
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
