import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CountryObject, PortObject } from '@/lib/object';
import { useForm } from '@inertiajs/react';
import { DialogDescription } from '@radix-ui/react-dialog';
import { CheckCircle2, Globe, PlusCircle, Ship } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Props {
    country: CountryObject;
    ports: PortObject[];
}

const ManageGateways: React.FC<Props> = ({ country, ports }) => {
    const [open, setOpen] = useState(false);

    // Initial IDs from the backend
    const initialIds = country.gateway_ports?.map((p) => p.id) || [];

    const { data, setData, post, processing } = useForm({
        port_ids: initialIds,
    });

    // Sync data if the country object updates
    useEffect(() => {
        if (open) {
            setData('port_ids', country.gateway_ports?.map((p) => p.id) || []);
        }
    }, [open, country,setData]);

    const togglePort = (portId: number) => {
        const current = [...data.port_ids];
        const index = current.indexOf(portId);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(portId);
        }
        setData('port_ids', current);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('country.gateways.update', country.id), {
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-dashed hover:border-blue-400 hover:bg-blue-50">
                    <Ship className="h-4 w-4 text-blue-600" /> Gateways
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-slate-400" />
                        Gateways for {country.country_name}
                    </DialogTitle>
                    <DialogDescription className="tex-sm">Setup Country ports Gateway.</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4 pt-4">
                    <div className="custom-scrollbar grid max-h-[350px] gap-2 overflow-y-auto pr-2">
                        {ports.map((port) => {
                            const isSelected = data.port_ids.includes(port.id);
                            return (
                                <div
                                    key={port.id}
                                    onClick={() => togglePort(port.id)}
                                    className={`group flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all duration-200 ${
                                        isSelected
                                            ? 'border-blue-500 bg-blue-50 shadow-sm'
                                            : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                                            {port.name}
                                        </span>
                                        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                            {port.country?.country_name}
                                        </span>
                                    </div>

                                    {/* Visual Indicator: Change color/icon if already selected */}
                                    {isSelected ? (
                                        <div className="flex items-center gap-1 text-blue-600">
                                            <span className="text-[10px] font-bold uppercase">Active Gateway</span>
                                            <CheckCircle2 className="h-5 w-5 fill-blue-600 text-white" />
                                        </div>
                                    ) : (
                                        <PlusCircle className="h-5 w-5 text-slate-300 group-hover:text-slate-500" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center border-t pt-4">
                        <Button type="submit" className="w-ful" disabled={processing}>
                            {processing ? 'Saving Assignments...' : 'Update Gateway Network'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ManageGateways;
