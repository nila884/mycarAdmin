import { Head, router } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import Create from '@/components/car/settings/fuel/create';
import Update from '@/components/car/settings/fuel/update';

import AppLayout from '@/layouts/app-layout';
import CarSettingLayout from '@/layouts/car/settings/layout';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { timeFormat } from '@/lib/utils'; // Import the timeFormat function
import { X } from 'lucide-react';


// Define the type for a single fuel item
interface FuelItem {
    id: number;
    fuel_type: string;
    created_at: string;
    updated_at: string;
}

// Define the props for the fuel component
interface FuelProps {
    fuels: FuelItem[]; // Array of fuel items passed from backend
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Car fuel settings',
        href: '/car/settings/fuel',
    },
];

// Update the component to accept props
export default function fuel({ fuels }: FuelProps) { // Destructure fuels from props

  function handleDelete(id: number) {
  if (!window.confirm('Are you sure you want to delete this fuel?')) return;

  router.delete(`/car/settings/fuel/${id}`, {
    preserveScroll: true,
    onSuccess: () => {
    },
  });
}
  return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Car fuel settings" />

            <CarSettingLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Car fuel settings" description="Add new ,Update and delete car fuels name" />

                    <Create />

                    <Table className="min-w-2xl">
                        <TableCaption>A list of car fuel.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">fuel name</TableHead>
                                <TableHead>Created at</TableHead>
                                <TableHead>Last update</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Map over the fuels data to render table rows */}
                            {fuels.length > 0 ? (
                                fuels.map((fuel) => (
                                    <TableRow key={fuel.id}>
                                        <TableCell className="font-medium">{fuel.fuel_type.toUpperCase()}</TableCell>
                                        <TableCell>{timeFormat(fuel.created_at)}</TableCell>
                                        <TableCell>{timeFormat(fuel.updated_at)}</TableCell>
                                                                            <TableCell className="text-right">
                                                                          
      
    <Update fuel={fuel} />
    <Button className='ml-2' size="icon" variant="destructive" onClick={() => handleDelete(fuel.id)}><X/></Button>
      
                                         </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        No fuels found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CarSettingLayout>
        </AppLayout>
    );
}