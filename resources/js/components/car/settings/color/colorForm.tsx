import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ColorItem } from '@/pages/car/settings/color';
import { useForm } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type ColorFormData = {
    name: string;
    hex_code: string;
};

type ColorInertiaForm = ColorFormData & {
    _method?: 'patch';
};

interface ColorFormProps {
    color?: ColorItem;
}

const ColorForm: React.FC<ColorFormProps> = ({ color }) => {
    const isUpdate = !!color;
    const title = isUpdate ? `Update ${color?.name}` : 'Create New Color';
    const routeName = isUpdate ? 'car.settings.color.update' : 'car.settings.color.store';
    const submitText = isUpdate ? 'Update Color' : 'Create Color';

    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm<ColorInertiaForm>({
        _method: isUpdate ? 'patch' : undefined,
        name: isUpdate ? color!.name : '',
        hex_code: isUpdate ? color!.hex_code : '#000000', // Default to black for new colors
    });

    useEffect(() => {
        if (open) {
            setData({
                _method: isUpdate ? 'patch' : undefined,
                name: isUpdate ? color!.name : '',
                hex_code: isUpdate ? color!.hex_code : '#000000',
            });
        }
    }, [open, isUpdate, color, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const routeParams = isUpdate ? [color!.id] : [];

        post(route(routeName, ...routeParams), {
            forceFormData: true,
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={isUpdate ? 'outline' : 'default'} size={isUpdate ? 'icon' : 'default'}>
                    {isUpdate ? <Pencil className="h-4 w-4" /> : 'Add New Color'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Color Name */}
                    <div>
                        <Label htmlFor="color_name">Color Name</Label>
                        <Input 
                            id="color_name" 
                            placeholder="e.g. Midnight Blue" 
                            value={data.name} 
                            onChange={(e) => setData('name', e.target.value)} 
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Hex Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="hex_code">Select Color</Label>
                        <div className="flex gap-2">
                            {/* Visual Picker */}
                            <Input
                                type="color"
                                id="hex_picker"
                                className="w-12 p-1 h-10 cursor-pointer"
                                value={data.hex_code}
                                onChange={(e) => setData('hex_code', e.target.value)}
                            />
                            {/* Manual Hex Input */}
                            <Input 
                                id="hex_code" 
                                className="flex-1"
                                placeholder="#000000" 
                                value={data.hex_code} 
                                onChange={(e) => setData('hex_code', e.target.value)} 
                            />
                        </div>
                        <InputError message={errors.hex_code} />
                    </div>

                    <Button type="submit" disabled={processing || !data.name} className="w-full">
                        {processing ? 'Submitting...' : submitText}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ColorForm;