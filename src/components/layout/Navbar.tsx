'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/leaderboard', label: 'Leaderboard' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b border-[#1e2d4a] bg-[#0a0e1a]/90 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-8 h-8 rounded border border-[#00ff88]/30 bg-[#00ff88]/5 group-hover:border-[#00ff88]/60 transition-colors">
              <Shield className="w-4 h-4 text-[#00ff88]" />
            </div>
            <span className="font-mono font-bold text-white">
              Vuln<span className="text-[#00ff88]">Forge</span>
            </span>
            <span className="hidden sm:block text-xs text-[#4a5568] font-mono">by SoroSec</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-1.5 rounded text-sm font-mono transition-colors',
                  pathname === link.href
                    ? 'text-[#00ff88] bg-[#00ff88]/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2035]'
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Connect Wallet placeholder — wired in Phase 7 */}
            <button className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#00ff88]/30 bg-[#00ff88]/5 text-[#00ff88] text-sm font-mono hover:bg-[#00ff88]/10 hover:border-[#00ff88]/60 transition-all">
              <Terminal className="w-3.5 h-3.5" />
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
