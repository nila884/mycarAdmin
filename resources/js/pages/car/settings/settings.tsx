import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import CarSettingLayout from '@/layouts/car/settings/layout';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Car settings',
        href: 'carsettings',
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <CarSettingLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Car settings parametter" description="Update your account's appearance settings" />
                </div>
            </CarSettingLayout>
        </AppLayout>
    );
}
