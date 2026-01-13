// @/components/car/columns.tsx
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CarDetailData } from '@/lib/object';
import { Link, router } from '@inertiajs/react'; // Import Link and router from Inertia.js
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react'; // For the action ellipsis icon

// Define the Car type based on your Car.php and create-form.tsx
// I've included most fields from create-form.tsx and some from Car.php

export const columns: ColumnDef<CarDetailData>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            />
        ),
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />,
        enableSorting: false,
        enableHiding: false,
    },

    {
        id: 'brand',
        accessorKey: 'version.car_model.brand.brand_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Brand" />,
    },

    {
        id: 'model',
        accessorKey: 'version.car_model.model_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Model" />,
    },

    {
        id: 'price',
        accessorKey: 'price.final_price',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
        cell: ({ getValue }) => {
            const amount = getValue<number>();
            if (!amount) return <div className="text-right">N/A</div>;

            return (
                <div className="text-center font-medium">
                    {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    }).format(amount)}
                </div>
            );
        },
    },

    {
        id: 'status',
        accessorKey: 'spect.status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ getValue }) => <div className="text-center font-medium">{getValue<number>() === 1 ? 'New' : 'Used'}</div>,
    },

    {
        id: 'publication_status',
        accessorKey: 'publication_status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Publication Status" />,
    },

    {
        id: 'selling_status',
        accessorKey: 'car_selling_status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Selling Status" />,
    },

    {
        id: 'created_at',
        accessorKey: 'created_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Created at" />,
    },

    {
        id: 'updated_at',
        accessorKey: 'updated_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Last update" />,
    },

    {
        id: 'actions',
        enableSorting: false,
        cell: ({ row }) => {
            const car = row.original;

            const handleDelete = () => {
                if (!confirm('Are you sure you want to delete this car?')) return;

                router.delete(route('car.destroy', car.id));
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={route('car.show', car.id)}>Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={route('car.edit', car.id)}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
