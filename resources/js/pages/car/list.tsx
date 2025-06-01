import AppLayout from "@/layouts/app-layout";
import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

let data: Payment[] = [
    {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "test@test.com"
    },
    {
        id: "728ed52g",
        amount: 200,
        status: "success",
        email: "test2@test.com",
    }
]

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Car settings',
        href: '/car/settings',
    },
];
export default function list() {

  return (
            <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />
                <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
            </AppLayout>

  )
}