import { DataTablePagination } from '@/components/data-table-pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTableToolbar } from '@/components/data-table-toolbar'; // Specific order toolbar
import { router } from '@inertiajs/react';
import { 
    ColumnDef, 
    SortingState, 
    flexRender, 
    getCoreRowModel, 
    useReactTable 
} from '@tanstack/react-table';
import React from 'react';

interface DataTableProps<TData> {
    columns: ColumnDef<TData>[];
    data: TData[];
    serverPagination: {
        pageIndex: number;
        pageSize: number;
        pageCount: number;
    };
    onServerPageChange: (page: number, pageSize: number) => void;
    filters: {
        sort?: string;
        direction?: string;
        search?: string;
        status?: string; // Order specific filter
        [key: string]: unknown;
    };
}

export function OrderDataTable<TData>({
    columns,
    data,
    serverPagination,
    onServerPageChange,
    filters,
}: DataTableProps<TData>) {
    const [sorting, setSorting] = React.useState<SortingState>(
        filters?.sort ? [{ id: String(filters.sort), desc: filters.direction === 'desc' }] : []
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
        enableMultiSort: true,
        pageCount: serverPagination.pageCount,

        onSortingChange: (updater) => {
            const nextSorting = typeof updater === 'function' ? updater(sorting) : updater;
            setSorting(nextSorting);

            const url = new URL(window.location.href);
            const params = Object.fromEntries(url.searchParams.entries());

            if (nextSorting.length) {
                params.sort = nextSorting[0].id;
                params.direction = nextSorting[0].desc ? 'desc' : 'asc';
                params.page = '1';
            } else {
                delete params.sort;
                delete params.direction;
            }

            // Points to the order index route
            router.get(route('order.index'), params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        },

        onPaginationChange: (updater) => {
            const next = typeof updater === 'function'
                    ? updater({
                          pageIndex: serverPagination.pageIndex,
                          pageSize: serverPagination.pageSize,
                      })
                    : updater;

            onServerPageChange(next.pageIndex + 1, next.pageSize);
        },

        state: {
            sorting,
            pagination: {
                pageIndex: serverPagination.pageIndex,
                pageSize: serverPagination.pageSize,
            },
        },
    });

    return (
        <div className="space-y-4">
            {/* Using the Order-specific toolbar we discussed */}
            <DataTableToolbar table={table} filters={filters} />

            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-slate-700 font-semibold px-4 py-3">
                                        {header.isPlaceholder 
                                            ? null 
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-4 py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center text-slate-500 font-medium">
                                    No orders found matching your criteria.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination table={table} />
        </div>
    );
}