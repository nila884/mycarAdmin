'use client';

import { Row } from '@tanstack/react-table';
import { MoreHorizontal, Eye, Truck, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { router } from '@inertiajs/react';
import { Order } from '@/lib/object';

export function DataTableRowActions({ row }: { row: Row<Order> }) {
    const order = row.original;

    const updateStatus = (status: string) => {
        router.patch(route('order.update-status', order.id), { status }, {
            preserveScroll: true,
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.get(route('order.show', order.id))}>
                    <Eye className="mr-2 h-4 w-4" /> View Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => updateStatus('shipped')}><Truck className="mr-2 h-4 w-4" /> Ship Order</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateStatus('delivered')}><CheckCircle className="mr-2 h-4 w-4" /> Deliver</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateStatus('cancelled')} className="text-red-600"><XCircle className="mr-2 h-4 w-4" /> Cancel</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}