import { Bug, Code2, Trophy } from 'lucide-react'

const features = [
  {
    icon: Bug,
    title: 'Learn by Exploiting',
    description:
      'Each challenge presents a real vulnerability pattern found in production contracts. Read the code, find the flaw, write the exploit.',
    accent: '#00ff88',
  },
  {
    icon: Code2,
    title: 'Real Soroban Contracts',
    description:
      'All contracts are written in Rust and deployed to Stellar testnet. No simulations — you run actual transactions against live code.',
    accent: '#00d4ff',
  },
  {
    icon: Trophy,
    title: 'Track Your Progress',
    description:
      'Earn XP for every solved challenge, climb the leaderboard, and build a verifiable on-chain record of your security skills.',
    accent: '#ffaa00',
  },
]

export default function FeatureCards() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white">
            Why <span className="text-[#00ff88]">VulnForge</span>?
          </h2>
          <p className="mt-3 text-slate-400 font-mono text-sm">
            The fastest way to go from Soroban developer to Soroban security expert.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="rounded-lg border border-[#1e2d4a] bg-[#0f1629] p-6 hover:border-[#1e2d4a]/80 transition-all group"
                style={{ '--accent': f.accent } as React.CSSProperties}
              >
                <div
                  className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded border"
                  style={{
                    borderColor: `${f.accent}30`,
                    backgroundColor: `${f.accent}08`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: f.accent }} />
                </div>
                <h3 className="font-mono font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
