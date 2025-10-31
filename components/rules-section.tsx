"use client"

import { useCompetitionStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Award } from "lucide-react"

export function RulesSection() {
  const { ageTiers, categories, routes, wallTops, bonuses } = useCompetitionStore()

  return (
    <section id="rules" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl font-bold text-center text-primary mb-12">
            Competition Rules & Categories
          </h2>

          <div className="grid gap-8 md:grid-cols-2 mb-12">
            {/* Age Tiers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Age Tiers</CardTitle>
                <CardDescription>Choose your age category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {ageTiers.map((tier) => (
                  <div key={tier.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <span className="font-medium text-foreground">{tier.name}</span>
                    <Badge variant="secondary">
                      {tier.minAge !== null && tier.maxAge !== null
                        ? `${tier.minAge}-${tier.maxAge}`
                        : tier.minAge !== null
                          ? `${tier.minAge}+`
                          : "All ages"}
                    </Badge>
                  </div>
                ))}
                <p className="text-sm text-muted-foreground mt-4">Separate divisions for Male and Female climbers</p>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Competition Categories</CardTitle>
                <CardDescription>Three ways to compete</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="rounded-lg border border-border p-3">
                    <h4 className="font-semibold text-foreground">{category.name}</h4>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Wall Tops Scoring */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-foreground">Wall Tops Scoring</CardTitle>
              <CardDescription>Points for climbing walls 1-9</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-9">
                {wallTops.map((wall) => (
                  <div key={wall.id} className="flex flex-col items-center rounded-lg border border-border p-3">
                    <span className="text-lg font-bold text-primary">Wall {wall.wallNumber}</span>
                    <span className="text-sm text-muted-foreground">{wall.points} pts</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Routes Scoring */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-foreground">Routes Scoring</CardTitle>
              <CardDescription>Points by difficulty level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {routes.map((route) => (
                  <div key={route.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <span className="font-semibold text-foreground">{route.name}</span>
                      <Badge variant="outline" className="ml-2">
                        {route.difficulty}
                      </Badge>
                    </div>
                    <span className="font-bold text-primary">{route.points} pts</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bonus Points */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Star className="h-5 w-5 text-accent" />
                Bonus Points
              </CardTitle>
              <CardDescription>Earn extra points and stars for achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bonuses
                  .filter((b) => b.isActive)
                  .map((bonus) => (
                    <div key={bonus.id} className="flex items-start gap-3 rounded-lg border border-border p-4">
                      <Award className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{bonus.name}</h4>
                        <p className="text-sm text-muted-foreground">{bonus.description}</p>
                      </div>
                      <Badge variant="secondary" className="flex-shrink-0">
                        +{bonus.points} pts
                      </Badge>
                    </div>
                  ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Each bonus earned will display as a star on the leaderboard!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
