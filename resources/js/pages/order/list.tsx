import AppLayout from "@/layouts/app-layout"
import { Head, router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react"
import { Order } from "@/lib/object"
import { DataTable, DataTableFilterBag } from "@/components/order/data-table"
import { columns } from "@/components/order/columns"

// 1. Define the interface for the Paginated Laravel Response
interface PaginatedOrders {
    data: Order[];
    current_page: number;
    per_page: number;
    last_page: number;
    total: number;
}

// 2. Define the props for the Page component
interface ListProps {
    orders: PaginatedOrders;
    filters:DataTableFilterBag ;
}

export default function List({ orders, filters }: ListProps) {
  const paginationData = {
    pageIndex: orders.current_page - 1,
    pageSize: orders.per_page,
    pageCount: orders.last_page,
  }

  const handlePageChange = (page: number, pageSize: number) => {
    const url = new URL(window.location.href)
    const params = Object.fromEntries(url.searchParams.entries())

    params.page = String(page)
    params.per_page = String(pageSize)

    router.get(route("order.index"), params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    })
  }

  return (
    <AppLayout>
      <Head title="Orders Listings" />

      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Orders Inventory</h2>
          {/* <Link href={route("car.create")}>
            <Button>Add New Car</Button>
          </Link> */}
        </div>

        <DataTable
          columns={columns}
          data={orders.data}
          serverPagination={paginationData}
          filters={filters}
          onServerPageChange={handlePageChange}
        />
      </div>
    </AppLayout>
  )
}