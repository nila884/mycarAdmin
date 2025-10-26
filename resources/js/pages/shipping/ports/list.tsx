// src/pages/car/settings/port.tsx

import { Head, router } from '@inertiajs/react';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
// You will need to create these components:
import AppLayout from '@/layouts/app-layout';
import CarSettingLayout from '@/layouts/car/settings/layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { timeFormat } from '@/lib/utils';
import ShippingLayout from '@/layouts/shipping/layout';
import { X } from 'lucide-react';
import PortForm from '@/components/shipping/port/portForm';
import { CountryItem } from '@/pages/shipping/countries/list';

// Define the type for a single Port item, matching PortResource.php
export interface PortItem {
    id: number;
    name: string;
    code: string;
    country_id: number;
    country: CountryItem; // Included because the Service eager loads it
    created_at: string;
    updated_at: string;
}


interface PortProps {
    ports: PortItem[];
    countries: CountryItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Port Settings',
        href: '/car/settings/port',
    },
];

export default function PortIndex({ ports,countries }: PortProps) {

  function handleDelete(id: number) {
    if (!window.confirm('Are you sure you want to delete this port? This will also delete associated shipping cost records.')) 
    return;
    router.delete(`/shipping/ports/${id}`, {
      preserveScroll: true,
      onSuccess: () => {
        // Optional: show a toast notification here
      },
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <ShippingLayout> 
        <Head title="Port Settings" />
        <HeadingSmall title="Port Management" />
        
        <div className="flex justify-end mb-4">
          {/* You need to create this component in components/car/settings/port/create.tsx */}
          <PortForm  countries={countries} />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Port Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ports.length > 0 ? (
                ports.map((port) => (
                  <TableRow key={port.id}>
                    <TableCell className="font-medium">{port.name}</TableCell>
                    <TableCell>{port.code || 'N/A'}</TableCell>
                    <TableCell>{port.country.name}</TableCell>
                    <TableCell>{timeFormat(port.created_at)}</TableCell>
                    <TableCell className="text-right">
                      {/* You need to create this component */}
                      <PortForm port={port} countries={countries} />
                      <Button className='ml-2' size="icon" variant="destructive" onClick={() => handleDelete(port.id)}>
                        <X/>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No ports found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </ShippingLayout>
    </AppLayout>
  );
}