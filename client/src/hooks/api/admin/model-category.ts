import { apiClient } from "@/lib/api-client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useAddModelCategoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ categoryName, categorySlug }: { categoryName: string; categorySlug: string }) => {
      const res = await apiClient.post("/v1/admin/model-categories", {
        categoryName,
        categorySlug,
      })
      return res.data
    },
    onSuccess: () => {
      toast.success("Model category added successfully")
      queryClient.invalidateQueries({
        queryKey: ["models"],
      })
    },
    onError: (error: AxiosError<{ error: { message: string } }>) => {
      toast.error(error.response?.data?.error?.message || "Failed to add model category")
    },
  })
}

export const useDeleteModelCategoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ categoryId }: { categoryId: string }) => {
      const res = await apiClient.delete(`/v1/admin/model-categories/${categoryId}`)
      return res.data
    },
    onSuccess: () => {
      toast.success("Model category deleted successfully")
      queryClient.invalidateQueries({
        queryKey: ["models"],
      })
    },
    onError: (error: AxiosError<{ error: { message: string } }>) => {
      toast.error(error.response?.data?.error?.message || "Failed to delete model category")
    },
  })
}