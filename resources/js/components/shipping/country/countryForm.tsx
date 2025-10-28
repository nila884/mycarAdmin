// src/components/car/settings/country/CountryForm.tsx

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';
import { ImagePlus, XCircle, Pencil } from 'lucide-react';
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from "react-dropzone";
import { Textarea } from '@/components/ui/textarea';

// Define the base type for data that the server expects
type CountryFormData = {
    country_name: string;
    code: string;
    prefix: string;
    currency: string;
    flags: File | null;
    import_regulation_information: string;
};

// Define the full Inertia form type
type CountryInertiaForm = CountryFormData & {
    _method?: 'patch';
};

// Define the Country item received from the backend (used for 'update' mode)
interface CountryItem {
    id: number;
    country_name: string; // Maps to country_name
    code: string;
    prefix: string;
    currency: string;
    flags: string | null;
    import_regulation_information: string;
}

interface CountryFormProps {
    country?: CountryItem; // Optional: presence defines 'update' mode
}

const CountryForm: React.FC<CountryFormProps> = ({ country }) => {
    const isUpdate = !!country;
    const title = isUpdate ? `Update ${country?.country_name}` : 'Create New Country';
    const routeName = isUpdate ? 'country.update' : 'country.store';
    const submitText = isUpdate ? 'Update Country' : 'Create Country';

    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | ArrayBuffer | null>(isUpdate ? country!.flags : null);
    const [fileRejectionError, setFileRejectionError] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<CountryInertiaForm>({
        _method: isUpdate ? 'patch' : undefined,
        country_name: isUpdate ? country!.country_name : "",
        code: isUpdate ? country!.code : "",
        prefix: isUpdate ? country!.prefix : "",
        currency: isUpdate ? country!.currency : "",
        import_regulation_information: isUpdate ? country!.import_regulation_information || "" : "",
        flags: null,
    });

    // Reset form state when dialog opens/closes
    useEffect(() => {
        if (open) {
            setData({
                _method: isUpdate ? 'patch' : undefined,
                country_name: isUpdate ? country!.country_name : "",
                code: isUpdate ? country!.code : "",
                prefix: isUpdate ? country!.prefix : "",
                currency: isUpdate ? country!.currency : "",
                import_regulation_information: isUpdate ? country!.import_regulation_information || "" : "",
                flags: null,
            });
            setPreview(isUpdate ? country!.flags : null);
            setFileRejectionError(null);
        }
    }, [open, isUpdate, country, setData]);

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
        setFileRejectionError(null);
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setData('flags', file);
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
        if (fileRejections.length > 0) {
            setFileRejectionError("File must be PNG, JPG, JPEG, or SVG and under 512KB.");
        }
    }, [setData]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/svg+xml': ['.svg'],
        },
        maxSize: 512 * 1024,
        multiple: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Use POST with forceFormData for file upload, Inertia handles PATCH spoofing
        const routeParams = isUpdate ? [country!.id] : [];
        
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
                    {isUpdate ? <Pencil className="h-4 w-4" /> : 'Add New Country'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription/>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Country Name */}
                    <div>
                        <Label htmlFor="country_name">Country Name</Label>
                        <Input
                            id="country_name"
                            value={data.country_name}
                            onChange={(e) => setData('country_name', e.target.value)}
                        />
                        <InputError message={errors.country_name} />
                    </div>

                    {/* Code & Prefix */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="code">Code (e.g., USA)</Label>
                            <Input id="code" value={data.code} onChange={(e) => setData('code', e.target.value)} />
                            <InputError message={errors.code} />
                        </div>
                        <div>
                            <Label htmlFor="prefix">Prefix (e.g., +1)</Label>
                            <Input id="prefix" value={data.prefix} onChange={(e) => setData('prefix', e.target.value)} />
                            <InputError message={errors.prefix} />
                        </div>
                    </div>

                    {/* Currency */}
                    <div>
                        <Label htmlFor="currency">Currency (e.g., USD)</Label>
                        <Input id="currency" value={data.currency} onChange={(e) => setData('currency', e.target.value)} />
                        <InputError message={errors.currency} />
                    </div>

                    {/* import regulation infos */}

<div>
                        <Label htmlFor="import_regulation_information">Import Regulation Information</Label>
                        <Textarea
                            id="import_regulation_information"
                            placeholder="Enter detailed import regulations, documentation requirements, etc."
                            value={data.import_regulation_information}
                            onChange={(e) => setData('import_regulation_information', e.target.value)}
                        />
                        <InputError message={errors.import_regulation_information} />
                    </div>

                    {/* Flags Upload */}
                    <div>
                        <Label htmlFor="flags">Flag Image</Label>
                        <div
                            {...getRootProps()}
                            className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer
                                ${isDragActive ? 'border-primary' : 'border-gray-300'}
                                ${errors.flags || fileRejectionError ? 'border-destructive' : ''}
                            `}
                        >
                            <Input {...getInputProps()} />
                            {(data.flags || country?.flags) && preview ? (
                                <div className="relative">
                                    <img src={preview as string} alt="Flag Preview" className="max-h-[100px] w-auto object-contain rounded-lg mb-2" />
                                    {/* Clear button only appears if a NEW file is present or if we are updating and clearing the existing one */}
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-0 right-0 rounded-full h-6 w-6"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setData('flags', null); // Clear new file upload
                                            setPreview(isUpdate ? country!.flags : null); // Revert preview for update mode
                                            setFileRejectionError(null);
                                        }}
                                    >
                                        <XCircle className="h-3 w-3" />
                                    </Button>
                                </div>
                            ) : (
                                <ImagePlus className="size-12 text-gray-400 mb-2" />
                            )}
                            <p className="text-sm text-center text-gray-500">
                                {isDragActive ? "Drop the image here..." : `Drag 'n' drop, or click to ${isUpdate ? 'replace' : 'select'} flag`}
                            </p>
                        </div>
                        <InputError message={errors.flags ?? fileRejectionError ?? undefined} className="mt-2" />
                    </div>

                    <Button type="submit" disabled={processing} className="w-full">
                        {processing ? 'Submitting...' : submitText}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CountryForm;