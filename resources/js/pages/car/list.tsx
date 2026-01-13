import AppLayout from "@/layouts/app-layout"
import { columns } from "@/components/car/columns"
import { DataTable, DataTableFilterBag } from "@/components/car/data-table"
import { Head, router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react"
import { CarDetailData } from "@/lib/object"

// 1. Define the interface for the Paginated Laravel Response
interface PaginatedCars {
    data: CarDetailData[];
    current_page: number;
    per_page: number;
    last_page: number;
    total: number;
}

// 2. Define the props for the Page component
interface ListProps {
    cars: PaginatedCars;
    filters:DataTableFilterBag ;
}

export default function List({ cars, filters }: ListProps) {
  const paginationData = {
    pageIndex: cars.current_page - 1,
    pageSize: cars.per_page,
    pageCount: cars.last_page,
  }

  const handlePageChange = (page: number, pageSize: number) => {
    const url = new URL(window.location.href)
    const params = Object.fromEntries(url.searchParams.entries())

    params.page = String(page)
    params.per_page = String(pageSize)

    router.get(route("car.index"), params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    })
  }

  return (
    <AppLayout>
      <Head title="Cars Listings" />

      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Vehicle Inventory</h2>
          <Link href={route("car.create")}>
            <Button>Add New Car</Button>
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={cars.data}
          serverPagination={paginationData}
          filters={filters}
          onServerPageChange={handlePageChange}
        />
      </div>
    </AppLayout>
  )
}