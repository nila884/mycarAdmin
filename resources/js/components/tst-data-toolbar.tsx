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
import { Checkbox } from "@/components/ui/checkbox"
import { useDebounceOnSearch } from "@/hooks/use-debounce"
import { DataTableViewOptions } from "./data-table-view-options"

/**
 * ✅ IMPORTANT
 * TData MUST extend { id: number }
 */
export function TestDataTableToolbar<TData extends { id: number }>({
  table,
  filters,
  deleteRoute,
}: {
  table: Table<TData>
  filters: any
  deleteRoute?: string
}) {
  const [search, setSearch] = useState(filters?.search ?? "")
  const [publicationStatus, setPublicationStatus] = useState(
    filters?.publication_status ?? "all"
  )
  const [sellingStatus, setSellingStatus] = useState(
    filters?.car_selling_status ?? "all"
  )

  const debouncedSearch = useDebounceOnSearch(search, 500)
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }

    const url = new URL(window.location.href)
    const params = Object.fromEntries(url.searchParams.entries())

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
  }, [debouncedSearch, publicationStatus, sellingStatus])

  const selectedIds = table
    .getSelectedRowModel()
    .rows
    .map(row => row.original.id)

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 🔍 Search */}
      <Input
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-[250px]"
      />

      {/* Publication status */}
      <Select value={publicationStatus} onValueChange={setPublicationStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Publication status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>

      {/* Selling status */}
      <Select value={sellingStatus} onValueChange={setSellingStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selling status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="selling">Selling</SelectItem>
          <SelectItem value="reserved">Reserved</SelectItem>
          <SelectItem value="sold">Sold</SelectItem>
        </SelectContent>
      </Select>

      {/* Discount filter */}
      <Checkbox
        checked={Boolean(filters.discounted)}
        onCheckedChange={checked => {
          const params = new URLSearchParams(window.location.search)

          if (checked) params.set("discounted", "1")
          else params.delete("discounted")

          params.set("page", "1")

          router.get(route("car.index"), Object.fromEntries(params), {
            preserveState: true,
            replace: true,
          })
        }}
      />

      {/* Reset */}
      {(search ||
        publicationStatus !== "all" ||
        sellingStatus !== "all") && (
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

      {/* Bulk delete */}
      {deleteRoute && (
        <Button
          variant="destructive"
          disabled={!selectedIds.length}
          onClick={() => {
            if (!confirm("Delete selected items?")) return

            router.post(route(deleteRoute), {
              ids: selectedIds,
            })
          }}
        >
          Delete Selected ({selectedIds.length})
        </Button>
      )}

      <DataTableViewOptions table={table} />
    </div>
  )
}
