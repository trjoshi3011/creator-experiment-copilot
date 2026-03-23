import StudioView from "@/components/studio-view";

export default function StudioPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">
        Step 3
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Experiment Studio
      </h1>
      <p className="mt-3 mb-12 text-muted">
        Video experiment ideas ranked by priority score.
      </p>

      <StudioView />
    </div>
  );
}
