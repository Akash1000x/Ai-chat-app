import { apiClient } from "@/lib/api-client"
import type { ConversationType } from "@/types/conversations";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { toast } from "sonner"


export const useGetConversations = (userId: string) => {
  return useInfiniteQuery<ConversationType[], Error>({
    queryKey: ["conversations"],
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await apiClient.get(`/v1/chat/conversations?offset=${pageParam}`)
      return data.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage && lastPage.length > 0) {
        return allPages.length;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: !!userId,
  })
}

export const useSearchConversations = (search: string) => {
  return useQuery<ConversationType[], Error>({
    queryKey: ["conversations", search],
    queryFn: async () => {
      const { data } = await apiClient.get(`/v1/chat/conversations/search?search=${search}`)
      return data.data;
    },
    enabled: !!search,
  })
}

export const useDeleteConversationMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ conversationId }: { conversationId: string }) => {
      const res = await apiClient.delete(`/v1/chat/conversation/${conversationId}`)
      return res.data
    },
    onSuccess: () => {
      toast.success("Conversation deleted successfully")
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      })
    },
    onError: (error: AxiosError<{ error: { message: string } }>) => {
      toast.error(error.response?.data?.error?.message || "Failed to delete conversation")
    },
  })
}

export const startNewConversation = async () => {
  const { data } = await apiClient.post(`/v1/chat/new`)
  return data.data
}

// export const useStartNewConversation = () => {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: async () => {
//       const { data } = await apiClient.post(`/v1/chat/new`)
//       return data.data
//     },
//     onSuccess: () => {
//       toast.success("Conversation started successfully")
//     },
//     onError: (error: AxiosError<{ error: { message: string } }>) => {
//       toast.error(error.response?.data?.error?.message || "Failed to start conversation")
//     },
//   })
// }