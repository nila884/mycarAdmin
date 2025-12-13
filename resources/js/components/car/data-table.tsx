

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
      SortingState,
    getSortedRowModel,
    getFilteredRowModel,
     ColumnFiltersState,
       VisibilityState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import React from "react"
import { DataTablePagination } from "@/components/data-table-pagination"
import { DataTableToolbar } from "@/components/data-table-toolbar"

interface ServerPaginationData {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  serverPagination: ServerPaginationData,
  onServerPageChange: (page: number, pageSize: number) => void,
}

export function DataTable<TData, TValue>({
  columns,
  data,
  serverPagination,
  onServerPageChange
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
      const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
        const [columnVisibility, setColumnVisibility] =React.useState<VisibilityState>({})
          const [rowSelection, setRowSelection] = React.useState({})
     const paginationState = {
        pageIndex: serverPagination.pageIndex,
        pageSize: serverPagination.pageSize,
    };
  const table = useReactTable({

    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
         onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
     onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      pageCount: serverPagination.pageCount,
      onPaginationChange: updater => {
        if (typeof updater === 'function') {
            const newPagination = updater(paginationState);
            onServerPageChange(newPagination.pageIndex + 1, newPagination.pageSize);
        }
    },
    state: {
      sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
        pagination: paginationState,
    },

  })

  return (
    <div className="mx-2">
    <DataTableToolbar table={table} />
        <div className="rounded-md border my-1 ">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
 <DataTablePagination table={table} />
    </div>
  )
}