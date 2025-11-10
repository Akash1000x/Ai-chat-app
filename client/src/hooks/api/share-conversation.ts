import { apiClient } from "@/lib/api-client"
import type { MessageType } from "@/types/messages"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { toast } from "sonner"

export const useShareConversation = () => {
  return useMutation({
    mutationFn: async ({ conversationId }: { conversationId: string }) => {
      const res = await apiClient.post(`/v1/chat/conversation/${conversationId}/share`)
      return res.data
    },
  })
}

export const useUnshareConversation = () => {
  return useMutation({
    mutationFn: async ({ conversationId }: { conversationId: string }) => {
      const res = await apiClient.post(`/v1/chat/conversation/${conversationId}/unshare`)
      return res.data
    },
    onSuccess: () => {
      toast.success("Deleted shared conversation.")
    },
    onError: (error: AxiosError<{ error: { message: string } }>) => {
      toast.error(error.response?.data?.error?.message || "Failed to delete shared conversation.")
    },
  })
}

export const useGetSharedConversation = (conversationId: string) => {
  return useQuery<MessageType[], Error>({
    queryKey: ["shared-conversation", conversationId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/v1/chat/conversation/shared/${conversationId}`)
      return data.data
    },
    enabled: !!conversationId,
    retry: false,
  })
}