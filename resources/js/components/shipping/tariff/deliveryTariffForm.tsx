import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { Pencil, Plus, Landmark, Anchor, MapPin, Building2, Truck, Box, Navigation } from 'lucide-react';
import React, { useState } from 'react';
import InputError from '@/components/input-error';
import { CountryObject, DeliveryTariffObject, PortObject, DeliveryDriverAgencyObject, CityObject } from '@/lib/object';
import { Switch } from '@/components/ui/switch';

interface Props {
    countries: CountryObject[];
    ports: PortObject[];
    agencies: DeliveryDriverAgencyObject[]; // New prop for agencies
    tariff?: DeliveryTariffObject;
}

const DeliveryTariffForm: React.FC<Props> = ({ tariff, countries, ports, agencies}) => {
    const isUpdate = !!tariff;
    const [open, setOpen] = useState(false);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        from_country_id: tariff?.from_country_id?.toString() || '',
        from_port_id: tariff?.from_port_id?.toString() || '',
        from_city_id:tariff?.from_city_id?.toString() || '', // Precision Origin City
        country_id: tariff?.country?.id.toString() || '',
        to_city_id: (tariff as any)?.to_city_id?.toString() || '',     // Precision Destination City
        adress_name: tariff?.adress_name || '',
        service_type: (tariff as any)?.service_type || 'individual_driver',
        delivery_method: (tariff as any)?.delivery_method || 'drive_away',
        delivery_driver_agency_id: (tariff as any)?.delivery_driver_agency_id?.toString() || '',
        tarif_per_tone: tariff?.tarif_per_tone || '',
        driver_fee: tariff?.driver_fee || '',
        clearing_fee: tariff?.clearing_fee || '',
        agency_service_fee: (tariff as any)?.agency_service_fee || '',
        is_current: tariff?.is_current ?? false,
        // weight_range: tariff?.weight_range || 'Standard',
    });

    // Filtering lists based on selection
    const filteredOriginPorts = ports.filter(p => p.country_id.toString() === data.from_country_id);
    const originCities = countries.find(c => c.id.toString() === data.from_country_id)?.cities || [];
    const destinationCities = countries.find(c => c.id.toString() === data.country_id)?.cities || [];

    const calculateTotal = () => {
    const base = Number(data.tarif_per_tone) || 0;
    const clearing = Number(data.clearing_fee) || 0;
    const driver = data.service_type !== 'self_pickup' ? (Number(data.driver_fee) || 0) : 0;
    const agency = data.service_type === 'agency' ? (Number(data.agency_service_fee) || 0) : 0;
    return (base + clearing + driver + agency).toFixed(2);
};

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isUpdate) {
            patch(route('delivery-tariffs.update', tariff?.id?.toString() || ''), {
                onSuccess: () => setOpen(false),
            });
        } else {
            post(route('delivery-tariffs.store'), {
                onSuccess: () => {
                    setOpen(false);
                    reset();
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={isUpdate ? "ghost" : "default"} size={isUpdate ? "icon" : "sm"} className="gap-2">
                    {isUpdate ? <Pencil className="w-4 h-4" /> : <><Plus className="w-4 h-4" /> Add Inland Tariff</>}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isUpdate ? 'Edit Inland Route' : 'Create New Inland Tariff'}</DialogTitle>
                    <DialogDescription>
                        Define the trucking corridor and service level for this route.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* SECTION 1: ROUTE PRECISION */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Departure Gateway */}
                        <div className="p-4 bg-gray-50 rounded-sm space-y-4">
                            <div className="flex items-center gap-2">
                                <Anchor className="w-4 h-4 text-slate-500" />
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Departure (Origin)</Label>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label className="text-[10px] text-slate-400">Country</Label>
                                    <Select value={data.from_country_id} onValueChange={(v) => setData(d => ({ ...d, from_country_id: v, from_port_id: '', from_city_id: '' }))}>
                                        <SelectTrigger className="bg-white h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>{countries.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.country_name}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-slate-400">Port (Optional)</Label>
                                        <Select value={data.from_port_id} onValueChange={(v) => setData('from_port_id', v)} disabled={!data.from_country_id}>
                                            <SelectTrigger className="bg-white h-8 text-xs"><SelectValue placeholder="Port" /></SelectTrigger>
                                            <SelectContent>{filteredOriginPorts.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-slate-400">City (Optional)</Label>
                                        <Select value={data.from_city_id} onValueChange={(v) => setData('from_city_id', v)} disabled={!data.from_country_id}>
                                            <SelectTrigger className="bg-white h-8 text-xs"><SelectValue placeholder="City" /></SelectTrigger>
                                            <SelectContent>{originCities.map(city => <SelectItem key={city.id} value={city.id.toString()}>{city.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Final Destination */}
                        <div className="p-4 bg-gray-50 rounded-sm space-y-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-500" />
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Final Destination</Label>
                            </div>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label className="text-[10px] text-slate-400">Country</Label>
                                    <Select value={data.country_id} onValueChange={(v) => setData(d => ({ ...d, country_id: v, to_city_id: '' }))}>
                                        <SelectTrigger className="bg-white h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>{countries.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.country_name}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] text-slate-400">Precision City</Label>
                                    <Select value={data.to_city_id} onValueChange={(v) => setData('to_city_id', v)} disabled={!data.country_id}>
                                        <SelectTrigger className="bg-white h-8 text-xs"><SelectValue placeholder="Select City" /></SelectTrigger>
                                        <SelectContent>{destinationCities.map(city => <SelectItem key={city.id} value={city.id.toString()}>{city.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: TRANSPORT & SERVICE LOGIC */}
                    <div className="grid grid-cols-2 gap-6 p-4 border rounded-sm">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Navigation className="w-4 h-4 text-slate-500" />
                                <Label className="text-xs font-bold uppercase">Transport Method</Label>
                            </div>
                            <Select value={data.delivery_method} onValueChange={(v) => setData('delivery_method', v)}>
                                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="drive_away">Drive-Away (On-wheels)</SelectItem>
                                    <SelectItem value="car_carrier">Car Carrier (Truck)</SelectItem>
                                    <SelectItem value="container">Shipping Container</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-slate-500" />
                                <Label className="text-xs font-bold uppercase">Service Provider</Label>
                            </div>
                            <Select value={data.service_type} onValueChange={(v) => setData('service_type', v)}>
                                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="self_pickup">Self-Pickup (No Driver Fee)</SelectItem>
                                    <SelectItem value="individual_driver">Individual Driver</SelectItem>
                                    <SelectItem value="agency">Professional Agency</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Conditional Agency Selection */}
                    {data.service_type === 'agency' && (
                        <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-sm space-y-2">
                            <Label className="text-xs font-bold text-emerald-700">Link to Agency</Label>
                            <Select value={data.delivery_driver_agency_id} onValueChange={(v) => setData('delivery_driver_agency_id', v)}>
                                <SelectTrigger className="bg-white"><SelectValue placeholder="Select Agency" /></SelectTrigger>
                                <SelectContent>
                                    {agencies
                                        .filter(a => a.id != null)
                                        .map(a => (
                                            <SelectItem key={a.id!.toString()} value={a.id!.toString()}>{a.name}</SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* SECTION 3: PRICING BREAKDOWN */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Landmark className="w-4 h-4 text-slate-500" />
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Inland Fee Breakdown (USD)</Label>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[11px]">Trucking/Tone</Label>
                                <Input type="number" value={data.tarif_per_tone} onChange={e => setData('tarif_per_tone', e.target.value)} disabled={data.service_type === 'self_pickup'} />
                                <InputError message={errors.tarif_per_tone} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px]">Clearing Fee</Label>
                                <Input type="number" value={data.clearing_fee} onChange={e => setData('clearing_fee', e.target.value)} />
                                <InputError message={errors.clearing_fee} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px]">Driver Fee</Label>
                                <Input type="number" value={data.driver_fee} onChange={e => setData('driver_fee', e.target.value)} disabled={data.service_type === 'self_pickup'} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px]">Agency Fee</Label>
                                <Input type="number" value={data.agency_service_fee} onChange={e => setData('agency_service_fee', e.target.value)} disabled={data.service_type !== 'agency'} />
                            </div>
                        </div>
                    </div>
                                            {/* discount Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="is_current">Current price?</Label>
                          <Switch
                      checked={data.is_current}
                     
                      onCheckedChange={(checked) => {
                        setData('is_current', checked);
                      }}
                      disabled={processing}
                    />
                        
                        <InputError message={errors.is_current} className="mt-2" />
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-md flex justify-between items-center">
                        <span className="text-sm font-bold text-blue-900">Estimated Total Route Cost:</span>
                        <span className="text-lg font-mono font-bold text-blue-700">${calculateTotal()}</span>
                    </div>
                    <Button type="submit" className="w-full" disabled={processing}>
                        {isUpdate ? 'Update Corridor Tariff' : 'Save Inland Route'}
                    </Button>

                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DeliveryTariffForm;