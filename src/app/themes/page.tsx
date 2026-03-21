import ThemeAnalysisView from "@/components/theme-analysis-view";

export default function ThemesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">
        Step 2
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Comment Themes
      </h1>
      <p className="mt-3 mb-12 text-muted">
        Theme clusters extracted from your audience comments.
      </p>

      <ThemeAnalysisView />
    </div>
  );
}
