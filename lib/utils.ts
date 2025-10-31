import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { WallDifficulty, CheckpointProgress } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Difficulty color mapping
export function getDifficultyColor(difficulty: WallDifficulty | string): string {
  if (difficulty === "Novice" || difficulty === "5.7" || difficulty === "5.8") {
    return "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30"
  }
  if (difficulty === "Beginner" || difficulty === "5.9") {
    return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30"
  }
  if (difficulty === "Intermediate" || difficulty === "5.10a") {
    return "bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30"
  }
  if (difficulty === "Hard" || difficulty === "5.10b" || difficulty === "5.10c") {
    return "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30"
  }
  if (difficulty === "Expert" || difficulty.startsWith("5.11") || difficulty.startsWith("5.12") || 
      difficulty.startsWith("5.13") || difficulty.startsWith("5.14") || difficulty.startsWith("5.15")) {
    return "bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30"
  }
  
  // Default for unknown difficulties
  return "bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30"
}

// Get route difficulty category
export function getRouteDifficultyCategory(difficulty: string): WallDifficulty {
  if (difficulty === "5.7" || difficulty === "5.8") return "Novice"
  if (difficulty === "5.9") return "Beginner"
  if (difficulty === "5.10a") return "Intermediate"
  if (difficulty === "5.10b" || difficulty === "5.10c") return "Hard"
  if (difficulty.startsWith("5.11") || difficulty.startsWith("5.12") || 
      difficulty.startsWith("5.13") || difficulty.startsWith("5.14") || difficulty.startsWith("5.15")) {
    return "Expert"
  }
  return "Beginner" // Default
}

// Calculate points with checkpoint multiplier
export function calculateCheckpointPoints(
  basePoints: number,
  checkpoint: CheckpointProgress,
  checkpoint1Multiplier: number = 0.2,
  checkpoint2Multiplier: number = 0.6
): number {
  if (checkpoint === "checkpoint1") {
    return Math.round(basePoints * checkpoint1Multiplier)
  }
  if (checkpoint === "checkpoint2") {
    return Math.round(basePoints * checkpoint2Multiplier)
  }
  // topout gets full points
  return basePoints
}

// Format speed time for display
export function formatSpeedTime(time: string): string {
  return time // Already in MM:SS:mm format
}

// Validate speed time format
export function validateSpeedTime(time: string): boolean {
  const regex = /^(\d{1,2}):([0-5]\d):(\d{2})$/
  return regex.test(time)
}
