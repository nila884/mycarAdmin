import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import Create  from '@/components/car/settings/category/create';

import AppLayout from '@/layouts/app-layout';
import CarSettingLayout from '@/layouts/car/settings/layout';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Car category settings',
        href: '/car/settings/category',
    },
];

export default function Category() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Car Category settings" />

            <CarSettingLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Car category settings" description="Add new ,Update and delete car categories name" />


 <Create/>

<Table>
  <TableCaption>A list of car category.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Category name</TableHead>
      <TableHead>Created at</TableHead>
      <TableHead>last update</TableHead>
      <TableHead className="text-right">Action</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
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
