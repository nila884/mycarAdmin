// @/pages/car/list.tsx
import AppLayout from "@/layouts/app-layout"
import { columns } from "@/components/car/columns"
import { DataTable } from "@/components/car/data-table"
import { Head, router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react"

export default function List({ cars, filters }: any) {
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
        <div className="flex justify-end mb-4">
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
