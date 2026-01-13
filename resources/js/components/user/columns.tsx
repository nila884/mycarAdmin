import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserData } from '@/lib/object';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react'; // For the action ellipsis icon


export const Columns: ColumnDef<UserData>[] = [
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
        id: 'name',
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    },

    {
        id: 'email',
        accessorKey: 'email',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    },

    {
        id: 'roles',
        accessorKey: 'roles',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Roles" />,
        cell: ({ getValue }) => {
            const roles = getValue<{ id: number; name: string }[]>();

            if (!roles?.length) return <span className="text-muted-foreground">—</span>;

            return (
                <div className="flex flex-wrap gap-1">
                    {roles.map((role) => (
                        <span key={role.id} className="bg-muted rounded px-2 py-0.5 text-xs font-medium">
                            {role.name}
                        </span>
                    ))}
                </div>
            );
        },
        enableSorting: false,
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
        cell: () => {
            // const user = row.original;

            // const handleDelete = () => {
            //     if (!confirm('Are you sure you want to delete this user?')) return;

            //     router.delete(route('user.destroy', user.id));
            // };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>{/* <Link href={route("user.show", user.id)}>Details</Link> */}</DropdownMenuItem>
                        <DropdownMenuItem asChild>{/* <Link href={route("user.edit", user.id)}>Edit</Link> */}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {/* <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              Delete
            </DropdownMenuItem> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
