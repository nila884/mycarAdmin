import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import Create  from '@/components/car/settings/version/create';

import AppLayout from '@/layouts/app-layout';
import CarSettingLayout from '@/layouts/car/settings/layout';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Car version settings',
        href: '/car/settings/version',
    },
];

export default function version() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="version settings" />

            <CarSettingLayout>
                <div className="space-y-6">
                           <HeadingSmall title="Car version settings" description="Add new ,Update and delete car versions name" />
               
               
 <Create/>

<Table>
  <TableCaption>A list of your car version.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">version name</TableHead>
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
