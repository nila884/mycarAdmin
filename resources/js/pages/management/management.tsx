import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import Layout from '@/layouts/management/layout';
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
                    <HeadingSmall title="Management" description="Manage user, role and permissions" />
                </div>
            </Layout>
        </AppLayout>
    );
}
