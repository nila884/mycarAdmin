import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea'; // Assuming you might use a textarea for address

// Define the type for your form data
type EditSellerForm = {
    seller_name: string;
    phone: string;
    email: string;
    address: string;
    country: string;
    _method?: 'patch'; // For Inertia's PUT/PATCH requests
};

// Define the props for this component, which will include the seller data
interface EditSellerProps {
    seller: {
        id: number;
        seller_name: string;
        phone: string;
        email: string;
        address: string;
        country: string;
        created_at: string;
        updated_at: string;
    };
}

const Update: React.FC<EditSellerProps> = ({ seller }) => {
    const [open, setOpen] = useState(false); // State to control dialog visibility

    const { data, setData, patch, processing, errors, reset } = useForm<EditSellerForm>({
        seller_name: seller.seller_name,
        phone: seller.phone,
        email: seller.email,
        address: seller.address,
        country: seller.country,
        _method: 'patch', // Important for Laravel's PATCH method spoofing
    });

    // Reset form data when the dialog opens or seller prop changes
    useEffect(() => {
        if (open) {
            setData({
                seller_name: seller.seller_name,
                phone: seller.phone,
                email: seller.email,
                address: seller.address,
                country: seller.country,
                _method: 'patch',
            });
            reset(); // Clear any previous errors
        }
    }, [open, seller]);


    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission

        // Send the data using Inertia's patch method
        patch(route('carseller.update', seller.id), { // Target the 'carseller.update' route with seller ID
            onSuccess: () => {
                setOpen(false); // Close the dialog
                // You might want to show a success message here
                console.log('Seller updated successfully!');
            },
            onError: (errors) => {
                console.error('Update error:', errors);
            },
            onFinish: () => {
                // Any cleanup or final actions
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Update Seller</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="seller_name">Seller Name</Label>
                        <Input
                            id="seller_name"
                            placeholder="Seller's full name"
                            value={data.seller_name}
                            onChange={(e) => setData('seller_name', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.seller_name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="seller@example.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            type="text"
                            placeholder="e.g., +1234567890"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.phone} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                            id="address"
                            placeholder="Seller's physical address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.address} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                            id="country"
                            type="text"
                            placeholder="Country"
                            value={data.country}
                            onChange={(e) => setData('country', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.country} className="mt-2" />
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Updating...' : 'Update Seller'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default Update;