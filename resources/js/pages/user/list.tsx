// @/pages/user/list.tsx
import AppLayout from "@/layouts/app-layout"
import { columns } from "@/components/user/columns"
import { DataTable } from "@/components/user/data-table"
import { Head, router } from "@inertiajs/react"

export default function List({ users, filters }: any) {
  console.log(users);
  
  const paginationData = {
    pageIndex: users.current_page - 1,
    pageSize: users.per_page,
    pageCount: users.last_page,
  }

  const handlePageChange = (page: number, pageSize: number) => {
    const url = new URL(window.location.href)
    const params = Object.fromEntries(url.searchParams.entries())

    params.page = String(page)
    params.per_page = String(pageSize)

    router.get(route("user.index"), params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    })
  }

  return (
    <AppLayout>
      <Head title="users Listings" />

      <div className="container mx-auto py-10">
        {/* <div className="flex justify-end mb-4">
          <Link href={route("user.create")}>
            <Button>Add New user</Button>
          </Link>
        </div> */}

        <DataTable
          columns={columns}
          data={users.data}
          serverPagination={paginationData}
          filters={filters}
          onServerPageChange={handlePageChange}
        />
      </div>
    </AppLayout>
  )
}
