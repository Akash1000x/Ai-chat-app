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
            "bg-accent p-2 cursor-pointer rounded-md opacity-0 invisible transition-all duration-300 group-hover:opacity-100 group-hover:visible [&_svg]:size-4",
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
