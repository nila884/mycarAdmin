import { Head, router } from '@inertiajs/react';
import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import ShippingLayout from '@/layouts/shipping/layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { timeFormat } from '@/lib/utils';
import { X } from 'lucide-react';
import CountryForm from '@/components/shipping/country/countryForm';
import { CountryObject, PortObject } from '@/lib/object';
import ManageGateways from '@/components/shipping/country/manageGateway';
import ManageCities from '@/components/shipping/country/manageCity';

interface Props {
    countries: { 
      data: CountryObject[] ,
    };
    ports:  PortObject[];
    
}

export default function CountryIndex({ countries,ports }: Props) {
  const handleDelete = (id: number) => {
    if (confirm('Are you sure? This will delete associated ports and rates.')) {
      router.delete(route('country.destroy', id));
    }
  };

  return (
    <AppLayout>
      <Head title="Country Settings" />
      <ShippingLayout>
        <div className="flex justify-between items-center mb-6">
            <HeadingSmall title="Country Management" />
            <CountryForm />
        </div>

        <div className="rounded-md border bg-white overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[80px]">Flag</TableHead>
                <TableHead>Country Name</TableHead>
                <TableHead>ISO Code</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {countries.data.length > 0 ? (
                countries.data.map((country) => (
                  <TableRow key={country.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      {country.flags ? (
                        <img src={country.flags} alt="flag" className="w-10 h-7 object-cover rounded shadow-sm border" />
                      ) : (
                        <div className="w-10 h-7 bg-slate-100 rounded flex items-center justify-center text-[10px] text-slate-400">N/A</div>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700">{country.country_name}</TableCell>
                    <TableCell className="text-slate-500 font-mono text-xs">{country.code}</TableCell>
                    <TableCell>{country.currency}</TableCell>
                    <TableCell className="text-slate-400 text-xs">{country.created_at}</TableCell>
                          <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                  {/* New City Management Button */}
                                  <ManageCities country={country} />
                                  
                                  {/* Existing Gateway Management */}
                                  <ManageGateways country={country} ports={ports} />
                                  
                                  {/* Other actions (Edit/Delete) */}
                              </div>
                          </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-slate-500">No countries found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </ShippingLayout>
    </AppLayout>
  );
}