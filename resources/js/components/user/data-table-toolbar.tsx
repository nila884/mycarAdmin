"use client"

import { Table } from "@tanstack/react-table"
import { router } from "@inertiajs/react"
import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDebounceOnSearch } from "@/hooks/use-debounce"


import { UserData } from "@/lib/object"
import { DataTableViewOptions } from "@/components/data-table-view-options"

export function DataTableToolbar({
  table,
  filters,
}: {
  table: Table<UserData>
  filters: any
}) {
  const [search, setSearch] = useState(filters?.search ?? "")
  const [role, setRole] = useState(filters?.role ?? "all")
  const debouncedSearch = useDebounceOnSearch(search, 500)
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }

    const url = new URL(window.location.href)
    const params = Object.fromEntries(url.searchParams.entries())

    // 🔍 Search
    if (debouncedSearch) {
      params.search = debouncedSearch
      params.page = "1"
    } else {
      delete params.search
    }

   
    if (role !== "all") {
      params.role = role
      params.page = "1"
    } else {
      delete params.role
    }



    router.get(route("user.index"), params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    })
  }, [debouncedSearch, role])

  
// const handleBulkDelete = () => {
//   const ids = table
//     .getSelectedRowModel()
//     .rows
//     .map(row => row.original.id)

//   if (!ids.length) return

//   if (!confirm(`Delete ${ids.length} users?`)) return

//   router.post(route("user.bulk-delete"), { ids })
// }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 🔍 Search */}
      <Input
        placeholder="Search name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-[250px]"
      />

      {/* <Select
        value={role}
        onValueChange={setRole}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Publication status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select> */}



{/* <Button
  variant="destructive"
  disabled={!table.getIsSomeRowsSelected()}
  onClick={handleBulkDelete}
>
  Delete selected
</Button> */}

      {/* Reset */}
      {(search || role !== "all") && (
        <Button
          variant="ghost"
          onClick={() => {
            setSearch("")
            setRole("all")
          }}
        >
          Reset <X className="ml-2 h-4 w-4" />
        </Button>
      )}



      <div> <DataTableViewOptions table={table}/></div>
    </div>
  )
}
