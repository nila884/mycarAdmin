'use client';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BrandItem } from '@/pages/car/settings/brand';
import { CarModelItem } from '@/pages/car/settings/model';
import { useForm } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type ModelFormData = {
    model_name: string;
    brand_id: string; // Shadcn Select uses strings for values
};

type ModelInertiaForm = ModelFormData & {
    _method?: 'patch';
};

interface Props {
    model?: CarModelItem;
    brands: BrandItem[];
}

const ModelForm: React.FC<Props> = ({ model, brands }) => {
    const isUpdate = !!model;
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, clearErrors } = useForm<ModelInertiaForm>({
        _method: isUpdate ? 'patch' : undefined,
        model_name: model?.model_name ?? '',
        brand_id: model?.brand_id?.toString() ?? '',
    });

    // Fix: Added missing dependencies to satisfy exhaustive-deps
    useEffect(() => {
        if (open) {
            setData({
                _method: isUpdate ? 'patch' : undefined,
                model_name: model?.model_name ?? '',
                brand_id: model?.brand_id?.toString() ?? '',
            });
            clearErrors();
        }
    }, [open, model, isUpdate, setData, clearErrors]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Convert brand_id back to number if needed by your Laravel backend
        post(route(isUpdate ? 'carmodel.update' : 'carmodel.store', model?.id), {
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={isUpdate ? 'outline' : 'default'} size={isUpdate ? 'icon' : 'default'}>
                    {isUpdate ? <Pencil className="h-4 w-4" /> : <><Plus className="mr-2 h-4 w-4" /> Add Model</>}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isUpdate ? 'Update Car Model' : 'Create Car Model'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-6 pt-2">
                    <div className="space-y-2">
                        <Label htmlFor="brand_id">Brand</Label>
                        {/* Shadcn Select Implementation */}
                        <Select 
                            value={data.brand_id} 
                            onValueChange={(value) => setData('brand_id', value)}
                        >
                            <SelectTrigger id="brand_id">
                                <SelectValue placeholder="Select a brand" />
                            </SelectTrigger>
                            <SelectContent>
                                {brands.map((b) => (
                                    <SelectItem key={b.id} value={b.id.toString()}>
                                        {b.brand_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.brand_id} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="model_name">Model Name</Label>
                        <Input 
                            id="model_name"
                            placeholder="e.g. Corolla, Civic, Mustang"
                            value={data.model_name} 
                            onChange={(e) => setData('model_name', e.target.value)} 
                        />
                        <InputError message={errors.model_name} />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button disabled={processing} type="submit">
                            {processing ? 'Saving…' : isUpdate ? 'Update Model' : 'Create Model'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ModelForm;