import { apiClient } from "@/lib/api-client"
import { useQuery } from "@tanstack/react-query";

type Category = "create" | "explore" | "code" | "learn"

type SuggestionQuestion = {
  id: string
  category: Category
  questions: string[]
}

const fetchSuggestionQuestions = async (): Promise<SuggestionQuestion[]> => {
  const { data } = await apiClient.get(`/v1/get-suggestions-questions`)
  return data.data;
}

export const useGetSuggestionQuestions = () => {
  return useQuery<SuggestionQuestion[], Error>({
    queryKey: ["suggestion-questions"],
    queryFn: () => fetchSuggestionQuestions(),
  })
}