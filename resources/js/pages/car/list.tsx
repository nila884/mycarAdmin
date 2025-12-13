// @/pages/car/list.tsx
import AppLayout from "@/layouts/app-layout";
import { columns } from "@/components/car/columns"; // Import Car type
import { DataTable } from "@/components/car/data-table";
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react'; // Import Link and router from Inertia.js
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui Button
import { Car } from "@/lib/object";

// Assume `cars` data is passed as a prop from Inertia backend
interface CarListPageProps {
  cars: {
    data: Car[]; // Inertia paginated data
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    

  
}
}

const handlePageChange = (page: number, pageSize: number) => {
    // 1. Get the current URL
    const currentUrl = route('car.index');
    
    // 2. Request the new page from the Laravel server
    // Use Inertia router provided by @inertiajs/react to make a GET request with the new parameters
    router.get(currentUrl, {
        page: page, // The page number (Laravel expects 1-based index)
        per_page: pageSize, // The page size
    }, {
        preserveScroll: true, // Keep scroll position when changing pages
    });
};
export default function List({ cars }: CarListPageProps) { // Destructure cars prop

  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Cars listings',
      href: route('car.index'),
    },
  ];

  const paginationData = {
    pageIndex: cars.current_page - 1, // Convert Laravel 1-based page to React Table 0-based
    pageSize: cars.per_page,
    pageCount: cars.last_page,
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Cars Listings" />
      <div className="container mx-auto py-10">
        <div className="flex justify-end mb-4">
          <Link href={route('car.create')}> {/* Link to the create car page */}
            <Button>Add New Car</Button>
          </Link>
        </div>
        <DataTable columns={columns} 
          data={cars.data} 
          serverPagination={paginationData}
          
          onServerPageChange={handlePageChange} /> {/* Pass the cars.data to DataTable */}
      </div>
    </AppLayout>
  );
}
