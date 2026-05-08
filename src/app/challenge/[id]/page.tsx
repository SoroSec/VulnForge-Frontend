export default async function ChallengePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold font-mono text-white">
        Challenge: <span className="text-[#00ff88]">{id}</span>
      </h1>
      <p className="mt-2 text-slate-400 font-mono text-sm">Coming in Phase 6.</p>
    </div>
  )
}
