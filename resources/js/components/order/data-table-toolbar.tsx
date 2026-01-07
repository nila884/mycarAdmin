'use client';

import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';

interface OrderFilters {
    search?: string;
    status?: string;
    sort?: string;
    direction?: string;
    page?: number;
    per_page?: number;
    [key: string]: string | number | undefined; 
}

interface ToolbarProps<TData> {
    table: Table<TData>;
    filters: OrderFilters;
}

export function OrderDataTableToolbar<TData>({ filters }: ToolbarProps<TData>) {
    
    const handleFilter = (key: keyof OrderFilters, value: string) => {
        // 1. Create a copy of current filters
        const params: OrderFilters = { 
            ...filters, 
            [key]: value, 
            page: 1 
        };

        // 2. Remove empty values
        if (!value || value === 'all') {
            delete params[key];
        }
        
        // ✅ FIX: Cast to Record<string, unknown> instead of 'any'
        // This satisfies the linter while still being compatible with Inertia
        router.get(route('order.index'), params as unknown as Record<string, string | number>, { 
            preserveState: true, 
            replace: true 
        });
    };

    return (
        <div className="flex items-center justify-between gap-2 py-4">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Search orders..."
                    defaultValue={filters.search ?? ''}
                    onBlur={(e) => handleFilter('search', e.target.value)}
                    className="h-9 w-[150px] lg:w-[250px]"
                />
                <Select 
                    onValueChange={(v) => handleFilter('status', v)} 
                    defaultValue={filters.status || 'all'}
                >
                    <SelectTrigger className="h-9 w-[150px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}