import AddCategory from "@/components/admin/add-category"
import AddModels from "@/components/admin/add-models"
import CardSnippet from "@/components/custom-ui/custom-card"
import { useGetModels } from "@/hooks/api/models"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CustomAlertDialog } from "@/components/custom-ui/custom-alert"
import { useDeleteModelMutation } from "@/hooks/api/admin/models"
import { useDeleteModelCategoryMutation } from "@/hooks/api/admin/model-category"
import { authClient } from "@/lib/auth-clients"
import { useEffect } from "react"

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: session, isPending } = authClient.useSession()
  const navigate = useNavigate()

  const { data: models } = useGetModels()
  const deleteModelMutation = useDeleteModelMutation()
  const deleteCategoryMutation = useDeleteModelCategoryMutation()

  const handleModelDelete = (modelId: string) => {
    deleteModelMutation.mutate({ modelId })
  }

  const handleCategoryDelete = (categoryId: string) => {
    deleteCategoryMutation.mutate({ categoryId })
  }

  useEffect(() => {
    if (!isPending && (!session?.session || session?.user?.role !== "admin")) {
      navigate({ to: "/", replace: true })
    }
  }, [session, isPending, navigate])

  // Show nothing while loading or if user is not admin
  if (isPending || !session?.session || session?.user?.role !== "admin") {
    return null
  }

  return (
    <div className="w-full h-full p-8">
      <CardSnippet
        title="Models"
        className="w-full bg-background"
        modalComponent={
          <div className="space-x-2">
            <AddModels categories={models || []} />
            <AddCategory />
          </div>
        }
      >
        <div className="space-y-4">
          {models?.map((category) => (
            <div key={category.id} className={"bg-muted py-2 rounded-lg"}>
              <div className="flex items-center justify-between gap-2 px-4 pb-1 border-b mb-2">
                <h3 className="font-semibold text-lg capitalize">
                  {category.name}
                </h3>
                <CustomAlertDialog
                  trigger={
                    <Button variant="ghost" size="icon-sm">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  }
                  title="Delete Category"
                  description={`Are you sure you want to delete "${category.name}"? This action cannot be undone.`}
                  onConfirm={() => handleCategoryDelete(category.id)}
                  variant="destructive"
                />
              </div>
              <div className="space-y-2 px-4">
                {category.models?.map((model) => (
                  <div
                    key={model.id}
                    className={`flex items-center justify-between gap-2 border-b last:border-b-0 bg-background rounded-md`}
                  >
                    <span className="ml-2 text-sm">{model.name}</span>
                    <CustomAlertDialog
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={deleteModelMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      }
                      title="Delete Model"
                      description={`Are you sure you want to delete "${model.name}"? This action cannot be undone.`}
                      onConfirm={() => handleModelDelete(model.id)}
                      variant="destructive"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardSnippet>
    </div>
  )
}
