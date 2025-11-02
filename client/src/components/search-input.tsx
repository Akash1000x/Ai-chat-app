import { Input } from "./ui/input"
import * as React from "react"
import useDebounce from "@/hooks/use-debounce"
import { X } from "lucide-react"

export default function SearchInput({
  onSearch,
}: {
  onSearch: (search: string) => void
}) {
  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebounce(search, 500)

  React.useEffect(() => {
    onSearch(debouncedSearch)
  }, [debouncedSearch])

  return (
    <div className="relative w-80">
      <Input
        placeholder="Search"
        className="h-7"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        type="button"
        onClick={() => setSearch("")}
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
