import DeliveryTariffForm from '@/components/shipping/tariff/deliveryTariffForm';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import ShippingLayout from '@/layouts/shipping/layout';
import { CountryObject, DeliveryDriverAgencyObject, DeliveryTariffObject, PortObject } from '@/lib/object';
import { Head, router } from '@inertiajs/react';
import { Landmark, Trash2, Truck } from 'lucide-react';

interface Props {
    delivery_tariffs: DeliveryTariffObject[];
    countries: CountryObject[];
    ports: PortObject[];
    agencies: DeliveryDriverAgencyObject[];
}

export default function DeliveryTariffList({ delivery_tariffs, countries, ports, agencies }: Props) {
    const handleDelete = (id: number | string | null) => {
        if (id == null) return;
        const parsedId = typeof id === 'string' ? Number(id) : id;
        if (confirm('Are you sure you want to delete this delivery tariff?')) {
            router.delete(route('shipping.delivery-tariffs.destroy', parsedId));
        }
    };

    return (
        <AppLayout>
            <Head title="Delivery & Inland Tariffs" />
            <ShippingLayout>
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Inland & Operational Fees</h2>
                        <p className="text-muted-foreground">Manage trucking rates, driver fees, and border clearing costs.</p>
                    </div>
                    <DeliveryTariffForm countries={countries} ports={ports} agencies={agencies} />
                </div>

                <div className="overflow-hidden rounded-md border bg-white">
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
                            {delivery_tariffs.length > 0 ? (
                                delivery_tariffs.map((tariff) => (
                                    <TableRow key={tariff.id} className="hover:bg-slate-50/50">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                {/* Precise destination logic */}
                                                <span className="font-semibold text-slate-900">{tariff.to_city?.name || tariff.adress_name}</span>
                                                <span className="text-xs text-slate-500">{tariff.country?.country_name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {/* Frontend handles display logic based on raw data */}
                                                {tariff.from_port_id ? (
                                                    <Landmark className="h-3 w-3 text-orange-500" />
                                                ) : (
                                                    <Truck className="h-3 w-3 text-green-500" />
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
                                                <span className="font-mono font-bold text-blue-700">${tariff.tarif_per_tone}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Per Tone</span>
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
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
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
