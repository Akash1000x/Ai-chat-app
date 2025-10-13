import { ArrowUp, ChevronDown } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { icons } from "./icon"
import type { Model } from "@/types/models"
import { Label } from "./ui/label"
import React from "react"
import { CustomPopover } from "./ui/popover"
import { useGetModels } from "@/hooks/api/get-models"
import useLocalStorage from "@/hooks/use-local-storage"

export default function PromptInput({
  onSubmit,
}: {
  onSubmit: (data: any) => void
}) {
  const { data: models } = useGetModels()
  const [userSelectedModel, setUserSelectedModel] = useLocalStorage(
    "selectedModel",
    null,
  )
  const [selectedModel, setSelectedModel] = React.useState<Model | null>(null)
  const [openPopover, setOpenPopover] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>("")

  const handleSubmit = () => {
    if (!message.trim() || !selectedModel) return
    onSubmit({ message, model: selectedModel })
    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && message.trim()) {
      e.preventDefault()
      handleSubmit()
    }
  }

  React.useEffect(() => {
    if (!models) return
    if (userSelectedModel) {
      const selectedModel = models
        ?.flatMap((category) => category.models)
        ?.find((model) => model.id === userSelectedModel)
      if (selectedModel) {
        setSelectedModel(selectedModel)
      }
    } else {
      const selectedModel = models
        ?.flatMap((category) => category.models)
        ?.find((model) => model.isDefault)

      if (selectedModel) {
        setSelectedModel(selectedModel)
      }
    }
  }, [models])

  const handleSetSelectedModel = (model: Model) => {
    setSelectedModel(model)
    setUserSelectedModel(model.id)
    setOpenPopover(false)
  }

  return (
    <div className="lg:w-3xl w-xl absolute bottom-0 left-1/2 -translate-x-1/2 border rounded-t-lg bg-input z-20 pt-3">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <Textarea
          className="border-none resize-none font-medium max-h-64 py-0"
          placeholder="Type your message here..."
          name="input"
          value={message}
          onChange={(e) =>
            e.target.value !== "\n" && setMessage(e.target.value)
          }
          onKeyDown={handleKeyDown}
        />
        <div className="flex items-center justify-between p-2">
          <CustomPopover
            open={openPopover}
            setOpen={setOpenPopover}
            trigger={
              <Button variant={"outline"} className="capitalize">
                {selectedModel?.name} <ChevronDown />
              </Button>
            }
          >
            <div className="space-y-4">
              {models?.map((category) => (
                <div key={category.id} className="">
                  {!!category.models.length && (
                    <Label className="text-bold text-xs capitalize mb-1">
                      {category.name}
                    </Label>
                  )}
                  {category.models.map((model) => (
                    <ListItem
                      key={model.id}
                      model={model}
                      categoryName={category.slug}
                      onClick={() => handleSetSelectedModel(model)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </CustomPopover>
          <Button
            variant="outline"
            size={"icon"}
            type="submit"
            aria-label="Send message"
            disabled={!message.trim()}
          >
            <ArrowUp />
          </Button>
        </div>
      </form>
    </div>
  )
}

const ListItem = React.memo(
  ({
    model,
    categoryName,
    onClick,
  }: {
    model: Model
    categoryName: string
    onClick: () => void
  }) => {
    return (
      <Button
        variant="ghost"
        key={model.id}
        className="flex gap-4 w-full justify-start cursor-pointer [&>svg]:size-5"
        onClick={onClick}
      >
        {icons[categoryName as keyof typeof icons]}
        <p className="capitalize">{model.name}</p>
      </Button>
    )
  },
)
