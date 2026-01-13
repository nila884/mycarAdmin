import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import Layout from '@/layouts/shipping/layout';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Shipping',
        href: '/shipping/shipping',
    },
];

export default function Shipping() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Shipping settings" />

            <Layout>
                <div className="space-y-6">
                    <HeadingSmall title="Shippings parametter" description="Car Shipping countries, ports and prices" />
                </div>
            </Layout>
        </AppLayout>
    );
}
