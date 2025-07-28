import { Head, router } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import Create from '@/components/car/settings/brand/create';
import Update from '@/components/car/settings/brand/update';

import AppLayout from '@/layouts/app-layout';
import CarSettingLayout from '@/layouts/car/settings/layout';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { timeFormat } from '@/lib/utils'; // Import the timeFormat function
import { X } from 'lucide-react';


// Define the type for a single brand item
interface brandItem {
    id: number;
    brand_name: string;
    logo: string; 
    created_at: string;
    updated_at: string;
}

// Define the props for the brand component
interface brandProps {
    brands: brandItem[]; // Array of brand items passed from backend
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Car brand settings',
        href: '/car/settings/brand',
    },
];

// Update the component to accept props
export default function brand({ brands }: brandProps) { // Destructure brands from props

  function handleDelete(id: number) {
  if (!window.confirm('Are you sure you want to delete this brand?')) return;

  router.delete(`/car/settings/brand/${id}`, {
    preserveScroll: true,
    onSuccess: () => {
      // optional: toast or reload logic
    },
  });
}
  return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Car brand settings" />

            <CarSettingLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Car brand settings" description="Add new ,Update and delete car brands name" />

                    <Create />

                    <Table className="min-w-2xl">
                        <TableCaption>A list of car brand.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">logo</TableHead>
                                <TableHead className="w-[100px]">brand name</TableHead>
                                <TableHead>Created at</TableHead>
                                <TableHead>Last update</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Map over the brands data to render table rows */}
                            {brands.length > 0 ? (
                                brands.map((brand) => (
                                    <TableRow key={brand.id}>
                                        <TableCell>
                                            <img
                                                 src={brand.logo}
                                                alt={brand.brand_name}
                                                className="w-10 h-10 object-cover rounded"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{brand.brand_name.toUpperCase()}</TableCell>
                                        <TableCell>{timeFormat(brand.created_at)}</TableCell>
                                        <TableCell>{timeFormat(brand.updated_at)}</TableCell>
                                                                            <TableCell className="text-right">
                                                                          
      

   
       <Update brand={brand} />
  
    <Button className='ml-2' size="icon" variant="destructive" onClick={() => handleDelete(brand.id)}><X/></Button>

      
                                         </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        No brands found.
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