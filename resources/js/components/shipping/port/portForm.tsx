// src/components/car/settings/port/PortForm.tsx

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import React, { useState, useEffect } from 'react';

// Reusing types
interface CountryItem {
    id: number;
    country_name: string;
}
interface PortItem {
    id: number;
    name: string;
    code: string;
    country_id: number;
    country: CountryItem;
}

// Define the base type for data that the server expects
type PortFormData = {
    country_id: number;
    name: string;
    code: string;
};

// Define the full Inertia form type
type PortInertiaForm = PortFormData & {
    _method?: 'patch';
};

interface PortFormProps {
    countries: CountryItem[]; 
    port?: PortItem;        
}

const PortForm: React.FC<PortFormProps> = ({ port, countries }) => {
    const isUpdate = !!port;
    const title = isUpdate ? `Update ${port?.name}` : 'Create New Port';
    const routeName = isUpdate ? 'port.update' : 'port.store';
    const submitText = isUpdate ? 'Update Port' : 'Create Port';

    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<PortInertiaForm>({
        _method: isUpdate ? 'patch' : undefined,
        country_id: isUpdate ? port!.country_id : countries[0]?.id || 0,
        name: isUpdate ? port!.name : "",
        code: isUpdate ? port!.code : "",
    });

    // Reset form state when dialog opens/closes
    useEffect(() => {
        if (open) {
            setData({
                _method: isUpdate ? 'patch' : undefined,
                country_id: isUpdate ? port!.country_id : countries[0]?.id || 0,
                name: isUpdate ? port!.name : "",
                code: isUpdate ? port!.code : "",
            });
        };
    }, [open, isUpdate, port, countries, reset]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const routeParams = isUpdate ? [port!.id] : [];

        post(route(routeName, ...routeParams), {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={isUpdate ? 'outline' : 'default'} size={isUpdate ? 'icon' : 'default'}>
                    {isUpdate ? <Pencil className="h-4 w-4" /> : 'Add New Port'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription/>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Country Selector */}
                    <div>
                        <Label htmlFor="country_id">Select Country</Label>
                        <Select
                            onValueChange={(value) => setData('country_id', parseInt(value))}
                            value={data.country_id?.toString() || ""}
                            disabled={countries.length === 0}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a Country" />
                            </SelectTrigger>
                            <SelectContent>
                                {countries.map(country => (
                                    <SelectItem key={country.id} value={country.id.toString()}>
                                        {country.country_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.country_id} />
                    </div>

                    {/* Port Name */}
                    <div>
                        <Label htmlFor="name">Port Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Code (Optional) */}
                    <div>
                        <Label htmlFor="code">Port Code (Optional)</Label>
                        <Input
                            id="code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                        />
                        <InputError message={errors.code} />
                    </div>

                    <Button type="submit" disabled={processing} className="w-full">
                        {processing ? 'Submitting...' : submitText}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PortForm;