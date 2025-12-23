import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ship, CheckCircle2, PlusCircle, Globe } from 'lucide-react';
import { CountryObject, PortObject } from '@/lib/object';
import { DialogDescription } from '@radix-ui/react-dialog';

interface Props {
    country: CountryObject;
    ports: PortObject[];
}

const ManageGateways: React.FC<Props> = ({ country, ports }) => {
    const [open, setOpen] = useState(false);

    // Initial IDs from the backend
    const initialIds = country.gateway_ports?.map(p => p.id) || [];

    const { data, setData, post, processing } = useForm({
        port_ids: initialIds,
    });

    // Sync data if the country object updates
    useEffect(() => {
        if (open) {
            setData('port_ids', country.gateway_ports?.map(p => p.id) || []);
        }
    }, [open, country]);

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
                    <Ship className="w-4 h-4 text-blue-600" /> Gateways
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-slate-400" />
                        Gateways for {country.country_name}
                    </DialogTitle>
            <DialogDescription className=" tex-sm">
                Setup Country ports Gateway.
              </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={submit} className="space-y-4 pt-4">
                    <div className="grid gap-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                        {ports.map(port => {
                            const isSelected = data.port_ids.includes(port.id);
                            return (
                                <div 
                                    key={port.id} 
                                    onClick={() => togglePort(port.id)}
                                    className={`group flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                        isSelected 
                                        ? 'bg-blue-50 border-blue-500 shadow-sm' 
                                        : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                                            {port.name}
                                        </span>
                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                                            {port.country?.country_name}
                                        </span>
                                    </div>
                                    
                                    {/* Visual Indicator: Change color/icon if already selected */}
                                    {isSelected ? (
                                        <div className="flex items-center gap-1 text-blue-600">
                                            <span className="text-[10px] font-bold uppercase">Active Gateway</span>
                                            <CheckCircle2 className="w-5 h-5 fill-blue-600 text-white" />
                                        </div>
                                    ) : (
                                        <PlusCircle className="w-5 h-5 text-slate-300 group-hover:text-slate-500" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="pt-4 border-t flex items-center">
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