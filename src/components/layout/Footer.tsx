import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-[#1e2d4a] bg-[#0a0e1a] py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#00ff88]" />
            <span className="font-mono text-sm text-slate-400">
              <span className="text-white">VulnForge</span> by{' '}
              <span className="text-[#00ff88]">SoroSec</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
            <Link href="/dashboard" className="hover:text-slate-300 transition-colors">Challenges</Link>
            <Link href="/leaderboard" className="hover:text-slate-300 transition-colors">Leaderboard</Link>
            <span>Stellar Testnet</span>
          </div>

          <p className="text-xs font-mono text-slate-600">
            Break it to understand it.
          </p>
        </div>
      </div>
    </footer>
  )
}
