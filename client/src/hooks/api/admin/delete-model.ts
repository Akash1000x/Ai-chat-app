import { apiClient } from "@/lib/api-client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useDeleteModelMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ modelId }: { modelId: string }) => {
      const res = await apiClient.delete(`/v1/admin/delete-model/${modelId}`)
      return res.data
    },
    onSuccess: () => {
      toast.success("Model deleted successfully")
      queryClient.invalidateQueries({
        queryKey: ["models"],
      })
    },
    onError: (error: AxiosError<{ error: { message: string } }>) => {
      toast.error(error.response?.data?.error?.message || "Failed to delete model")
    },
  })
}