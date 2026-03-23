import SetupForm from "@/components/setup-form";

export default function SetupPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">
        Step 1
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Configure your profile
      </h1>
      <p className="mt-3 text-muted">
        Tell us about your creator niche and audience, then paste comments from
        a recent post. We&rsquo;ll surface the demand signals hiding in your
        replies.
      </p>

      <div className="mt-12">
        <SetupForm />
      </div>
    </div>
  );
}
