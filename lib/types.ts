export interface CompetitionSettings {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string
}

export interface AgeTier {
  id: number
  name: string
  minAge: number | null
  maxAge: number | null
  displayOrder: number
}

export interface Category {
  id: number
  name: string
  description: string
  displayOrder: number
}

export interface Route {
  id: number
  categoryId: number
  name: string
  difficulty: string
  points: number
  displayOrder: number
}

export interface WallTop {
  id: number
  wallNumber: number
  points: number
}

export interface Bonus {
  id: number
  name: string
  description: string
  points: number
  isActive: boolean
}

export interface Participant {
  id: number
  name: string
  email: string
  age: number
  gender: "male" | "female" | "other"
  ageTierId: number
  costumePhotoUrl?: string
  totalScore: number
  createdAt: string
  bonuses?: Bonus[]
  climbs?: ParticipantClimb[]
  costumeVotes?: number
}

export interface ParticipantClimb {
  id: number
  participantId: number
  categoryId: number
  routeId?: number
  wallTopId?: number
  pointsEarned: number
  completedAt: string
}

export interface ParticipantBonus {
  id: number
  participantId: number
  bonusId: number
  awardedAt: string
}

export interface CostumeVote {
  id: number
  participantId: number
  voterEmail: string
  votedAt: string
}
