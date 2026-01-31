'use client';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CarModelItem } from '@/pages/car/settings/model';
import { VersionItem } from '@/pages/car/settings/version';
import { BrandItem } from '@/pages/car/settings/brand'; // Ensure this type is imported
import { useForm } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';
import React, { useEffect, useState, useMemo } from 'react';

type VersionFormData = {
    version_name: string;
    version_year: string;
    car_model_id: string;
    _method?: 'patch';
};

interface Props {
    version?: VersionItem;
    carModels: CarModelItem[];
    brands: BrandItem[];
}

const VersionForm: React.FC<Props> = ({ version, carModels, brands }) => {

    
    const isUpdate = !!version;
    const [open, setOpen] = useState(false);
    
    // Track selected brand to filter models
    const [selectedBrandId, setSelectedBrandId] = useState<string>('');

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm<VersionFormData>({
        _method: isUpdate ? 'patch' : undefined,
        version_name: version?.version_name ?? '',
        version_year: version?.version_year?.toString() ?? '',
        car_model_id: version?.car_model_id?.toString() ?? '',
    });

    // Filter models based on selected brand
    const filteredModels = useMemo(() => {
        return carModels.filter(model => model.brand_id.toString() === selectedBrandId);
    }, [selectedBrandId, carModels]);

    useEffect(() => {
        if (open) {
            // If updating, find the brand ID associated with the car_model_id
            const currentModel = carModels.find(m => m.id === version?.car_model_id);
            const brandId = currentModel ? currentModel.brand_id.toString() : '';
            
            setSelectedBrandId(brandId);
            setData({
                _method: isUpdate ? 'patch' : undefined,
                version_name: version?.version_name ?? '',
                version_year: version?.version_year?.toString() ?? '',
                car_model_id: version?.car_model_id?.toString() ?? '',
            });
            clearErrors();
        } else {
            if (!isUpdate) {
                reset();
                setSelectedBrandId('');
            }
        }
    }, [open, isUpdate, version, carModels, setData, clearErrors, reset]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route(isUpdate ? 'car.settings.version.update' : 'car.settings.version.store', version?.id), {
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={isUpdate ? 'outline' : 'default'} size={isUpdate ? 'icon' : 'default'}>
                    {isUpdate ? <Pencil className="h-4 w-4" /> : <><Plus className="mr-2 h-4 w-4" /> Add Version</>}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>{isUpdate ? 'Update Version' : 'Create Version'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4 pt-2">
                    {/* Brand Selection */}
                    <div className="space-y-2">
                        <Label>1. Select Brand</Label>
                        <Select 
                            value={selectedBrandId} 
                            onValueChange={(val) => {
                                setSelectedBrandId(val);
                                setData('car_model_id', ''); // Reset model if brand changes
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a brand..." />
                            </SelectTrigger>
                            <SelectContent>
                                {brands.map((b) => (
                                    <SelectItem key={b.id} value={b.id.toString()}>{b.brand_name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Model Selection (Disabled until Brand is selected) */}
                    <div className="space-y-2">
                        <Label>2. Select Model</Label>
                        <Select 
                            value={data.car_model_id} 
                            onValueChange={(val) => setData('car_model_id', val)}
                            disabled={!selectedBrandId}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={selectedBrandId ? "Choose a model..." : "Select brand first"} />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredModels.map((m) => (
                                    <SelectItem key={m.id} value={m.id.toString()}>{m.model_name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.car_model_id} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="version_name">Version Name</Label>
                            <Input 
                                id="version_name"
                                placeholder="e.g. XLE"
                                value={data.version_name} 
                                onChange={(e) => setData('version_name', e.target.value)} 
                            />
                            <InputError message={errors.version_name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="version_year">Year</Label>
                            <Input 
                                id="version_year"
                                placeholder="e.g. 2024"
                                value={data.version_year} 
                                onChange={(e) => setData('version_year', e.target.value)} 
                            />
                            <InputError message={errors.version_year} />
                        </div>
                    </div>

                    <Button disabled={processing} className="w-full">
                        {processing ? 'Saving…' : isUpdate ? 'Update Version' : 'Create Version'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default VersionForm;