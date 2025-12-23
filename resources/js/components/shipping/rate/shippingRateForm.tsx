import React from 'react';
import { useForm } from '@inertiajs/react';
import { Pencil, Plus, Ship, Truck, Anchor } from 'lucide-react';
// UI Components
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import InputError from '@/components/input-error';
import { CountryObject, PortObject, ShippingRateObject } from '@/lib/object';

interface Props {
    countries: CountryObject[];
    ports: PortObject[];
    rate?: ShippingRateObject; 
}

const ShippingRateForm: React.FC<Props> = ({ rate, countries, ports }) => {
    const isUpdate = !!rate;

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        transport_mode: rate?.transport_mode || 'sea',
        from_country_id: rate?.from_country?.id.toString() || '',
        from_port_id: rate?.from_port?.id.toString() || '', // New field for Origin Port
        to_country_id: rate?.to_country?.id.toString() || '',
        to_port_id: rate?.to_port?.id.toString() || '',
        price_roro: rate?.price_roro || '',
        price_container: rate?.price_container || '',
        is_current: rate?.is_current ?? true,
    });

    // Filter ports for the Origin (e.g., Busan/Incheon for S. Korea)
    const originPorts = ports.filter(p => p.country_id.toString() === data.from_country_id);

    // Filter ports/gateways for the Destination (e.g., Mombasa for Rwanda)
    const selectedDestCountry = countries.find(c => c.id.toString() === data.to_country_id);
    const destinationPorts = ports.filter(port => {
        const isPhysicalMatch = port.country_id.toString() === data.to_country_id;
        const isGatewayMatch = selectedDestCountry?.gateway_ports?.some(gp => gp.id === port.id);
        return isPhysicalMatch || isGatewayMatch;
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isUpdate) {
            patch(route('shipping-rates.update', rate.id));
        } else {
            post(route('shipping-rates.store'), { onSuccess: () => reset() });
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={isUpdate ? "ghost" : "default"} size={isUpdate ? "icon" : "sm"}>
                    {isUpdate ? <Pencil className="w-4 h-4" /> : <><Plus className="mr-2 h-4 w-4" /> Add Rate</>}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>{isUpdate ? 'Edit Shipping Route' : 'Add New Shipping Route'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-6">
                    
                    {/* Origin Section */}
                    <div className="space-y-4 p-4 bg-gray-50 rounded-sm">
                        <div className="flex items-center gap-2 text-sm font-bold  uppercase tracking-wider">
                            <Anchor className="w-4 h-4" /> Departure (Origin)
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Origin Country</Label>
                                <Select value={data.from_country_id} onValueChange={(v) => {
                                    setData(d => ({ ...d, from_country_id: v, from_port_id: '' }));
                                }}>
                                    <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                                    <SelectContent>
                                        {countries.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.country_name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.from_country_id} />
                            </div>
                            <div className="space-y-2">
                                <Label>Departure Port</Label>
                                <Select value={data.from_port_id} onValueChange={(v) => setData('from_port_id', v)} disabled={!data.from_country_id}>
                                    <SelectTrigger><SelectValue placeholder="Select Port" /></SelectTrigger>
                                    <SelectContent>
                                        {originPorts.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.from_port_id} />
                            </div>
                        </div>
                    </div>

                    {/* Destination Section */}
                    <div className="space-y-4 p-4  bg-gray-50 rounded-sm">
                        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                            <Ship className="w-4 h-4" /> Arrival (Destination)
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Dest. Country</Label>
                                <Select value={data.to_country_id} onValueChange={(v) => {
                                    setData(d => ({ ...d, to_country_id: v, to_port_id: '' }));
                                }}>
                                    <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                                    <SelectContent>
                                        {countries.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.country_name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Arrival Port/Gateway</Label>
                                <Select value={data.to_port_id} onValueChange={(v) => setData('to_port_id', v)} disabled={!data.to_country_id}>
                                    <SelectTrigger><SelectValue placeholder="Select Port" /></SelectTrigger>
                                    <SelectContent>
                                        {destinationPorts.map(p => (
                                            <SelectItem key={p.id} value={p.id.toString()}>
                                                <div className="flex items-center justify-between w-full gap-2">
                                                    <span>{p.name}</span>
                                                    {p.country_id.toString() !== data.to_country_id && (
                                                        <Badge variant="outline" className="text-[9px] bg-white">Gateway</Badge>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>RoRo Price ($)</Label>
                            <Input type="number" value={data.price_roro} onChange={e => setData('price_roro', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Container ($)</Label>
                            <Input type="number" value={data.price_container} onChange={e => setData('price_container', e.target.value)} />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={processing}>Save Shipping Route</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ShippingRateForm;