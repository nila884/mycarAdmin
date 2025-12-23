// src/pages/car/settings/port.tsx

import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import ShippingLayout from '@/layouts/shipping/layout';
import { Trash2, Anchor, Globe, MapPin, Calendar } from 'lucide-react';
import PortForm from '@/components/shipping/port/portForm';
import { CountryObject, PortObject } from '@/lib/object';
import { Badge } from '@/components/ui/badge';

interface PortProps {
    ports: PortObject[];
    countries: CountryObject[];
}

export default function PortIndex({ ports, countries }: PortProps) {
    function handleDelete(id: number) {
        if (!window.confirm('Are you sure you want to delete this port? This will also delete associated shipping cost records.')) 
            return;
        router.delete(`/shipping/ports/${id}`, { preserveScroll: true });
    }

    return (
        <AppLayout>
            <Head title="Port Settings" />
            <ShippingLayout> 
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Port Gateways</h2>
                        <p className="text-sm text-muted-foreground">Manage international entry points and logistics hubs.</p>
                    </div>
                    <PortForm countries={countries} />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow>
                                <TableHead className="w-[300px]">Port Identity</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>System Code</TableHead>
                                <TableHead>Last Activity</TableHead>
                                <TableHead className="text-right px-6">Management</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ports.length > 0 ? (
                                ports.map((port) => (
                                    <TableRow key={port.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <Anchor className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900">{port.name}</span>
                                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Gateway Terminal</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Globe className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-sm">{port.country?.country_name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-mono text-[11px] bg-slate-100 text-slate-600 border-none">
                                                {port.code || 'NO-CODE'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span className="text-xs">{port.updated_at}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right px-6">
                                            <div className="flex justify-end gap-2">
                                                <PortForm port={port} countries={countries} />
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(port.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-slate-500 italic">
                                        No ports registered in the system.
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