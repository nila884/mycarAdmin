'use client';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FuelItem } from '@/pages/car/settings/fuel';
import { useForm } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';


interface FuelFormProps {
    fuel?: FuelItem; // Optional: if present, we are in "Update" mode
}

const FuelForm = ({ fuel }: FuelFormProps) => {
    const isUpdate = !!fuel;
    const [open, setOpen] = useState(false);

    // Initialize Inertia useForm
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        fuel_type: fuel?.fuel_type ?? '',
    });

    // Reset or Sync data when the dialog opens or fuel prop changes
    useEffect(() => {
        if (open) {
            setData('fuel_type', fuel?.fuel_type ?? '');
        }
    }, [open, fuel,setData]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isUpdate) {
            patch(route('car.settings.fuel.update', fuel.id), {
                onSuccess: () => setOpen(false),
            });
        } else {
            post(route('car.settings.fuel.store'), {
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
                {isUpdate ? (
                    <Button variant="outline" size="sm">
                        <Pencil className="mr-2 h-4 w-4" /> Update
                    </Button>
                ) : (
                    <Button variant="default">
                        <Plus className="mr-2 h-4 w-4" /> Add Fuel Type
                    </Button>
                )}
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isUpdate ? 'Update Fuel Type' : 'New Fuel Type'}</DialogTitle>
                    <DialogDescription>
                        {isUpdate 
                            ? 'Modify the existing fuel type name.' 
                            : 'Enter the name of the new fuel type (e.g., Electric, Hybrid).'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6 pt-4">
                    <div className="grid gap-2">
                        <Label htmlFor="fuel_type">Fuel Type Name</Label>
                        <Input
                            id="fuel_type"
                            placeholder="e.g. Diesel"
                            value={data.fuel_type}
                            onChange={(e) => setData('fuel_type', e.target.value)}
                            disabled={processing}
                            autoFocus
                        />
                        <InputError message={errors.fuel_type} />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing || !data.fuel_type}>
                            {processing ? 'Saving...' : isUpdate ? 'Save Changes' : 'Create Fuel'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default FuelForm;