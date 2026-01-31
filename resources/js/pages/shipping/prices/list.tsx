import ShippingRateForm from '@/components/shipping/rate/shippingRateForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import ShippingLayout from '@/layouts/shipping/layout';
import { CountryObject, PortObject, ShippingRateObject } from '@/lib/object';
import { Head, router } from '@inertiajs/react';
import { ArrowRight, Ship, Trash2, Truck } from 'lucide-react';

interface Props {
    shipping_rates: ShippingRateObject[];
    countries: CountryObject[];
    ports: PortObject[];
}

export default function ShippingRateList({ shipping_rates, countries, ports }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Delete this shipping route?')) {
            router.delete(route('shipping.shipping-rates.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Ocean Freight Rates" />
            <ShippingLayout>
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Shipping Rates</h2>
                        <p className="text-muted-foreground">Define ocean freight costs from global origins to entry ports.</p>
                    </div>
                    <ShippingRateForm countries={countries} ports={ports} />
                </div>

                <div className="overflow-hidden rounded-md border bg-white">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead>Route Path</TableHead>
                                <TableHead>Mode</TableHead>
                                <TableHead>RoRo Price</TableHead>
                                <TableHead>Container Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {shipping_rates.length > 0 ? (
                                shipping_rates.map((rate) => (
                                    <TableRow key={rate.id} className="hover:bg-slate-50/50">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{rate.from_country?.country_name}</span>
                                                <ArrowRight className="h-3 w-3 text-slate-400" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-blue-600">
                                                        {rate.to_port?.name || rate.to_country?.country_name}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 uppercase">Gateway</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="gap-1 font-normal">
                                                {rate.transport_mode === 'sea' ? <Ship className="h-3 w-3" /> : <Truck className="h-3 w-3" />}
                                                {rate.transport_mode.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono font-bold text-slate-700">${rate.price_roro}</TableCell>
                                        <TableCell className="font-mono font-bold text-slate-700">${rate.price_container}</TableCell>
                                        <TableCell>
                                            {rate.is_current ? (
                                                <Badge className="bg-green-600 hover:bg-green-600">Active</Badge>
                                            ) : (
                                                <Badge variant="secondary">History</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <ShippingRateForm rate={rate} countries={countries} ports={ports} />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-slate-400 hover:text-red-600"
                                                    onClick={() => handleDelete(rate.id)}
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
                                        No shipping rates found. Configure your first route to start calculations.
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
