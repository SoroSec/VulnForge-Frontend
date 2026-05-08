'use client'

import Link from 'next/link'
import { Terminal, ChevronRight, Zap } from 'lucide-react'

const terminalLines = [
  { prefix: '$', text: 'vulnforge connect --wallet freighter', color: 'text-slate-400' },
  { prefix: '>', text: 'Wallet connected: GBXG...K7YZ', color: 'text-[#00ff88]' },
  { prefix: '$', text: 'vulnforge exploit reentrancy-vault', color: 'text-slate-400' },
  { prefix: '>', text: 'Running exploit...', color: 'text-[#00d4ff]' },
  { prefix: '>', text: 'Vault drained! +100 XP', color: 'text-[#00ff88]' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid py-20 sm:py-28">
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[800px] rounded-full bg-[#00ff88]/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — copy */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00ff88]/20 bg-[#00ff88]/5 px-3 py-1 text-xs font-mono text-[#00ff88]">
              <Zap className="w-3 h-3" />
              Soroban Smart Contract Security
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-mono leading-tight text-white">
              Learn by{' '}
              <span className="text-[#00ff88] text-glow-green">breaking</span>
              <br />
              smart contracts
            </h1>

            <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-lg">
              VulnForge is a hands-on security lab for Soroban developers. Study intentionally
              vulnerable contracts, run real exploits on testnet, and level up your security skills.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded border border-[#00ff88] bg-[#00ff88]/10 px-5 py-2.5 text-sm font-mono font-semibold text-[#00ff88] hover:bg-[#00ff88]/20 transition-all glow-green"
              >
                Start Hacking
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded border border-[#1e2d4a] bg-[#0f1629] px-5 py-2.5 text-sm font-mono text-slate-300 hover:border-slate-500 hover:text-white transition-all"
              >
                View Challenges
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-6 text-sm font-mono text-slate-500">
              <span><span className="text-[#00ff88]">5</span> Challenges</span>
              <span><span className="text-[#00d4ff]">3</span> Categories</span>
              <span><span className="text-white">Testnet</span> Live</span>
            </div>
          </div>

          {/* Right — terminal */}
          <div className="rounded-lg border border-[#1e2d4a] bg-[#0f1629] overflow-hidden glow-green">
            {/* Terminal title bar */}
            <div className="flex items-center gap-2 border-b border-[#1e2d4a] px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ff4444]/60" />
                <span className="w-3 h-3 rounded-full bg-[#ffaa00]/60" />
                <span className="w-3 h-3 rounded-full bg-[#00ff88]/60" />
              </div>
              <div className="flex items-center gap-1.5 ml-2">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-mono text-slate-500">vulnforge — bash</span>
              </div>
            </div>

            {/* Terminal body */}
            <div className="p-4 space-y-2 font-mono text-sm min-h-[200px]">
              {terminalLines.map((line, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-[#00ff88] select-none">{line.prefix}</span>
                  <span className={line.color}>{line.text}</span>
                </div>
              ))}
              <div className="flex gap-2">
                <span className="text-[#00ff88] select-none">$</span>
                <span className="text-slate-400 cursor-blink" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
