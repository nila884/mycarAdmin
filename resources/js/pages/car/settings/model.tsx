import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import Create  from '@/components/car/settings/model/create';

import AppLayout from '@/layouts/app-layout';
import CarSettingLayout from '@/layouts/car/settings/layout';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Car model settings',
        href: '/car/settings/model',
    },
];

export default function Model() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Model settings" />

            <CarSettingLayout>
                <div className="space-y-6">
                           <HeadingSmall title="Car Model settings" description="Add new ,Update and delete car Models name" />
               
               
 <Create/>

<Table>
  <TableCaption>A list of your car model.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Model name</TableHead>
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
