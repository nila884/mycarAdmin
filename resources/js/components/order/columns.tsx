'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Order } from '@/lib/object';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<Order>[] = [
    {
        accessorKey: 'order_number',
        header: 'Order #',
        cell: ({ row }) => <span className="font-mono font-medium">{row.getValue('order_number')}</span>,
    },
    {
        id: 'vehicle',
        header: 'Vehicle',
        cell: ({ row }) => {
            const vehicle = row.original.vehicle;
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{vehicle.name}</span>
                    <span className="text-xs text-slate-500">{vehicle.chassis_number}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const variants: Record<string, string> = {
                pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                shipped: 'bg-blue-100 text-blue-800 border-blue-200',
                delivered: 'bg-green-100 text-green-800 border-green-200',
                cancelled: 'bg-red-100 text-red-800 border-red-200',
            };
            return (
                <Badge variant="outline" className={`capitalize ${variants[status] || ''}`}>
                    {status}
                </Badge>
            );
        },
    },
    {
        id: 'total',
        header: 'Total (USD)',
        cell: ({ row }) => {
            const price = row.original.pricing;
            return <span className="font-semibold">${price.total_amount.toLocaleString()}</span>;
        },
    },
    {
        id: 'date',
        header: 'Date',
        accessorFn: (row) => row.dates.created_at,
    },
    // {
    //     id: 'actions',
    //     cell: ({ row }) => <DataTableRowActions row={row} />,
    // },
];