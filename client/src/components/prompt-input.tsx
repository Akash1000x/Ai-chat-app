import { ArrowUp, ChevronDown } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { icons } from "./icon"
import type { Model, ModelsCategory } from "@/types/models"
import { Label } from "./ui/label"
import React from "react"
import { CustomPopover } from "./ui/popover"
import useLocalStorage from "@/hooks/use-local-storage"

function PromptInput({
  onSubmit,
  message,
  setMessage,
  models,
  disabled,
}: {
  onSubmit: (data: any) => void
  message: string
  setMessage: (message: string) => void
  models: ModelsCategory[]
  disabled: boolean
}) {
  const [userSelectedModel, setUserSelectedModel] = useLocalStorage(
    "selectedModel",
    null,
  )
  const [selectedModel, setSelectedModel] = React.useState<Model | null>(null)
  const [openPopover, setOpenPopover] = React.useState<boolean>(false)

  const handleSubmit = () => {
    if (!message.trim() || !selectedModel || disabled) return
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
    <div className="lg:w-3xl w-xl absolute bottom-0 left-1/2 -translate-x-1/2 border rounded-t-lg bg-input  z-20 pt-3">
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
          onChange={(e) => {
            if (e.target.value !== "\n") {
              setMessage(e.target.value)
            }
          }}
          onKeyDown={handleKeyDown}
        />
        <div className="flex items-center justify-between p-2">
          {models?.length > 1 && (
            <CustomPopover
              open={openPopover}
              setOpen={setOpenPopover}
              trigger={
                <Button variant={"ghost"} className="capitalize">
                  {selectedModel?.name || "Select Model"} <ChevronDown />
                </Button>
              }
              className="py-2"
            >
              <div className="space-y-2">
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
          )}
          <Button
            size={"icon"}
            type="submit"
            aria-label="Send message"
            disabled={!message.trim() || disabled}
          >
            <ArrowUp />
          </Button>
        </div>
      </form>
    </div>
  )
}

export default React.memo(PromptInput)

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
        variant="outline"
        size="sm"
        key={model.id}
        className="flex gap-4 w-full justify-start cursor-pointer [&>svg]:size-5 mb-1 last:mb-0"
        onClick={onClick}
      >
        {icons[categoryName as keyof typeof icons]}
        <p className="capitalize">{model.name}</p>
      </Button>
    )
  },
)
