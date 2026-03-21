import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Define your creator profile",
    description:
      "Set your niche, audience, and content pillars so the copilot understands your world.",
  },
  {
    number: "02",
    title: "Paste audience comments",
    description:
      "Drop in real comments from a post. The copilot clusters them into demand signals.",
  },
  {
    number: "03",
    title: "Explore ranked experiments",
    description:
      "Get scored content ideas with hooks, formats, and rationales — ready to shoot.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="flex flex-col items-center px-6 pb-20 pt-24 text-center sm:pt-32">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          Creator Experiment Copilot
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Turn audience comments into your next best-performing video
        </h1>
        <p className="mt-6 max-w-lg text-lg text-muted">
          An AI-powered tool that extracts demand signals from comments and
          generates ranked content experiments — so you always know what to
          create next.
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/setup"
            className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            Get Started
          </Link>
          <Link
            href="/studio"
            className="rounded-full border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-surface-hover"
          >
            View Experiments
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-6">
        <hr className="border-border" />
      </div>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center text-sm font-medium uppercase tracking-widest text-muted">
          How it works
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="space-y-3">
              <span className="font-mono text-sm text-accent">
                {step.number}
              </span>
              <h3 className="text-lg font-medium">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Ready to find what your audience actually wants?
          </h2>
          <Link
            href="/setup"
            className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            Start Your First Experiment
          </Link>
        </div>
      </section>
    </>
  );
}
