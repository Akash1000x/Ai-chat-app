import * as React from "react"
import useDebounce from "@/hooks/use-debounce"
import { Search } from "lucide-react"
// import { X } from "lucide-react"

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
    <div className="relative flex items-center gap-2">
      <Search className="size-4 mb-1" />
      <input
        placeholder="Type to search..."
        className="h-7 border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent focus:outline-none w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {/* <button
        type="button"
        onClick={() => setSearch("")}
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        <X className="size-4" />
      </button> */}
    </div>
  )
}
