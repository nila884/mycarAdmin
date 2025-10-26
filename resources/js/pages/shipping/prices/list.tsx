// src/pages/car/settings/shipping-cost.tsx

import { Head, router } from '@inertiajs/react';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { timeFormat } from '@/lib/utils';
import { X } from 'lucide-react';
import { PortItem } from '@/pages/shipping/ports/list';
import ShippingCostForm from '@/components/shipping/cost/costForm';
import ShippingLayout from '@/layouts/shipping/layout';

interface ShippingCostItem {
    id: number;
    price: string; 
    is_current: boolean;
    port_id: number;
    port: PortItem; 
    created_at: string;
    updated_at: string;
}

interface ShippingCostProps {
    costs: ShippingCostItem[]; // Assuming the Index method returns a collection
    ports: PortItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Shipping Cost Settings',
        href: 'shipping/prices/list',
    },
];

export default function ShippingCostIndex({ costs,ports }: ShippingCostProps) {
console.log(costs);

  function handleDelete(id: number) {
    if (!window.confirm('Are you sure you want to delete this shipping cost record?')) return;

    router.delete(`/shipping/prices/${id}`, {
      preserveScroll: true,
      onSuccess: () => {
        // Optional: show a toast notification here
      },
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <ShippingLayout>
        <Head title="Shipping Cost Settings" />
        <HeadingSmall title="Shipping Cost Management" />
        
        <div className="flex justify-end mb-4">
          {/* You need to create this component in components/car/settings/shipping-cost/create.tsx */}
          <ShippingCostForm  ports={ports}  />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead>Port</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costs.length > 0 ? (
                costs.map((cost) => (
                  <TableRow key={cost.id} className={cost.is_current ? 'bg-green-50/50' : ''}>
                    <TableCell>{cost.port.country.name}</TableCell>
                    <TableCell className="font-medium">{cost.port.name}</TableCell>
                    <TableCell className={cost.is_current ? 'font-bold text-green-600' : 'text-gray-700'}>
                      ${cost.price}
                    </TableCell>
                    <TableCell>
                      {cost.is_current ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          CURRENT
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                          Inactive
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{timeFormat(cost.updated_at)}</TableCell>
                    <TableCell className="text-right">
                      {/* You need to create this component */}
                      <ShippingCostForm cost={cost}  ports={ports}  />
                      <Button className='ml-2' size="icon" variant="destructive" onClick={() => handleDelete(cost.id)}>
                        <X/>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No shipping costs found.
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