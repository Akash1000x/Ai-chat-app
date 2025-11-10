import { apiClient } from "@/lib/api-client"
import type { MessageType } from "@/types/messages";
import { useQuery } from "@tanstack/react-query";

export const useGetMessage = (conversationId: string | undefined) => {
  return useQuery<MessageType[], Error>({
    queryKey: [`messages${conversationId}`],
    queryFn: async () => {
      const { data } = await apiClient.get(`/v1/chat/messages/${conversationId}`)
      return data.data;
    },
    enabled: !!conversationId
  })
}