import type { LeaderboardEntry } from '../types'
import { mockLeaderboard } from '../mock/leaderboard'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!API_URL) return mockLeaderboard
  const res = await fetch(`${API_URL}/leaderboard`)
  if (!res.ok) throw new Error('Failed to fetch leaderboard')
  return res.json()
}
