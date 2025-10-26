// @/pages/car/list.tsx
import AppLayout from "@/layouts/app-layout";
import { columns } from "@/components/car/columns"; // Import Car type
import { DataTable } from "@/components/car/data-table";
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react'; // Import Link from Inertia.js
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui Button
import { Car } from "@/lib/object";

// Assume `cars` data is passed as a prop from Inertia backend
interface CarListPageProps {
  cars: {
    data: Car[]; // Inertia paginated data
    links: any; // Pagination links
    meta: any; // Pagination meta
  };
}

export default function List({ cars }: CarListPageProps) { // Destructure cars prop

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Cars listings',
      href: route('car.index'),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Cars Listings" />
      <div className="container mx-auto py-10">
        <div className="flex justify-end mb-4">
          <Link href={route('car.create')}> {/* Link to the create car page */}
            <Button>Add New Car</Button>
          </Link>
        </div>
        <DataTable columns={columns} data={cars.data} /> {/* Pass the cars.data to DataTable */}
      </div>
    </AppLayout>
  );
}
