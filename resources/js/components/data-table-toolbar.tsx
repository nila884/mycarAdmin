import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounceOnSearch } from '@/hooks/use-debounce';
import { router } from '@inertiajs/react';
import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DataTableViewOptions } from './data-table-view-options';
import { Checkbox } from './ui/checkbox';

// 1. Define a specific interface for your Inertia/Laravel filters
interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    // Documentation standard: Use a Partial record or a specific interface 
    // to avoid the 'any' linter error while maintaining flexibility.
    filters: Partial<{
        search: string;
        publication_status: string;
        car_selling_status: string;
        discounted: string | number | boolean;
        [key: string]: unknown; // Allows for dynamic Laravel query params
    }>;
}

export function DataTableToolbar<TData>({ 
    table, 
    filters 
}: DataTableToolbarProps<TData>) {
    const [search, setSearch] = useState<string>(filters?.search ?? '');
    const [publicationStatus, setPublicationStatus] = useState<string>(filters?.publication_status ?? 'all');
    const [sellingStatus, setSellingStatus] = useState<string>(filters?.car_selling_status ?? 'all');
    
    const debouncedSearch = useDebounceOnSearch(search, 500);
    const isFirst = useRef(true);

    useEffect(() => {
        if (isFirst.current) {
            isFirst.current = false;
            return;
        }

        const url = new URL(window.location.href);
        const params = Object.fromEntries(url.searchParams.entries());

        if (debouncedSearch) {
            params.search = debouncedSearch;
            params.page = '1';
        } else {
            delete params.search;
        }

        if (publicationStatus !== 'all') {
            params.publication_status = publicationStatus;
            params.page = '1';
        } else {
            delete params.publication_status;
        }

        if (sellingStatus !== 'all') {
            params.car_selling_status = sellingStatus;
            params.page = '1';
        } else {
            delete params.car_selling_status;
        }

        router.get(route(route().current() ?? 'car.index'), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, [debouncedSearch, publicationStatus, sellingStatus]);

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Input 
                placeholder="Search brand or model..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-[250px]" 
            />

            <Select value={publicationStatus} onValueChange={setPublicationStatus}>
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

            <Select value={sellingStatus} onValueChange={setSellingStatus}>
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

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="discounted"
                    checked={Boolean(filters.discounted)}
                    onCheckedChange={(checked) => {
                        const params = new URLSearchParams(window.location.search);
                        if (checked) params.set('discounted', '1');
                        else params.delete('discounted');
                        params.set('page', '1');

                        router.get(route(route().current() ?? 'car.index'), Object.fromEntries(params), {
                            preserveState: true,
                            replace: true,
                        });
                    }}
                />
                <label htmlFor="discounted" className="text-sm font-medium leading-none">
                    Discounted only
                </label>
            </div>

            {(search || publicationStatus !== 'all' || sellingStatus !== 'all') && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        setSearch('');
                        setPublicationStatus('all');
                        setSellingStatus('all');
                    }}
                >
                    Reset <X className="ml-2 h-4 w-4" />
                </Button>
            )}

            <DataTableViewOptions table={table} />
        </div>
    );
}