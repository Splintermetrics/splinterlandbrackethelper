import { UsernameForm } from "@/components/UsernameForm";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
      <div className="rounded-3xl border border-line bg-panel p-8 shadow-2xl shadow-black/30">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Splintermetrics</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight">Bracket Helper</h1>
        <p className="mt-4 max-w-2xl text-lg text-textSoft">
          Drop in a Splinterlands username and see which proposed Modern bracket fits the collection best,
          including heatmap strength by splinter, scaled-down overflow, and excluded underlevelled cards.
        </p>
        <UsernameForm />
      </div>
    </main>
  );
}
