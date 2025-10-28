// src/components/car/settings/shipping-cost/ShippingCostForm.tsx

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
import { Switch } from '@/components/ui/switch';
import React, { useState, useEffect } from 'react';
import { PortItem } from '@/pages/shipping/ports/list';


interface ShippingCostItem {
    id: number;
    price_roro: string; 
    price_container: string;
    is_current: boolean;
    port_id: number;
    port: PortItem;
}

// Define the base type for data that the server expects
type ShippingCostFormData = {
    port_id: number;
    price_roro: string;
    price_container: string;

    is_current: boolean;
};

// Define the full Inertia form type
type ShippingCostInertiaForm = ShippingCostFormData & {
    _method?: 'patch';
};

interface ShippingCostFormProps {
    ports: PortItem[];        
    cost?: ShippingCostItem;
}

const ShippingCostForm: React.FC<ShippingCostFormProps> = ({ cost, ports }) => {
    const isUpdate = !!cost;
    const title = isUpdate ? `Update Cost for ${cost?.port.name}` : 'Create New Shipping Cost';
    const routeName = isUpdate ? 'shipping.update' : 'shipping.store';
    const submitText = isUpdate ? 'Update Cost' : 'Create Cost';

    const [open, setOpen] = useState(false);
    
   const initialPriceRoro = isUpdate ? parseFloat(cost.price_roro.replace(/,/g, '')).toFixed(2) : "";
    const initialPriceContainer = isUpdate ? parseFloat(cost.price_container.replace(/,/g, '')).toFixed(2) : "";
    const { data, setData, post, processing, errors, reset } = useForm<ShippingCostInertiaForm>({
        _method: isUpdate ? 'patch' : undefined,
        port_id: isUpdate ? cost!.port_id : ports[0]?.id || 0,
        price_roro: initialPriceRoro,
        price_container: initialPriceContainer,
        is_current: isUpdate ? cost!.is_current : false,
    });

    // Reset form state when dialog opens/closes
    useEffect(() => {
        if (open) {
            setData({
                _method: isUpdate ? 'patch' : undefined,
                port_id: isUpdate ? cost!.port_id : ports[0]?.id || 0,
                price_roro: initialPriceRoro,
                price_container: initialPriceContainer,
                is_current: isUpdate ? cost!.is_current : false,
            });
        }
    }, [open, isUpdate, cost, ports, initialPriceRoro,initialPriceContainer, reset]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const routeParams = isUpdate ? [cost!.id] : [];

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
                    {isUpdate ? <Pencil className="h-4 w-4" /> : 'Add New Shipping Cost'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                      <DialogDescription/>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Port Selector */}
                    <div>
                        <Label htmlFor="port_id">Select Port</Label>
                        <Select
                            onValueChange={(value) => setData('port_id', parseInt(value))}
                            value={data.port_id?.toString() || ""}
                            disabled={ports.length === 0}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a Port and Country" />
                            </SelectTrigger>
                            <SelectContent>
                                {ports.map(port => (
                                    <SelectItem key={port.id} value={port.id.toString()}>
                                        {port.name} ({port.country.country_name})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.port_id} />
                    </div>

                    <div>
                        <Label htmlFor="price">Shipping Price Roro (USD)</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={data.price_roro}
                            onChange={(e) => setData('price_roro', e.target.value)}
                        />
                        <InputError message={errors.price_roro} />
                    </div>



                    <div className="flex items-center justify-between p-2 border rounded-lg">
                        <Label htmlFor="is_current">Set as Current Price</Label>
                        <Switch
                            id="is_current_roro"
                            checked={data.is_current}
                            onCheckedChange={(checked) => setData('is_current', checked)}
                            disabled={processing}
                        />
                    </div>

          <div>
                        <Label htmlFor="price_container">Shipping Price Container (USD)</Label>
                        <Input
                            id="price_container"
                            type="number"
                            step="0.01"
                            value={data.price_container}
                            onChange={(e) => setData('price_container', e.target.value)}
                        />
                        <InputError message={errors.price_roro} />
                    </div>

                    <InputError message={errors.is_current} />


                    <Button type="submit" disabled={processing} className="w-full">
                        {processing ? 'Submitting...' : submitText}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ShippingCostForm;