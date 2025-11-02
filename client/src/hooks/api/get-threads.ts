import { apiClient } from "@/lib/api-client"
import type { ThreadType } from "@/types/threads";
import { useQuery } from "@tanstack/react-query";

export const useGetThreads = (offset: number, userId: string) => {
  return useQuery<ThreadType[], Error>({
    queryKey: ["threads", offset],
    queryFn: async () => {
      const { data } = await apiClient.get(`/v1/chat/get-threads?offset=${offset}`)
      return data.data;
    },
    enabled: !!userId,
  })
}

export const useSearchThreads = (search: string) => {
  return useQuery<ThreadType[], Error>({
    queryKey: ["threads", search],
    queryFn: async () => {
      const { data } = await apiClient.get(`/v1/chat/search-threads?search=${search}`)
      return data.data;
    },
    enabled: !!search,
  })
}