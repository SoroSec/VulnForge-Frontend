export interface Challenge {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  status: 'locked' | 'available' | 'completed'
  xpReward: number
  description: string
  vulnerabilityType: string
  objective: string
  vulnerableCode: string
  patchedCode: string
  exploitGuide: string
  explanation: string
  contractAddress?: string
}

export interface LeaderboardEntry {
  rank: number
  address: string
  username?: string
  xp: number
  solved: number
  lastActive: string
}

export interface WalletState {
  address: string | null
  connected: boolean
}
