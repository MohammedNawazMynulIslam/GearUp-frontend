import { GearDetailView } from "./gear-detail-view"

export default async function GearDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <GearDetailView id={id} />
}
