import AppLayout from '@/layouts/app-layout';
import { columns } from '@/components/order/columns';
import { OrderDataTable } from '@/components/order/data-table'; 
import { Head, router } from '@inertiajs/react';
import { Order } from '@/lib/object';

interface Props {
    orders: {
        data: Order[];
        meta: { current_page: number; per_page: number; last_page: number; };
    };
    filters: {
        sort?: string;
        direction?: string;
        search?: string;
        role?: string;
        [key: string]: unknown;
    };
}

export default function List({ orders, filters }: Props) {
    return (
        <AppLayout>
            <Head title="Order Management" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Orders</h1>
                <OrderDataTable 
                    columns={columns} 
                    data={orders.data} 
                    filters={filters}
                    serverPagination={{
                        pageIndex: orders.meta.current_page - 1,
                        pageSize: orders.meta.per_page,
                        pageCount: orders.meta.last_page
                    }}
                    onServerPageChange={(page, pageSize) => {
                        router.get(route('order.index'), { ...filters, page, per_page: pageSize });
                    }}
                />
            </div>
        </AppLayout>
    );
}