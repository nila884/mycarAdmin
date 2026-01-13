'use client';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { Pencil, UserPlus, ImagePlus, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { CountryObject, Seller } from '@/lib/object';

type SellerFormData = {
    seller_name: string;
    phone: string;
    avatar: File | null;
    description: string;
    country: string;
    address: string;
    _method?: 'patch';
};

interface SellerFormProps {
    seller?: Seller;
    countries: CountryObject[];
}

const SellerForm: React.FC<SellerFormProps> = ({ seller, countries }) => {
    const isUpdate = !!seller;
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | ArrayBuffer | null>(seller?.avatar ?? null);
    const [fileError, setFileError] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset, setError, clearErrors } = useForm<SellerFormData>({
        seller_name: seller?.seller_name ?? '',
        phone: seller?.phone ?? '',
        avatar: null,
        description: seller?.description ?? '',
        country: seller?.country ?? '',
        address: seller?.address ?? '',
        _method: isUpdate ? 'patch' : undefined,
    });

    useEffect(() => {
        if (open) {
            setData({
                seller_name: seller?.seller_name ?? '',
                phone: seller?.phone ?? '',
                avatar: null,
                description: seller?.description ?? '',
                country: seller?.country ?? '',
                address: seller?.address ?? '',
                _method: isUpdate ? 'patch' : undefined,
            });
            setPreview(seller?.avatar ?? null);
            setFileError(null);
            clearErrors();
        }
    }, [open, seller, isUpdate, setData, clearErrors]);

    const onDrop = React.useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        // Clear previous local and server errors for avatar
        setFileError(null);
        clearErrors('avatar');

        if (fileRejections.length > 0) {
            const error = fileRejections[0].errors[0];
            if (error.code === 'file-too-large') {
                setFileError('Avatar must be less than 1MB.');
            } else if (error.code === 'file-invalid-type') {
                setFileError('Only PNG, JPG, or JPEG files are allowed.');
            }
            return;
        }

        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result);
                setData('avatar', file);
            };
            reader.readAsDataURL(file);
        }
    }, [setData, clearErrors]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        maxSize: 1048576, // 1MB
        accept: { 'image/png': [], 'image/jpg': [], 'image/jpeg': [] },
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Final frontend check: Avatar is usually required for a new seller
        if (!isUpdate && !data.avatar) {
            setError('avatar', 'A profile picture is required.');
            return;
        }

        const url = isUpdate ? route('carseller.update', seller.id) : route('carseller.store');
        
        post(url, {
            forceFormData: true,
            onSuccess: () => {
                setOpen(false);
                if (!isUpdate) reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={isUpdate ? "outline" : "default"} size={isUpdate ? "icon" : "default"}>
                    {isUpdate ? <Pencil className="h-4 w-4" /> : <><UserPlus className="mr-2 h-4 w-4" /> Add Seller</>}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isUpdate ? 'Edit Seller Profile' : 'Register New Seller'}</DialogTitle>
                    <DialogDescription>Fill in the seller details. All fields except description are required.</DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    {/* Avatar Upload Container */}
                    <div className="flex flex-col items-center gap-2">
                        <div {...getRootProps()} className="relative cursor-pointer group">
                            <input {...getInputProps()} />
                            <div className={`size-28 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden bg-gray-50 transition-colors 
                                ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
                                ${(errors.avatar || fileError) ? 'border-destructive' : 'group-hover:border-primary'}
                            `}>
                                {preview ? (
                                    <img src={preview as string} alt="Avatar" className="size-full object-cover" />
                                ) : (
                                    <ImagePlus className="size-10 text-gray-400" />
                                )}
                            </div>
                            {/* Visual indicator for "Change" or "Add" */}
                            <div className="absolute bottom-1 right-1 bg-primary text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                                {isUpdate ? <Pencil className="size-3" /> : <Plus className="size-3" />}
                            </div>
                        </div>
                        <Label className="text-xs text-gray-500">Seller Avatar (Max 1MB)</Label>
                        <InputError message={errors.avatar || fileError || ''} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="seller_name">Full Name</Label>
                            <Input id="seller_name" value={data.seller_name} onChange={e => setData('seller_name', e.target.value)} />
                            <InputError message={errors.seller_name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" value={data.phone} onChange={e => setData('phone', e.target.value)} />
                            <InputError message={errors.phone} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select value={data.country} onValueChange={(val) => setData('country', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                            <SelectContent>
                                {countries.map((c) => (
                                    <SelectItem key={c.id} value={c.country_name}>{c.country_name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.country} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" value={data.address} onChange={e => setData('address', e.target.value)} />
                        <InputError message={errors.address} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea id="description" rows={3} value={data.description} onChange={e => setData('description', e.target.value)} />
                        <InputError message={errors.description} />
                    </div>

                    <Button type="submit" className="w-full" disabled={processing}>
                        {processing ? 'Saving...' : isUpdate ? 'Update Seller' : 'Create Seller'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default SellerForm;