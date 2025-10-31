"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  AgeTier,
  Category,
  Route,
  WallTop,
  Bonus,
  Participant,
  ParticipantClimb,
  ParticipantBonus,
  CostumeVote,
} from "./types"

interface CompetitionStore {
  // Settings
  ageTiers: AgeTier[]
  categories: Category[]
  routes: Route[]
  wallTops: WallTop[]
  bonuses: Bonus[]

  // Participants
  participants: Participant[]
  participantClimbs: ParticipantClimb[]
  participantBonuses: ParticipantBonus[]
  costumeVotes: CostumeVote[]

  // Actions - Settings
  addAgeTier: (tier: Omit<AgeTier, "id">) => void
  updateAgeTier: (id: number, tier: Partial<AgeTier>) => void
  deleteAgeTier: (id: number) => void

  addCategory: (category: Omit<Category, "id">) => void
  updateCategory: (id: number, category: Partial<Category>) => void

  addRoute: (route: Omit<Route, "id">) => void
  updateRoute: (id: number, route: Partial<Route>) => void
  deleteRoute: (id: number) => void

  updateWallTop: (wallNumber: number, points: number) => void

  addBonus: (bonus: Omit<Bonus, "id">) => void
  updateBonus: (id: number, bonus: Partial<Bonus>) => void
  deleteBonus: (id: number) => void

  // Actions - Participants
  addParticipant: (participant: Omit<Participant, "id" | "totalScore" | "createdAt">) => number
  updateParticipant: (id: number, participant: Partial<Participant>) => void

  addClimb: (climb: Omit<ParticipantClimb, "id" | "completedAt">) => void

  awardBonus: (participantId: number, bonusId: number) => void
  removeBonus: (participantId: number, bonusId: number) => void

  addCostumeVote: (participantId: number, voterEmail: string) => void

  // Computed
  getParticipantWithDetails: (id: number) => Participant | undefined
  getLeaderboard: () => Participant[]
}

let nextId = 1000

export const useCompetitionStore = create<CompetitionStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ageTiers: [
        { id: 1, name: "Youth (Under 18)", minAge: 0, maxAge: 17, displayOrder: 1 },
        { id: 2, name: "Adult (18-39)", minAge: 18, maxAge: 39, displayOrder: 2 },
        { id: 3, name: "Masters (40+)", minAge: 40, maxAge: null, displayOrder: 3 },
      ],
      categories: [
        { id: 1, name: "Wall Tops", description: "Climb walls 1-9", displayOrder: 1 },
        { id: 2, name: "Routes", description: "Climb routes from 5.6 to 5.11c", displayOrder: 2 },
        { id: 3, name: "Speed", description: "Speed climbing challenges", displayOrder: 3 },
      ],
      routes: [
        { id: 1, categoryId: 2, name: "Route 1", difficulty: "5.6", points: 50, displayOrder: 1 },
        { id: 2, categoryId: 2, name: "Route 2", difficulty: "5.7", points: 75, displayOrder: 2 },
        { id: 3, categoryId: 2, name: "Route 3", difficulty: "5.8", points: 100, displayOrder: 3 },
        { id: 4, categoryId: 2, name: "Route 4", difficulty: "5.9", points: 125, displayOrder: 4 },
        { id: 5, categoryId: 2, name: "Route 5", difficulty: "5.10a", points: 150, displayOrder: 5 },
        { id: 6, categoryId: 2, name: "Route 6", difficulty: "5.11c", points: 200, displayOrder: 6 },
      ],
      wallTops: Array.from({ length: 9 }, (_, i) => ({
        id: i + 1,
        wallNumber: i + 1,
        points: 25,
      })),
      bonuses: [
        {
          id: 1,
          name: "Costume Climber",
          description: "Climb in costume and submit photo",
          points: 100,
          isActive: true,
        },
        { id: 2, name: "Wall Master", description: "Climb all walls (1-9) at least once", points: 100, isActive: true },
        { id: 3, name: "5.7 Crusher", description: "Complete all 5.7 routes", points: 100, isActive: true },
        { id: 4, name: "5.8 Crusher", description: "Complete all 5.8 routes", points: 100, isActive: true },
        { id: 5, name: "5.9 Crusher", description: "Complete all 5.9 routes", points: 100, isActive: true },
      ],
      participants: [],
      participantClimbs: [],
      participantBonuses: [],
      costumeVotes: [],

      // Settings Actions
      addAgeTier: (tier) =>
        set((state) => ({
          ageTiers: [...state.ageTiers, { ...tier, id: nextId++ }],
        })),

      updateAgeTier: (id, tier) =>
        set((state) => ({
          ageTiers: state.ageTiers.map((t) => (t.id === id ? { ...t, ...tier } : t)),
        })),

      deleteAgeTier: (id) =>
        set((state) => ({
          ageTiers: state.ageTiers.filter((t) => t.id !== id),
        })),

      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, { ...category, id: nextId++ }],
        })),

      updateCategory: (id, category) =>
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...category } : c)),
        })),

      addRoute: (route) =>
        set((state) => ({
          routes: [...state.routes, { ...route, id: nextId++ }],
        })),

      updateRoute: (id, route) =>
        set((state) => ({
          routes: state.routes.map((r) => (r.id === id ? { ...r, ...route } : r)),
        })),

      deleteRoute: (id) =>
        set((state) => ({
          routes: state.routes.filter((r) => r.id !== id),
        })),

      updateWallTop: (wallNumber, points) =>
        set((state) => ({
          wallTops: state.wallTops.map((w) => (w.wallNumber === wallNumber ? { ...w, points } : w)),
        })),

      addBonus: (bonus) =>
        set((state) => ({
          bonuses: [...state.bonuses, { ...bonus, id: nextId++ }],
        })),

      updateBonus: (id, bonus) =>
        set((state) => ({
          bonuses: state.bonuses.map((b) => (b.id === id ? { ...b, ...bonus } : b)),
        })),

      deleteBonus: (id) =>
        set((state) => ({
          bonuses: state.bonuses.filter((b) => b.id !== id),
        })),

      // Participant Actions
      addParticipant: (participant) => {
        const id = nextId++
        set((state) => ({
          participants: [
            ...state.participants,
            {
              ...participant,
              id,
              totalScore: 0,
              createdAt: new Date().toISOString(),
            },
          ],
        }))
        return id
      },

      updateParticipant: (id, participant) =>
        set((state) => ({
          participants: state.participants.map((p) => (p.id === id ? { ...p, ...participant } : p)),
        })),

      addClimb: (climb) => {
        const newClimb = {
          ...climb,
          id: nextId++,
          completedAt: new Date().toISOString(),
        }

        set((state) => {
          const updatedClimbs = [...state.participantClimbs, newClimb]
          const participant = state.participants.find((p) => p.id === climb.participantId)

          if (participant) {
            const totalScore = participant.totalScore + climb.pointsEarned
            return {
              participantClimbs: updatedClimbs,
              participants: state.participants.map((p) => (p.id === climb.participantId ? { ...p, totalScore } : p)),
            }
          }

          return { participantClimbs: updatedClimbs }
        })
      },

      awardBonus: (participantId, bonusId) => {
        const bonus = get().bonuses.find((b) => b.id === bonusId)
        if (!bonus) return

        set((state) => {
          const exists = state.participantBonuses.some(
            (pb) => pb.participantId === participantId && pb.bonusId === bonusId,
          )

          if (exists) return state

          const newBonus = {
            id: nextId++,
            participantId,
            bonusId,
            awardedAt: new Date().toISOString(),
          }

          const participant = state.participants.find((p) => p.id === participantId)
          if (participant) {
            return {
              participantBonuses: [...state.participantBonuses, newBonus],
              participants: state.participants.map((p) =>
                p.id === participantId ? { ...p, totalScore: p.totalScore + bonus.points } : p,
              ),
            }
          }

          return { participantBonuses: [...state.participantBonuses, newBonus] }
        })
      },

      removeBonus: (participantId, bonusId) => {
        const bonus = get().bonuses.find((b) => b.id === bonusId)
        if (!bonus) return

        set((state) => {
          const participant = state.participants.find((p) => p.id === participantId)
          if (participant) {
            return {
              participantBonuses: state.participantBonuses.filter(
                (pb) => !(pb.participantId === participantId && pb.bonusId === bonusId),
              ),
              participants: state.participants.map((p) =>
                p.id === participantId ? { ...p, totalScore: p.totalScore - bonus.points } : p,
              ),
            }
          }

          return state
        })
      },

      addCostumeVote: (participantId, voterEmail) => {
        set((state) => {
          const exists = state.costumeVotes.some(
            (cv) => cv.participantId === participantId && cv.voterEmail === voterEmail,
          )

          if (exists) return state

          return {
            costumeVotes: [
              ...state.costumeVotes,
              {
                id: nextId++,
                participantId,
                voterEmail,
                votedAt: new Date().toISOString(),
              },
            ],
          }
        })
      },

      // Computed
      getParticipantWithDetails: (id) => {
        const state = get()
        const participant = state.participants.find((p) => p.id === id)
        if (!participant) return undefined

        const bonuses = state.participantBonuses
          .filter((pb) => pb.participantId === id)
          .map((pb) => state.bonuses.find((b) => b.id === pb.bonusId))
          .filter(Boolean) as Bonus[]

        const climbs = state.participantClimbs.filter((pc) => pc.participantId === id)

        const costumeVotes = state.costumeVotes.filter((cv) => cv.participantId === id).length

        return {
          ...participant,
          bonuses,
          climbs,
          costumeVotes,
        }
      },

      getLeaderboard: () => {
        const state = get()
        return state.participants
          .map((p) => state.getParticipantWithDetails(p.id)!)
          .sort((a, b) => b.totalScore - a.totalScore)
      },
    }),
    {
      name: "rocktober-competition-storage",
    },
  ),
)
