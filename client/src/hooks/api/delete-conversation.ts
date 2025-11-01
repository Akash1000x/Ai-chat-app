import { apiClient } from "@/lib/api-client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { toast } from "sonner"

export const useDeleteConversationMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ threadId }: { threadId: string }) => {
      const res = await apiClient.delete(`/v1/chat/delete-conversation?threadId=${threadId}`)
      return res.data
    },
    onSuccess: () => {
      toast.success("Conversation deleted successfully")
      queryClient.invalidateQueries({
        queryKey: ["threads"],
      })
    },
    onError: (error: AxiosError<{ error: { message: string } }>) => {
      toast.error(error.response?.data?.error?.message || "Failed to delete conversation")
    },
  })
}