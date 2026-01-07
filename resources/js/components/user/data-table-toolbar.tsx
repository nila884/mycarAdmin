import { DataTableViewOptions } from '@/components/data-table-view-options';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounceOnSearch } from '@/hooks/use-debounce';
import { router } from '@inertiajs/react';
import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// 1. Define a strict but flexible interface for the filter bag
interface UserDataTableToolbarProps<TData> {
    table: Table<TData>;
    filters: {
        search?: string;
        role?: string;
        [key: string]: unknown; // Documentation pattern to replace 'any'
    };
}

export function DataTableToolbar<TData>({ 
    table, 
    filters 
}: UserDataTableToolbarProps<TData>) {
    // Explicitly typing useState prevents 'any' leakage
    const [search, setSearch] = useState<string>(filters?.search ?? '');
    const [role, setRole] = useState<string>(filters?.role ?? 'all');
    
    const debouncedSearch = useDebounceOnSearch(search, 500);
    const isFirst = useRef(true);

    useEffect(() => {
        if (isFirst.current) {
            isFirst.current = false;
            return;
        }

        const url = new URL(window.location.href);
        const params = Object.fromEntries(url.searchParams.entries());

        // 🔍 Search Logic
        if (debouncedSearch) {
            params.search = debouncedSearch;
            params.page = '1';
        } else {
            delete params.search;
        }

        // Role Filter Logic
        if (role !== 'all') {
            params.role = role;
            params.page = '1';
        } else {
            delete params.role;
        }

        router.get(route('user.index'), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, [debouncedSearch, role]);

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* 🔍 Search Input */}
            <Input 
                placeholder="Search name or email" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-[250px]" 
            />

            {/* Reset Button */}
            {(search !== '' || role !== 'all') && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        setSearch('');
                        setRole('all');
                    }}
                    className="h-8 px-2 lg:px-3"
                >
                    Reset <X className="ml-2 h-4 w-4" />
                </Button>
            )}

            <div className="ml-auto">
                <DataTableViewOptions table={table} />
            </div>
        </div>
    );
}