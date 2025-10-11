import Chat from "@/components/chat"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/chat/$id")({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <Chat conversationId={id} />
}
