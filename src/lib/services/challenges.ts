import type { Challenge } from '../types'
import { mockChallenges } from '../mock/challenges'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getChallenges(): Promise<Challenge[]> {
  if (!API_URL) return mockChallenges
  const res = await fetch(`${API_URL}/challenges`)
  if (!res.ok) throw new Error('Failed to fetch challenges')
  return res.json()
}

export async function getChallengeById(id: string): Promise<Challenge | null> {
  if (!API_URL) return mockChallenges.find((c) => c.id === id) ?? null
  const res = await fetch(`${API_URL}/challenges/${id}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch challenge')
  return res.json()
}
