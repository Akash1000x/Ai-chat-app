import Chat from "@/components/chat"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: App,
})

function App() {
  return (
    <div className="w-full px-2 relative">
      <Chat />
    </div>
  )
}
