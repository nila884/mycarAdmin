import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';
import React, { useState } from 'react'; // Import useState to manage dialog open/close state

// Define the type for your form data
type CreateSellerForm = {
    seller_name: string;
    phone: string;
    email: string;
    address: string;
    country: string;
};

const Create = () => {
    const [open, setOpen] = useState(false); 

    const { data, setData, post, processing, errors, reset } = useForm<CreateSellerForm>({
        seller_name: "",
        phone: "",
        email: "",
        address: "",
        country: "",
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission

        // Send the data using Inertia's post method
        post(route('carseller.store'), { // Target the 'carseller.store' route
            onSuccess: () => {
                reset(); // Reset form fields on successful submission
                setOpen(false); // Close the dialog
                console.log('Seller created successfully!');
            },
            onError: (errors) => {
                console.error('Submission error:', errors);
                // Errors are automatically available in the 'errors' object from useForm
            },
            onFinish: () => {
                // Any cleanup or final actions
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}> 
            <DialogTrigger asChild>
                <Button variant="outline">Add New Seller</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Seller</DialogTitle>
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
                          <Input
                            id="address"
                            type="text"
                            placeholder="Address"
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
                        {processing ? 'Submitting...' : 'Submit'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default Create;