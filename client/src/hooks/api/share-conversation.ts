import { apiClient } from "@/lib/api-client"
import type { MessageType } from "@/types/messages"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { toast } from "sonner"

export const useShareConversation = () => {
  return useMutation({
    mutationFn: async ({ threadId }: { threadId: string }) => {
      const res = await apiClient.post(`/v1/chat/conversation/${threadId}/share`)
      return res.data
    },
  })
}

export const useUnshareConversation = () => {
  return useMutation({
    mutationFn: async ({ threadId }: { threadId: string }) => {
      const res = await apiClient.post(`/v1/chat/conversation/${threadId}/unshare`)
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

export const useGetSharedConversation = (threadId: string) => {
  return useQuery<MessageType[], Error>({
    queryKey: ["shared-conversation", threadId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/v1/chat/conversation/shared/${threadId}`)
      return data.data
    },
    enabled: !!threadId,
    retry: false,
  })
}