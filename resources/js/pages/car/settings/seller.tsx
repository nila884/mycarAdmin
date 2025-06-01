import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import Create  from '@/components/car/settings/seller/create';

import AppLayout from '@/layouts/app-layout';
import CarSettingLayout from '@/layouts/car/settings/layout';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Car seller settings',
        href: '/car/settings/seller',
    },
];

export default function Seller() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="seller settings" />

            <CarSettingLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Car seller settings" description="Add new ,Update and delete car sellers name" />


 <Create/>

<Table>
  <TableCaption>A list of car sellers.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Name</TableHead>
        <TableHead className="">Cell phone</TableHead>
          <TableHead className="">Email</TableHead>
            <TableHead className="">Country</TableHead>
            <TableHead className=" ">Adress</TableHead>
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
       <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
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
