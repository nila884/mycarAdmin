import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import Create  from '@/components/car/settings/feature/create';

import AppLayout from '@/layouts/app-layout';
import CarSettingLayout from '@/layouts/car/settings/layout';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Car Feature settings',
        href: '/car/settings/feature',
    },
];

export default function Brand() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Feature settings" />

            <CarSettingLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Car Feature settings" description="Add new ,Update and delete car features name" />


 <Create/>

<Table>
  <TableCaption>A list of car Features.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Brand name</TableHead>
      <TableHead className="w-[100px]">Logo</TableHead>
      <TableHead>Created at</TableHead>
      <TableHead>last update</TableHead>
      <TableHead className="text-right">Action</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell className="font-medium">logo</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>

                </div>
            </CarSettingLayout>
        </AppLayout>
    );
}
