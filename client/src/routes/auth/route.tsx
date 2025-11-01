import { authClient } from '@/lib/auth-clients'
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: session, isPending } = authClient.useSession()
  const navigate = useNavigate()
  if (session?.session) {
    navigate({ to: "/", replace: true })
  } else {
    navigate({ to: "/auth/sign-in", replace: true })
  }

  return <div className="flex min-h-screen items-center justify-center p-4 w-full">
    {isPending || session?.session ? null : <Outlet />}
  </div>
}
