"use client"

import type React from "react"

import { useState } from "react"
import { useCompetitionStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Heart, Camera, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function CostumeGallery() {
  const { participants, costumeVotes, addCostumeVote, updateParticipant } = useCompetitionStore()
  const { toast } = useToast()
  const [voterEmail, setVoterEmail] = useState("")
  const [uploadingFor, setUploadingFor] = useState<number | null>(null)
  const [photoUrl, setPhotoUrl] = useState("")

  const participantsWithCostumes = participants.filter((p) => p.costumePhotoUrl)

  const getVoteCount = (participantId: number) => {
    return costumeVotes.filter((v) => v.participantId === participantId).length
  }

  const hasVoted = (participantId: number, email: string) => {
    return costumeVotes.some((v) => v.participantId === participantId && v.voterEmail === email)
  }

  const handleVote = (participantId: number) => {
    if (!voterEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email to vote",
        variant: "destructive",
      })
      return
    }

    if (hasVoted(participantId, voterEmail)) {
      toast({
        title: "Already Voted",
        description: "You've already voted for this costume",
        variant: "destructive",
      })
      return
    }

    addCostumeVote(participantId, voterEmail)

    const participant = participants.find((p) => p.id === participantId)
    toast({
      title: "Vote Recorded!",
      description: `You voted for ${participant?.name}'s costume`,
    })
  }

  const handleUploadPhoto = (participantId: number, e: React.FormEvent) => {
    e.preventDefault()

    if (!photoUrl) {
      toast({
        title: "Photo URL Required",
        description: "Please enter a photo URL",
        variant: "destructive",
      })
      return
    }

    updateParticipant(participantId, { costumePhotoUrl: photoUrl })

    toast({
      title: "Photo Uploaded!",
      description: "Costume photo has been added",
    })

    setUploadingFor(null)
    setPhotoUrl("")
  }

  const sortedParticipants = [...participantsWithCostumes].sort((a, b) => getVoteCount(b.id) - getVoteCount(a.id))

  return (
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-5xl font-bold text-primary mb-4">Costume Contest</h1>
          <p className="text-muted-foreground text-lg">Vote for your favorite climbing costume!</p>
        </div>

        {/* Voting Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-foreground">How to Vote</CardTitle>
            <CardDescription>Support your favorite costume climber</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-foreground">
                Enter your email below and click the heart button on your favorite costume. You can vote once per
                costume!
              </p>
              <div className="space-y-2">
                <Label htmlFor="voterEmail">Your Email</Label>
                <Input
                  id="voterEmail"
                  type="email"
                  placeholder="your.email@example.com"
                  value={voterEmail}
                  onChange={(e) => setVoterEmail(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Costume Photo */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Camera className="h-5 w-5" />
              Upload Your Costume Photo
            </CardTitle>
            <CardDescription>Climbed in costume? Add your photo to the contest!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select your name and add a photo URL to participate in the costume contest
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {participants
                  .filter((p) => !p.costumePhotoUrl)
                  .map((participant) => (
                    <Dialog
                      key={participant.id}
                      open={uploadingFor === participant.id}
                      onOpenChange={(open) => {
                        if (!open) {
                          setUploadingFor(null)
                          setPhotoUrl("")
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                          onClick={() => setUploadingFor(participant.id)}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {participant.name}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Upload Costume Photo for {participant.name}</DialogTitle>
                          <DialogDescription>Add a photo URL to enter the costume contest</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={(e) => handleUploadPhoto(participant.id, e)} className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="photoUrl">Photo URL</Label>
                            <Input
                              id="photoUrl"
                              type="url"
                              placeholder="https://example.com/photo.jpg"
                              value={photoUrl}
                              onChange={(e) => setPhotoUrl(e.target.value)}
                              required
                            />
                            <p className="text-xs text-muted-foreground">
                              Upload your photo to an image hosting service and paste the URL here
                            </p>
                          </div>
                          <Button type="submit" className="w-full">
                            Add Photo
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Costume Gallery */}
        {sortedParticipants.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No costume photos yet. Be the first to upload!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedParticipants.map((participant) => {
              const votes = getVoteCount(participant.id)
              const voted = voterEmail ? hasVoted(participant.id, voterEmail) : false

              return (
                <Card key={participant.id} className="overflow-hidden">
                  <div className="aspect-square bg-muted relative">
                    <img
                      src={participant.costumePhotoUrl || "/placeholder.svg?height=400&width=400"}
                      alt={`${participant.name}'s costume`}
                      className="h-full w-full object-cover"
                    />
                    {votes > 0 && (
                      <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                        <Heart className="h-3 w-3 mr-1 fill-current" />
                        {votes}
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-foreground">{participant.name}</CardTitle>
                    <CardDescription>
                      {votes} {votes === 1 ? "vote" : "votes"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      variant={voted ? "secondary" : "default"}
                      disabled={voted || !voterEmail}
                      onClick={() => handleVote(participant.id)}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${voted ? "fill-current" : ""}`} />
                      {voted ? "Voted!" : "Vote for This Costume"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Top Costumes */}
        {sortedParticipants.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-foreground">Top Costumes</CardTitle>
              <CardDescription>Most voted costume climbers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedParticipants.slice(0, 5).map((participant, index) => {
                  const votes = getVoteCount(participant.id)
                  return (
                    <div key={participant.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <span className="font-bold text-primary">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{participant.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {votes} {votes === 1 ? "vote" : "votes"}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        <Heart className="h-3 w-3 mr-1 fill-current" />
                        {votes}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
