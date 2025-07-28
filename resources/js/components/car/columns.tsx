// @/components/car/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Link, router } from '@inertiajs/react'; // Import Link and router from Inertia.js
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui Button
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react"; // For the action ellipsis icon
import{Car} from '@/lib/object'

// Define the Car type based on your Car.php and create-form.tsx
// I've included most fields from create-form.tsx and some from Car.php


export const columns: ColumnDef<Car>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "brand_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Brand" />
    ),
  },
  {
    accessorKey: "model_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Model" />
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: "publication_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Publication Status" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const car = row.original;

      const handleDelete = () => {
        if (confirm("Are you sure you want to delete this car? This action cannot be undone.")) {
          router.delete(route('car.destroy', car.id), {
            onSuccess: () => {
              console.log("Car deleted successfully!");
            },
            onError: (errors) => {
              console.error("Error deleting car:", errors);
              alert("Failed to delete car. Please try again.");
            }
          });
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={route('car.show', car.id)}>
                Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={route('car.edit', car.id)}>
                Edit
              </Link>
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
