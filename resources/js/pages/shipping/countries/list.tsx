// src/pages/car/settings/country.tsx

import { Head, router } from '@inertiajs/react';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
// You will need to create these components:
import AppLayout from '@/layouts/app-layout';
import ShippingLayout from '@/layouts/shipping/layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { timeFormat } from '@/lib/utils';
import { X } from 'lucide-react';
import CountryForm from '@/components/shipping/country/countryForm';


export interface CountryItem {
    id: number;
    country_name: string; 
    code: string;
    prefix: string;
    import_regulation_information:string;
    currency: string;
    flags: string | null; 
    created_at: string;
    updated_at: string;
}

interface CountryProps {
    countries: { 
        data: CountryItem[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Car brand settings',
        href: '/shipping/countries/list',
    },
];

export default function CountryIndex({ countries }: CountryProps) {
  
  function handleDelete(id: number) {
    if (!window.confirm('Are you sure you want to delete this country? This will also delete associated ports and shipping costs.')) return;

    router.delete(`/shipping/countries/${id}`, {
      preserveScroll: true,
      onSuccess: () => {

      },
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <ShippingLayout>
        <Head title="Country Settings" />
        <HeadingSmall title="Country Management" />
        
        <CountryForm/>
        <div className="flex justify-end mb-4">
          {/* You need to create this component in components/car/settings/country/create.tsx */}
         
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Flag</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Prefix</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {countries.data.length > 0 ? (
                countries.data.map((country) => (
                  <TableRow key={country.id}>
                    <TableCell>
                      {country.flags ? (
                        <img
                          src={country.flags}
                          alt={`${country.country_name} Flag`}
                          className="w-10 h-7 object-cover rounded shadow"
                        />
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{country.country_name}</TableCell>
                    <TableCell>{country.code}</TableCell>
                    <TableCell>{country.prefix}</TableCell>
                    <TableCell>{country.currency}</TableCell>
                    <TableCell>{timeFormat(country.created_at)}</TableCell>
                    <TableCell className="text-right">
                      {/* You need to create this component */}
                      <CountryForm country={country} />
                      <Button className='ml-2' size="icon" variant="destructive" onClick={() => handleDelete(country.id)}>
                        <X/>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No countries found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* Pagination logic here if needed */}
      </ShippingLayout>
    </AppLayout>
  );
}
