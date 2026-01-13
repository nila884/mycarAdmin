'use client';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrandItem } from '@/pages/car/settings/brand';
import { useForm } from '@inertiajs/react';
import { ImagePlus, Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';

type BrandFormData = {
    brand_name: string;
    logo: File | null;
};

type BrandInertiaForm = BrandFormData & {
    _method?: 'patch';
};

interface Props {
    brand?: BrandItem;
}

const BrandForm: React.FC<Props> = ({ brand }) => {
    const isUpdate = !!brand;
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    // Added setError and clearErrors to handle manual frontend validation
    const { data, setData, post, processing, errors, setError, clearErrors } = useForm<BrandInertiaForm>({
        _method: isUpdate ? 'patch' : undefined,
        brand_name: brand?.brand_name ?? '',
        logo: null,
    });

    useEffect(() => {
        if (open) {
            setData({
                _method: isUpdate ? 'patch' : undefined,
                brand_name: brand?.brand_name ?? '',
                logo: null,
            });
            setPreview(brand?.logo ?? null);
            clearErrors(); // Clear errors when reopening the modal
        }
    }, [open, brand, isUpdate, setData, clearErrors]);

    // FRONTEND VALIDATION: Dropzone level
    const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
        clearErrors('logo');

        if (fileRejections.length > 0) {
            const error = fileRejections[0].errors[0];
            if (error.code === 'file-too-large') {
                setError('logo', 'The image must be less than 1MB.');
            } else if (error.code === 'file-invalid-type') {
                setError('logo', 'Only PNG, JPG, and JPEG are allowed.');
            }
            return;
        }

        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setPreview(URL.createObjectURL(file));
            setData('logo', file);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        maxSize: 1048576, 
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/jpg': []
        },
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // FRONTEND VALIDATION: Pre-submit checks
        if (!data.brand_name.trim()) {
            setError('brand_name', 'Brand name is required.');
            return;
        }

        if (!isUpdate && !data.logo) {
            setError('logo', 'A logo is required for new brands.');
            return;
        }

        post(route(isUpdate ? 'carbrand.update' : 'carbrand.store', brand?.id), { 
            forceFormData: true, 
            onSuccess: () => setOpen(false) 
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={isUpdate ? 'outline' : 'default'} size={isUpdate ? 'icon' : 'default'}>
                    {isUpdate ? <Pencil className="h-4 w-4" /> : 'Add Brand'}
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isUpdate ? 'Update Brand' : 'Create Brand'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label>Brand Name</Label>
                        <Input 
                            value={data.brand_name} 
                            onChange={(e) => {
                                clearErrors('brand_name');
                                setData('brand_name', e.target.value);
                            }} 
                        />
                        <InputError message={errors.brand_name} />
                    </div>

                    <div className="space-y-2">
                        <Label>Logo</Label>
                        <div 
                            {...getRootProps()} 
                            className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors
                                ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-200'}
                                ${errors.logo ? 'border-destructive' : ''}`}
                        >
                            <input {...getInputProps()} />
                            {preview ? (
                                <img src={preview} className="mx-auto h-24 rounded object-contain" alt="Preview" />
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <ImagePlus className="h-8 w-8" />
                                    <span className="text-sm">Click or drag logo (Max 1MB)</span>
                                </div>
                            )}
                        </div>
                        <InputError message={errors.logo} />
                    </div>

                    <Button disabled={processing} className="w-full">
                        {processing ? 'Saving…' : isUpdate ? 'Update Brand' : 'Create Brand'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default BrandForm;