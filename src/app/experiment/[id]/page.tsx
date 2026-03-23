import ExperimentDetailView from "@/components/experiment-detail-view";

type Params = Promise<{ id: string }>;

export default async function ExperimentPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  return <ExperimentDetailView id={id} />;
}
