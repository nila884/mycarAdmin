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
import { DataTableViewOptions } from "./data-table-view-options"
import { Checkbox } from "./ui/checkbox"

import { CarDetailData } from "@/lib/object"

export function DataTableToolbar({
  table,
  filters,
}: {
  table: Table<CarDetailData>
  filters: any
}) {
  const [search, setSearch] = useState(filters?.search ?? "")
  const [publicationStatus, setPublicationStatus] = useState(filters?.publication_status ?? "all")
  const [sellingStatus, setSellingStatus] = useState(filters?.car_selling_status ?? "all")
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

   
    if (publicationStatus !== "all") {
      params.publication_status = publicationStatus
      params.page = "1"
    } else {
      delete params.publication_status
    }

    if (sellingStatus !== "all") {
      params.car_selling_status = sellingStatus
      params.page = "1"
    } else {
      delete params.car_selling_status
    }

    router.get(route("car.index"), params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    })
  }, [debouncedSearch, publicationStatus,sellingStatus])

  
const handleBulkDelete = () => {
  const ids = table
    .getSelectedRowModel()
    .rows
    .map(row => row.original.id)

  if (!ids.length) return

  if (!confirm(`Delete ${ids.length} cars?`)) return

  router.post(route("car.bulk-delete"), { ids })
}

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 🔍 Search */}
      <Input
        placeholder="Search brand or model..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-[250px]"
      />

      <Select
        value={publicationStatus}
        onValueChange={setPublicationStatus}
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
      </Select>

            <Select
        value={sellingStatus}
        onValueChange={setSellingStatus}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selling status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All </SelectItem>
          <SelectItem value="selling">Selling</SelectItem>
          <SelectItem value="reserved">Reserved</SelectItem>
          <SelectItem value="sold">Sold</SelectItem>
        </SelectContent>
      </Select>

<Checkbox
  checked={Boolean(filters.discounted)}
  onCheckedChange={(checked) => {
    const params = new URLSearchParams(window.location.search)

    if (checked) {
      params.set("discounted", "1")
    } else {
      params.delete("discounted")
    }

    params.set("page", "1")

    router.get(route("car.index"), Object.fromEntries(params), {
      preserveState: true,
      replace: true,
    })
  }}
/>
<span className="text-sm">Discounted only</span>

{/* <Button
  variant="destructive"
  disabled={!table.getIsSomeRowsSelected()}
  onClick={handleBulkDelete}
>
  Delete selected
</Button> */}

      {/* Reset */}
      {(search || publicationStatus !== "all" || sellingStatus !=="all") && (
        <Button
          variant="ghost"
          onClick={() => {
            setSearch("")
            setPublicationStatus("all")
            setSellingStatus("all")
          }}
        >
          Reset <X className="ml-2 h-4 w-4" />
        </Button>
      )}



      <div> <DataTableViewOptions table={table}/></div>
    </div>
  )
}
