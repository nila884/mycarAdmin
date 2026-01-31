import AgencyForm from '@/components/shipping/agency/agencyForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import ShippingLayout from '@/layouts/shipping/layout';
import { DeliveryDriverAgencyObject } from '@/lib/object';
import { Head, router } from '@inertiajs/react';
import { Building2, Trash2, Truck } from 'lucide-react';

interface Props {
    agencies: DeliveryDriverAgencyObject[];
}

export default function AgencyList({ agencies }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to remove this agency? This may affect linked tariffs.')) {
            router.delete(route('shipping.delivery-driver-agency.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Country Settings" />
            <ShippingLayout>
                <div className="space-y-6 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Professional Agencies</h1>
                            <p className="text-gray-500">Manage external logistics partners and their fleet capacity.</p>
                        </div>
                        <AgencyForm />
                    </div>

                    <div className="overflow-hidden rounded-sm border border-gray-100 bg-white">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead>Agency Name</TableHead>
                                    <TableHead>Registration №</TableHead>
                                    <TableHead>Fleet Size</TableHead>
                                    <TableHead>Person</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {agencies.map((agency) => (
                                    <TableRow key={agency.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-emerald-100 p-2">
                                                    <Building2 className="h-4 w-4 text-emerald-600" />
                                                </div>
                                                {agency.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <code className="rounded p-1 text-xs">{agency.business_registration_number}</code>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="gap-1">
                                                <Truck className="h-3 w-3" /> {agency.fleet_size} Units
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div className="font-medium">{agency.person}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <code className="rounded p-1 text-xs">
                                                <div className="text-xs text-gray-400">{agency.phone}</div>
                                                <div className="text-xs text-gray-400">{agency.email}</div>
                                            </code>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <AgencyForm agency={agency} />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => handleDelete(agency.id!)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </ShippingLayout>
        </AppLayout>
    );
}
