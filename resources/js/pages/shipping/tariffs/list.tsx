import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ShippingLayout from '@/layouts/shipping/layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, MapPin, Truck, Landmark } from 'lucide-react';
import { DeliveryTariffObject, CountryObject, PortObject, DeliveryDriverAgencyObject, CityObject } from '@/lib/object';
import DeliveryTariffForm from '@/components/shipping/tariff/deliveryTariffForm';

interface Props {
    delivery_tariffs: DeliveryTariffObject[];
    countries: CountryObject[];
    ports: PortObject[];
    agencies:DeliveryDriverAgencyObject[];
}

export default function DeliveryTariffList({ delivery_tariffs, countries, ports,agencies}: Props) {

    const handleDelete = (id: number | string | null) => {
        if (id == null) return;
        const parsedId = typeof id === 'string' ? Number(id) : id;
        if (confirm('Are you sure you want to delete this delivery tariff?')) {
            router.delete(route('delivery-tariffs.destroy', parsedId));
        }
    };

    return (
        <AppLayout>
            <Head title="Delivery & Inland Tariffs" />
            <ShippingLayout>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Inland & Operational Fees</h2>
                        <p className="text-muted-foreground">Manage trucking rates, driver fees, and border clearing costs.</p>
                    </div>
                    <DeliveryTariffForm countries={countries} ports={ports} agencies={agencies} />
                </div>

                <div className="rounded-md border bg-white overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="w-[250px]">Destination</TableHead>
                                <TableHead>Gateway (Origin)</TableHead>
                                <TableHead>Trucking Leg</TableHead>
                                <TableHead>Driver Fee</TableHead>
                                <TableHead>Clearing Fee</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {delivery_tariffs.length > 0 ? delivery_tariffs.map((tariff) => (
                                <TableRow key={tariff.id} className="hover:bg-slate-50/50">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                {/* Precise destination logic */}
                                                <span className="font-semibold text-slate-900">
                                                    {tariff.to_city?.name || tariff.adress_name}
                                                </span>
                                                <span className="text-xs text-slate-500">{tariff.country?.country_name}</span>
                                            </div>
                                        </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {/* Frontend handles display logic based on raw data */}
                                            {tariff.from_port_id ? (
                                                <Landmark className="w-3 h-3 text-orange-500" />
                                            ) : (
                                                <Truck className="w-3 h-3 text-green-500" />
                                            )}
                                            <span className="text-sm font-medium">
                                                {tariff.origin_port?.name || 
                                                tariff.from_city?.name || 
                                                tariff.origin_country?.country_name || 
                                                'Standard Route'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-mono text-blue-700 font-bold">${tariff.tarif_per_tone}</span>
                                            <span className="text-[10px] uppercase text-slate-400 font-bold">Per Tone</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-mono text-slate-600">${tariff.driver_fee}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-mono text-slate-600">${tariff.clearing_fee}</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <DeliveryTariffForm tariff={tariff} countries={countries} ports={ports} agencies={agencies} />
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="text-slate-400 hover:text-red-600"
                                                onClick={() => handleDelete(tariff.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                                        No inland tariffs defined. Start by adding a route gateway.
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