// src/components/car/settings/port/PortForm.tsx

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CountryObject, PortObject } from '@/lib/object';
import { useForm } from '@inertiajs/react';
import { Anchor, Globe, Pencil, Plus, ShieldCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface PortFormProps {
    countries: CountryObject[];
    port?: PortObject;
}

const PortForm: React.FC<PortFormProps> = ({ port, countries }) => {
    const isUpdate = !!port;
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        _method: isUpdate ? 'patch' : undefined,
        country_id: port?.country_id || countries[0]?.id || '',
        name: port?.name || '',
        code: port?.code || '',
    });

    useEffect(() => {
        if (open && isUpdate && port) {
            setData({
                _method: 'patch',
                country_id: port.country_id,
                name: port.name,
                code: port.code || '',
            });
        }
    }, [open,isUpdate,port,setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const routeName = isUpdate ? 'port.update' : 'port.store';
        const routeParams = isUpdate ? [port!.id] : [];

        post(route(routeName, ...routeParams), {
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={isUpdate ? 'ghost' : 'default'} size={isUpdate ? 'icon' : 'sm'} className="gap-2">
                    {isUpdate ? (
                        <Pencil className="h-4 w-4" />
                    ) : (
                        <>
                            <Plus className="h-4 w-4" /> Add New Port
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Anchor className="h-5 w-5 text-blue-600" />
                        {isUpdate ? 'Update Port Gateway' : 'Register New Port'}
                    </DialogTitle>
                    <DialogDescription>Configure geographical gateway details for logistics tracking.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                    {/* Geographic Context Section */}
                    <div className="space-y-4 rounded-lg border border-slate-100 bg-slate-50 p-4">
                        <div className="mb-1 flex items-center gap-2">
                            <Globe className="h-3.5 w-3.5 text-slate-400" />
                            <Label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Regional Placement</Label>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs text-slate-600">Country Jurisdiction</Label>
                            <Select onValueChange={(v) => setData('country_id', parseInt(v))} value={data.country_id?.toString()}>
                                <SelectTrigger className="h-9 bg-white">
                                    <SelectValue placeholder="Assign to Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map((c) => (
                                        <SelectItem key={c.id} value={c.id.toString()}>
                                            {c.country_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.country_id} />
                        </div>
                    </div>

                    {/* Port Identification Section */}
                    <div className="space-y-4 px-1">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Label className="text-xs font-semibold">Official Port Name</Label>
                            </div>
                            <Input
                                placeholder="e.g. Port of Aqaba"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="h-10"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                                <Label className="text-xs font-semibold">System Port Code</Label>
                            </div>
                            <Input
                                placeholder="e.g. JQAQ"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                className="h-10 font-mono uppercase"
                            />
                            <InputError message={errors.code} />
                        </div>
                    </div>

                    <Button type="submit" disabled={processing} className="h-10 w-full bg-slate-900 hover:bg-slate-800">
                        {isUpdate ? 'Save Gateway Changes' : 'Confirm Port Registration'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PortForm;
