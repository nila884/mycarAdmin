import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  SortingState,
  flexRender,
} from "@tanstack/react-table"
import { router } from "@inertiajs/react"
import React from "react"
import { DataTableToolbar } from "@/components/user/data-table-toolbar"
import { DataTablePagination } from "@/components/data-table-pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {  UserData } from "@/lib/object"


export function DataTable({
  columns,
  data,
  serverPagination,
  onServerPageChange,
  filters,
}: {
  columns: ColumnDef<UserData>[]
  data: UserData[]
  serverPagination: {
    pageIndex: number
    pageSize: number
    pageCount: number
  }
  onServerPageChange: (page: number, pageSize: number) => void
  filters: any
})  {
  const [sorting, setSorting] = React.useState<SortingState>(
    filters?.sort
      ? [{ id: filters.sort, desc: filters.direction === "desc" }]
      : []
  )

  const table = useReactTable({
    data,
    columns,

    getCoreRowModel: getCoreRowModel(),

    manualPagination: true,
    manualSorting: true,
    enableMultiSort: true,
    pageCount: serverPagination.pageCount,

    onSortingChange: updater => {
  const nextSorting =
    typeof updater === "function" ? updater(sorting) : updater

  setSorting(nextSorting)

  const url = new URL(window.location.href)
  const params = Object.fromEntries(url.searchParams.entries())

  if (nextSorting.length) {
    params.sort = JSON.stringify(
      nextSorting.map(s => ({
        id: s.id,
        desc: s.desc,
      }))
    )
    params.page = "1"
  } else {
    delete params.sort
  }

  router.get(route("user.index"), params, {
    preserveState: true,
    preserveScroll: true,
    replace: true,
  })
},

onPaginationChange: (updater) => {
  const next =
    typeof updater === "function"
      ? updater({
          pageIndex: serverPagination.pageIndex,
          pageSize: serverPagination.pageSize,
        })
      : updater

  onServerPageChange(next.pageIndex + 1, next.pageSize)
},

    state: {
      sorting,
      pagination: {
        pageIndex: serverPagination.pageIndex,
        pageSize: serverPagination.pageSize,
      },
    },
  })

  return (
    <div>
      <DataTableToolbar table={table} filters={filters} />

      <div className="rounded-md border my-1">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
               <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}
