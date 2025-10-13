import { LogIn, LogOut, Plus, Search, Trash2 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import type { ThreadType } from "@/types/threads"
import { useGetThreads } from "@/hooks/api/get-threads"
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "@tanstack/react-router"
import { Button } from "./ui/button"
import { CustomAlertDialog } from "./ui/alert-dialog"
import { deleteConversation } from "@/hooks/api/delete-conversation"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-clients"
import { Avatar, AvatarFallback } from "./ui/avatar"

export default function AppSidebar() {
  const params = useParams({ from: "/chat/$id", shouldThrow: false })
  const navigate = useNavigate({ from: "/chat/$id" })
  const location = useLocation()
  const { data: session } = authClient.useSession()

  const { data } = useGetThreads(0, session?.session?.userId || "")
  const queryClient = useQueryClient()
  const { state } = useSidebar()

  if (location.pathname.includes("/auth")) {
    return null
  }

  return (
    <>
      <div
        data-state={state}
        className={cn("absolute top-1.5 left-1.5 z-50 group")}
      >
        <div className="flex items-center transition-all group-data-[state=collapsed]:delay-300 group-data-[state=expanded]:delay-0 group-data-[state=collapsed]:border rounded-sm p-1">
          <SidebarTrigger />
          <Button
            variant={"ghost"}
            size={"icon-sm"}
            className="invisible transition-[visibility,opacity] group-data-[state=collapsed]:delay-300 group-data-[state=expanded]:delay-0 group-data-[state=collapsed]:visible"
          >
            <Search />
          </Button>
          <Button
            variant={"ghost"}
            size={"icon-sm"}
            disabled={location.pathname === "/"}
            onClick={() => {
              navigate({
                to: "/",
              })
            }}
            className="invisible transition-[visibility,opacity] group-data-[state=collapsed]:delay-300 group-data-[state=expanded]:delay-0 group-data-[state=collapsed]:visible"
          >
            <Plus />
          </Button>
        </div>
      </div>
      <Sidebar>
        <SidebarHeader className="gap-4">
          <div className="flex items-center justify-between">
            <div className="size-8"></div>
            <h1 className="text-2xl font-bold text-center">AI Chat</h1>
            <Button variant={"ghost"} size={"icon-sm"}>
              <Search />
            </Button>
          </div>
          <Button
            variant={"outline"}
            className="py-5 text-lg font-semibold"
            asChild
          >
            <Link to="/">
              New Chat <Plus />
            </Link>
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Chats</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {data?.map((item: ThreadType, i: number) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton
                      className={cn(
                        "text-nowrap relative",
                        item.threadId === params?.id && "bg-sidebar-accent",
                      )}
                      asChild
                    >
                      <Link to="/chat/$id" params={{ id: item.threadId }}>
                        <span>{item.title}</span>
                        <span
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          className="w-20 z-50 flex justify-end absolute -right-20 bg-gradient-to-r from-black/0 to-accent opacity-0 group-hover/menu-item:opacity-100 group-hover/menu-item:-right-0 transition-all duration-200"
                        >
                          <CustomAlertDialog
                            trigger={
                              <Button variant={"ghost"} size={"icon-sm"}>
                                <Trash2 className="size-3" />
                              </Button>
                            }
                            title="Delete Thread"
                            description={`Are you sure you want to delete "${item.title}"? This action cannot be undone.`}
                            onConfirm={async () => {
                              await deleteConversation(item.threadId)
                              toast.success("Thread deleted successfully")
                              if (item.threadId === params?.id) {
                                navigate({
                                  to: "/",
                                })
                              }
                              queryClient.invalidateQueries({
                                queryKey: ["threads"],
                              })
                            }}
                          />
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              {session?.session ? (
                <SidebarMenuButton
                  asChild
                  variant={"outline"}
                  className="justify-between py-6"
                >
                  <div className="space-x-4 capitalize">
                    <Avatar>
                      <AvatarFallback>
                        {session?.user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-lg">
                      {session?.user?.name}
                    </span>
                    <CustomAlertDialog
                      trigger={
                        <Button variant={"destructive"} size={"icon-sm"}>
                          <LogOut />
                        </Button>
                      }
                      title="Sign Out"
                      description="Are you sure you want to sign out?"
                      onConfirm={async () => {
                        await authClient.signOut()
                        navigate({
                          to: "/",
                          replace: true,
                          reloadDocument: true,
                        })
                      }}
                    />
                  </div>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton
                  variant={"outline"}
                  className="justify-center py-6"
                  asChild
                >
                  <Link to="/auth/sign-in" className="space-x-4">
                    <LogIn />
                    <span>Login</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
