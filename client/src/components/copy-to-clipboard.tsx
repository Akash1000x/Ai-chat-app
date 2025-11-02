import { CheckIcon, Copy } from "lucide-react"
import { CustomeTooltip } from "./ui/tooltip"
import { cn } from "@/lib/utils"

export default function CopyToClipboard({
  copied,
  onClick,
  className,
  tooltipText = "copy message",
}: {
  copied: boolean
  onClick: () => void
  className?: string
  tooltipText?: string
}) {
  return (
    <CustomeTooltip
      trigger={
        <button
          className={cn(
            "hover:bg-accent p-2 cursor-pointer rounded-md [&_svg]:size-4",
            className,
          )}
          onClick={onClick}
        >
          {copied ? <CheckIcon /> : <Copy />}
        </button>
      }
      tooltipText={tooltipText}
    />
  )
}
