import { createFileRoute } from "@tanstack/react-router"
import CopyToClipboard from "@/components/copy-to-clipboard"
import { Body } from "@/components/ui/typography"
import Markdown from "@/components/markdown"
import useClipboard from "@/hooks/use-clipboard"
import { useGetModels } from "@/hooks/api/models"
import { useGetSharedConversation } from "@/hooks/api/share-conversation"
import ErrorMessage from "@/components/error"

export const Route = createFileRoute("/share/$id")({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { data: messages, error } = useGetSharedConversation(id)

  const { copied, handleCopy } = useClipboard()
  const { data: models } = useGetModels()

  if (error) {
    return (
      <ErrorMessage
        message={"The shared conversation is not found or has been deleted"}
      />
    )
  }

  return (
    <div className="space-y-10 lg:w-3xl w-xl mx-auto px-3 pt-10">
      {messages?.map((message, i) => (
        <div key={`${message.id + i}`} className="">
          {message.role === "user" ? (
            <div className="group">
              <Body className="p-4 bg-muted rounded-md max-w-xl ml-auto text-justify">
                {message.parts[0].text}
              </Body>
              <div className="flex justify-end items-center p-2 h-12 opacity-0 invisible transition-all duration-300 group-hover:opacity-100 group-hover:visible">
                <CopyToClipboard
                  copied={copied}
                  onClick={() => handleCopy(message.parts[0].text)}
                />
              </div>
            </div>
          ) : (
            <div className="group leading-8">
              <Markdown message={message.parts[0].text} />
              <div className="flex justify-start items-center p-2 h-12 gap-2 opacity-0 invisible transition-all duration-300 group-hover:opacity-100 group-hover:visible">
                <CopyToClipboard
                  copied={copied}
                  onClick={() => handleCopy(message.parts[0].text)}
                />
                <Body>
                  {
                    models
                      ?.find((category) =>
                        category.models.find((m) => m.slug === message.model),
                      )
                      ?.models.find((m) => m.slug === message.model)?.name
                  }
                </Body>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
