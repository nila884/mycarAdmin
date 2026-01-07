import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DeliveryDriverAgencyObject } from '@/lib/object';
import { useForm } from '@inertiajs/react';
import { Building2, Pencil, Phone, Plus, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';

interface Props {
    agency?: DeliveryDriverAgencyObject;
}

const AgencyForm: React.FC<Props> = ({ agency }) => {
    const isUpdate = !!agency;
    const [open, setOpen] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: agency?.name || '',
        business_registration_number: agency?.business_registration_number || '',
        tax_identification_number: agency?.tax_identification_number || '',
        contact_person: agency?.person || '',
        phone: agency?.phone || '',
        email: agency?.email || '',
        address: agency?.address || '',
        fleet_size: agency?.fleet_size || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check your artisan route:list for the exact Name column value
        if (isUpdate) {
            // Use PUT for updates (use the existing `put` from useForm)
            put(route('delivery-driver-agency.update', agency?.id ?? undefined), {
                onSuccess: () => setOpen(false),
            });
        } else {
            // Ensure this matches the Name of the POST shipping/agencies route
            post(route('delivery-driver-agency.store'), {
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
                <Button variant={isUpdate ? 'ghost' : 'default'} size={isUpdate ? 'icon' : 'sm'} className="gap-2">
                    {isUpdate ? (
                        <Pencil className="h-4 w-4" />
                    ) : (
                        <>
                            <Plus className="h-4 w-4" /> Register Agency
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {isUpdate ? 'Update Agency Details' : 'Register New Delivery Agency'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2">
                            <Label>Company Name</Label>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Legal entity name" />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-1">
                                <ShieldCheck className="h-3 w-3" /> Registration №
                            </Label>
                            <Input
                                value={data.business_registration_number}
                                onChange={(e) => setData('business_registration_number', e.target.value)}
                            />
                            <InputError message={errors.business_registration_number} />
                        </div>

                        <div className="space-y-2">
                            <Label>Fleet Size (Trucks)</Label>
                            <Input type="number" value={data.fleet_size} onChange={(e) => setData('fleet_size', e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-3 rounded-sm bg-gray-50 p-3">
                        <Label className="flex items-center gap-2 text-xs font-bold uppercase">
                            <Phone className="h-3 w-3" /> Contact Information
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                placeholder="Contact Person"
                                value={data.contact_person}
                                onChange={(e) => setData('contact_person', e.target.value)}
                                className="bg-white"
                            />
                            <Input
                                placeholder="Phone Number"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="bg-white"
                            />
                        </div>
                        <Input
                            placeholder="Email Address"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="bg-white"
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={processing}>
                        {isUpdate ? 'Save Changes' : 'Confirm Registration'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AgencyForm;
