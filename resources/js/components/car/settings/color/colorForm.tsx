// src/components/car/settings/color/colorForm.tsx

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';
import { ImagePlus, XCircle, Pencil } from 'lucide-react';
import React, { useState, useCallback, useEffect } from 'react';
import { ColorItem } from '@/pages/car/settings/color';


type ColorFormData = {
    name: string;
    hex_code:string;

};

// Define the full Inertia form type
type ColorInertiaForm = ColorFormData & {
    _method?: 'patch';
};



interface ColorFormProps {
    color?: ColorItem
}

const colorForm: React.FC<ColorFormProps> = ({ color }) => {
    const isUpdate = !!color;
    const title = isUpdate ? `Update ${color?.name}` : 'Create New color';
    const routeName = isUpdate ? 'color.update' : 'color.store';
    const submitText = isUpdate ? 'Update color' : 'Create color';

    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<ColorInertiaForm>({
        _method: isUpdate ? 'patch' : undefined,
        name: isUpdate ? color!.name : "",
        hex_code: isUpdate? color!.hex_code: "",
      
    });

    // Reset form state when dialog opens/closes
    useEffect(() => {
        if (open) {
            setData({
                _method: isUpdate ? 'patch' : undefined,
                name: isUpdate ? color!.name : "",
                hex_code: isUpdate? color!.hex_code : "",
            });
        }
    }, [open, isUpdate, color, setData]);





    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Use POST with forceFormData for file upload, Inertia handles PATCH spoofing
        const routeParams = isUpdate ? [color!.id] : [];
        
        post(route(routeName, ...routeParams), {
            forceFormData: true,
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={isUpdate ? 'outline' : 'default'} size={isUpdate ? 'icon' : 'default'}>
                    {isUpdate ? <Pencil className="h-4 w-4" /> : 'Add New color'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription/>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* color Name */}
                    <div>
                        <Label htmlFor="color_name">color Name</Label>
                        <Input
                            id="color_name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label htmlFor="hex_code">Hex Color</Label>
                        <Input
                            id="hex_code"
                            placeholder="#221122"
                            value={data.hex_code}
                            onChange={(e) => setData('hex_code', e.target.value)}
                        />
                        
                        <InputError message={errors.hex_code} />
                    </div>

                    <Button type="submit" disabled={processing || !data.name } className="w-full">
                        {processing ? 'Submitting...' : submitText}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default colorForm;